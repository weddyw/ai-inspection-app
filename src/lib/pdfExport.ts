import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { INSPECTION_DISCLAIMER_SHORT } from "./disclaimer";
import type { InspectionReport, UploadedPhoto } from "./types";

const MARGIN = 50;
const LINE = 14;
const PAGE_W = 612;
const PAGE_H = 792;

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (next.length > maxChars) {
      if (line) lines.push(line);
      line = w;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

async function embedPhoto(
  doc: PDFDocument,
  dataUrl: string
): Promise<{ image: Awaited<ReturnType<PDFDocument["embedJpg"]>>; width: number; height: number } | null> {
  try {
    const base64 = dataUrl.split(",")[1];
    if (!base64) return null;
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    if (dataUrl.includes("image/png")) {
      const image = await doc.embedPng(bytes);
      return { image, width: image.width, height: image.height };
    }
    const image = await doc.embedJpg(bytes);
    return { image, width: image.width, height: image.height };
  } catch {
    return null;
  }
}

export async function buildInspectionPdf(
  report: InspectionReport,
  photos: UploadedPhoto[]
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  let page = doc.addPage([PAGE_W, PAGE_H]);
  let y = PAGE_H - MARGIN;

  const newPage = () => {
    page = doc.addPage([PAGE_W, PAGE_H]);
    y = PAGE_H - MARGIN;
  };

  const needSpace = (h: number) => {
    if (y - h < MARGIN + 40) newPage();
  };

  page.drawText("AI Inspection Report", {
    x: MARGIN,
    y,
    size: 10,
    font: bold,
    color: rgb(0.15, 0.35, 0.55),
  });
  y -= LINE;
  page.drawText(report.title, { x: MARGIN, y, size: 12, font: bold });
  y -= LINE;
  for (const m of [
    `Report ID: ${report.id}`,
    `Generated: ${new Date(report.generatedAt).toLocaleString()}`,
    report.propertyLabel ? `Property: ${report.propertyLabel}` : "",
    report.inspectorName ? `Inspector: ${report.inspectorName}` : "",
  ].filter(Boolean)) {
    page.drawText(m, { x: MARGIN, y, size: 9, font });
    y -= LINE - 2;
  }
  y -= 6;

  const section = (heading: string, lines: string[]) => {
    needSpace(LINE * 3);
    page.drawText(heading, { x: MARGIN, y, size: 11, font: bold });
    y -= LINE;
    for (const raw of lines) {
      for (const line of wrapText(raw, 88)) {
        needSpace(LINE);
        page.drawText(line, { x: MARGIN, y, size: 10, font });
        y -= LINE;
      }
    }
    y -= 6;
  };

  section("SUMMARY", [report.summary]);
  section("OVERALL ASSESSMENT", [report.overallAssessment]);
  if (report.niche === "apartment_turnover") {
    section("TURNOVER STATUS", [`Ready: ${report.turnoverReady.toUpperCase()}`]);
  }
  section(
    "ISSUES",
    report.issues.map(
      (i, n) =>
        `${n + 1}. [${i.severity.toUpperCase()}] ${i.category} @ ${i.location}: ${i.description} → ${i.recommendedAction}`
    )
  );
  section("RECOMMENDED ACTIONS", report.recommendedActions.map((a) => `• ${a}`));

  for (const pn of report.photoNotes) {
    needSpace(180);
    page.drawText(`Photo ${pn.photoIndex + 1}: ${pn.fileName}`, {
      x: MARGIN,
      y,
      size: 10,
      font: bold,
    });
    y -= LINE;
    for (const line of wrapText(pn.note, 88)) {
      needSpace(LINE);
      page.drawText(line, { x: MARGIN, y, size: 9, font });
      y -= LINE;
    }
    const photo = photos[pn.photoIndex];
    if (photo?.dataUrl) {
      const embedded = await embedPhoto(doc, photo.dataUrl);
      if (embedded) {
        const maxW = PAGE_W - MARGIN * 2;
        const scale = Math.min(1, maxW / embedded.width, 120 / embedded.height);
        const w = embedded.width * scale;
        const h = embedded.height * scale;
        needSpace(h + 10);
        page.drawImage(embedded.image, {
          x: MARGIN,
          y: y - h,
          width: w,
          height: h,
        });
        y -= h + 12;
      }
    }
  }

  const footerLines = wrapText(INSPECTION_DISCLAIMER_SHORT, 95);
  for (const p of doc.getPages()) {
    let fy = 28;
    for (const line of footerLines) {
      p.drawText(line, {
        x: MARGIN,
        y: fy,
        size: 7,
        font,
        color: rgb(0.35, 0.35, 0.35),
      });
      fy -= 9;
    }
  }

  return doc.save();
}

export function downloadPdf(bytes: Uint8Array, filename: string) {
  const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
