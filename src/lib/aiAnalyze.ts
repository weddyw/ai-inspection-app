import OpenAI from "openai";
import type { AnalysisDraft } from "./buildReport";
import { getNiche } from "./niches";
import type { InspectionNiche, Severity, TurnoverReady } from "./types";

const MAX_IMAGES = 20;

function asSeverity(v: unknown): Severity {
  const s = String(v).toLowerCase();
  if (s === "low" || s === "medium" || s === "high" || s === "critical") return s;
  return "medium";
}

function asTurnoverReady(v: unknown, niche: InspectionNiche): TurnoverReady {
  if (niche !== "apartment_turnover") return "n/a";
  const s = String(v).toLowerCase();
  if (s === "yes" || s === "no" || s === "conditional") return s;
  return "conditional";
}

export async function analyzeInspectionPhotos(
  images: { base64: string; mimeType: string; fileName: string }[],
  niche: InspectionNiche,
  context: { propertyLabel: string; unitNotes: string }
): Promise<AnalysisDraft> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured on the server.");
  }

  const template = getNiche(niche);
  const limited = images.slice(0, MAX_IMAGES);

  const client = new OpenAI({ apiKey });

  const nicheGuidance: Record<InspectionNiche, string> = {
    apartment_turnover:
      "Focus on move-out condition: wall damage, trash, stains, broken fixtures, flooring, cleanliness. Set turnoverReady to yes/no/conditional.",
    equipment_inspection:
      "Focus on industrial equipment visible condition: wear, leaks, missing guards, housekeeping. Set turnoverReady to n/a.",
    roof_inspection:
      "Focus on roof exterior: shingles, flashing, gutters, penetrations. Note if photos are insufficient for structural conclusions. Set turnoverReady to n/a.",
    vehicle_inspection:
      "Focus on vehicle body, tires, lights, glass, interior, visible leaks. Set turnoverReady to n/a.",
  };

  const prompt = `You are an AI inspection assistant. You help document visual findings — you do NOT replace licensed inspectors.

Inspection type: ${template?.label ?? niche}
Property / asset: ${context.propertyLabel || "Not specified"}
Notes: ${context.unitNotes || "None"}

${nicheGuidance[niche]}

Analyze ALL ${limited.length} photos together. Reference photo index (0-based) when an issue is clearly from one image.

Return ONLY valid JSON:
{
  "summary": "2-4 sentence executive summary",
  "overallAssessment": "1-2 sentences on overall condition",
  "turnoverReady": "yes" | "no" | "conditional" | "n/a",
  "issues": [
    {
      "category": "string from typical categories",
      "severity": "low" | "medium" | "high" | "critical",
      "location": "room/area or equipment part",
      "description": "what you see",
      "recommendedAction": "specific next step",
      "photoIndex": 0
    }
  ],
  "recommendedActions": ["priority actions"],
  "photoNotes": [
    { "photoIndex": 0, "note": "brief caption of what this photo documents" }
  ]
}

Rules:
- Only report what is visible; do not invent hidden defects.
- Be conservative on severity.
- Include 3-12 issues if visible; empty array only if unit appears pristine.
- photoNotes: one entry per photo index provided (0 to ${limited.length - 1}).`;

  const content: OpenAI.Chat.Completions.ChatCompletionContentPart[] = [
    { type: "text", text: prompt },
    ...limited.map((img) => ({
      type: "image_url" as const,
      image_url: {
        url: `data:${img.mimeType};base64,${img.base64}`,
        detail: "low" as const,
      },
    })),
  ];

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [{ role: "user", content }],
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(raw) as Record<string, unknown>;

  const issuesRaw = Array.isArray(parsed.issues) ? parsed.issues : [];
  const issues = issuesRaw.slice(0, 20).map((item) => {
    const o = item as Record<string, unknown>;
    return {
      category: String(o.category ?? "General").slice(0, 80),
      severity: asSeverity(o.severity),
      location: String(o.location ?? "See photo").slice(0, 120),
      description: String(o.description ?? "").slice(0, 500),
      recommendedAction: String(o.recommendedAction ?? "Verify on site").slice(0, 300),
      photoIndex:
        typeof o.photoIndex === "number" && o.photoIndex >= 0
          ? Math.min(o.photoIndex, limited.length - 1)
          : undefined,
    };
  });

  const photoNotesRaw = Array.isArray(parsed.photoNotes) ? parsed.photoNotes : [];
  const photoNotes = limited.map((_, index) => {
    const found = photoNotesRaw.find(
      (p) => (p as Record<string, unknown>).photoIndex === index
    ) as Record<string, unknown> | undefined;
    return {
      photoIndex: index,
      note: String(found?.note ?? `Documentation photo ${index + 1}`).slice(0, 300),
    };
  });

  const recommendedActions = Array.isArray(parsed.recommendedActions)
    ? parsed.recommendedActions.map((a) => String(a).slice(0, 300)).slice(0, 12)
    : [];

  return {
    summary: String(parsed.summary ?? "Inspection completed.").slice(0, 1500),
    overallAssessment: String(parsed.overallAssessment ?? "").slice(0, 800),
    turnoverReady: asTurnoverReady(parsed.turnoverReady, niche),
    issues,
    recommendedActions,
    photoNotes,
  };
}
