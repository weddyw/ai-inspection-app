import { analyzeInspectionPhotos } from "@/lib/aiAnalyze";
import { buildReportFromAnalysis } from "@/lib/buildReport";
import type { InspectionInput, InspectionNiche } from "@/lib/types";

export const runtime = "nodejs";

const MIN_PHOTOS = 5;
const MAX_PHOTOS = 20;
const MAX_BYTES = 8 * 1024 * 1024;

const niches: InspectionNiche[] = [
  "apartment_turnover",
  "equipment_inspection",
  "roof_inspection",
  "vehicle_inspection",
];

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const files = form.getAll("photos").filter((f) => f instanceof File) as File[];

    if (files.length < MIN_PHOTOS) {
      return Response.json(
        { ok: false, error: `Upload at least ${MIN_PHOTOS} photos (max ${MAX_PHOTOS}).` },
        { status: 400 }
      );
    }

    if (files.length > MAX_PHOTOS) {
      return Response.json(
        { ok: false, error: `Maximum ${MAX_PHOTOS} photos per inspection.` },
        { status: 400 }
      );
    }

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        return Response.json({ ok: false, error: "Only image files are allowed." }, { status: 400 });
      }
      if (file.size > MAX_BYTES) {
        return Response.json(
          { ok: false, error: `Each photo must be under ${MAX_BYTES / 1024 / 1024} MB.` },
          { status: 400 }
        );
      }
    }

    const niche = niches.includes(form.get("niche") as InspectionNiche)
      ? (form.get("niche") as InspectionNiche)
      : "apartment_turnover";

    const input: InspectionInput = {
      niche,
      propertyLabel: String(form.get("propertyLabel") ?? "").slice(0, 200),
      unitNotes: String(form.get("unitNotes") ?? "").slice(0, 2000),
      inspectorName: String(form.get("inspectorName") ?? "").slice(0, 100),
    };

    const images = await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        return {
          base64: buffer.toString("base64"),
          mimeType: file.type || "image/jpeg",
          fileName: file.name.slice(0, 120),
        };
      })
    );

    const draft = await analyzeInspectionPhotos(images, niche, {
      propertyLabel: input.propertyLabel,
      unitNotes: input.unitNotes,
    });

    const report = buildReportFromAnalysis(
      draft,
      input,
      images.map((i) => ({ fileName: i.fileName }))
    );

    return Response.json({ ok: true, report });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Analysis failed";
    const status = message.includes("OPENAI_API_KEY") ? 503 : 500;
    return Response.json({ ok: false, error: message }, { status });
  }
}
