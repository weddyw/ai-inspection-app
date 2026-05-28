import OpenAI from "openai";
import type { AnalysisDraft } from "./buildReport";
import { getTemplate } from "./niches";
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

  const template = getTemplate(niche);
  const limited = images.slice(0, MAX_IMAGES);
  const client = new OpenAI({ apiKey });

  const visionList = (template?.visionTargets ?? []).map((v) => `- ${v}`).join("\n");

  const prompt = `You are an AI vision inspection assistant. Document ONLY what is visible in photos. You do NOT replace licensed inspectors.

INSPECTION TEMPLATE: ${template?.label ?? niche}
Property / asset: ${context.propertyLabel || "Not specified"}
Notes: ${context.unitNotes || "None"}

Look specifically for issues like:
${visionList}

Analyze all ${limited.length} photos together. For each issue, set photoRef to the 1-based photo number (1 = first photo, 2 = second, etc.) where the issue is clearest.

Return ONLY valid JSON:
{
  "summary": "2-4 sentence executive summary",
  "overallAssessment": "1-2 sentences on overall condition",
  "turnoverReady": "yes" | "no" | "conditional" | "n/a",
  "issues": [
    {
      "issue": "short issue title e.g. Cracked drywall, Water stain, Rust on guard",
      "severity": "low" | "medium" | "high" | "critical",
      "recommendation": "specific action for maintenance or turnover",
      "photoRef": 1,
      "location": "room or area optional",
      "category": "category from template"
    }
  ],
  "recommendedActions": ["top priority follow-ups"],
  "photoNotes": [
    { "photoIndex": 0, "note": "what this photo documents" }
  ]
}

Rules:
- Use plain maintenance language (debris, water damage, rust, cracked drywall, overflowing dumpster, missing ceiling tile, etc. when visible).
- photoRef must be between 1 and ${limited.length}.
- Do not invent issues not visible in photos.
- 3-15 issues if problems visible; empty only if condition is clearly acceptable.
- photoNotes: one per photo index 0 to ${limited.length - 1}.`;

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
    let photoRef = Number(o.photoRef ?? o.photoIndex);
    if (!Number.isFinite(photoRef) || photoRef < 1) photoRef = 1;
    photoRef = Math.min(Math.max(1, Math.round(photoRef)), limited.length);

    const issueText = String(
      o.issue ?? o.description ?? o.category ?? "Visible defect"
    ).slice(0, 200);

    return {
      issue: issueText,
      severity: asSeverity(o.severity),
      recommendation: String(
        o.recommendation ?? o.recommendedAction ?? "Verify on site and repair as needed"
      ).slice(0, 400),
      photoRef,
      location: String(o.location ?? "").slice(0, 120),
      category: String(o.category ?? "General").slice(0, 80),
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
