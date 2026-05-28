import { randomUUID } from "crypto";
import { INSPECTION_DISCLAIMER_SHORT } from "./disclaimer";
import { nicheLabel } from "./niches";
import type {
  InspectionInput,
  InspectionIssue,
  InspectionReport,
  PhotoNote,
  TurnoverReady,
} from "./types";

export type AnalysisDraft = {
  summary: string;
  overallAssessment: string;
  turnoverReady: TurnoverReady;
  issues: Omit<InspectionIssue, "id">[];
  recommendedActions: string[];
  photoNotes: Omit<PhotoNote, "fileName">[];
};

export function buildReportFromAnalysis(
  draft: AnalysisDraft,
  input: InspectionInput,
  photoMeta: { fileName: string }[]
): InspectionReport {
  const id = `INSP-${randomUUID().slice(0, 8).toUpperCase()}`;
  const generatedAt = new Date().toISOString();

  const issues: InspectionIssue[] = draft.issues.map((issue) => ({
    ...issue,
    id: `ISS-${randomUUID().slice(0, 6)}`,
  }));

  const photoNotes: PhotoNote[] = draft.photoNotes.map((pn) => ({
    ...pn,
    fileName: photoMeta[pn.photoIndex]?.fileName ?? `Photo ${pn.photoIndex + 1}`,
  }));

  const title = `${nicheLabel[input.niche]} — ${input.propertyLabel || "Inspection"}`;

  const printableSummary = [
    title,
    `Report ID: ${id}`,
    `Generated: ${new Date(generatedAt).toLocaleString()}`,
    input.inspectorName ? `Inspector: ${input.inspectorName}` : "",
    "",
    "SUMMARY",
    draft.summary,
    "",
    "OVERALL ASSESSMENT",
    draft.overallAssessment,
    input.niche === "apartment_turnover"
      ? `Turnover ready: ${draft.turnoverReady.toUpperCase()}`
      : "",
    "",
    "ISSUES",
    ...issues.map(
      (i, n) =>
        `${n + 1}. [${i.severity.toUpperCase()}] ${i.category} — ${i.location}\n   ${i.description}\n   Action: ${i.recommendedAction}`
    ),
    "",
    "RECOMMENDED ACTIONS",
    ...draft.recommendedActions.map((a) => `• ${a}`),
    "",
    "PHOTO NOTES",
    ...photoNotes.map(
      (p) => `Photo ${p.photoIndex + 1} (${p.fileName}): ${p.note}`
    ),
    "",
    INSPECTION_DISCLAIMER_SHORT,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    id,
    title,
    generatedAt,
    niche: input.niche,
    propertyLabel: input.propertyLabel,
    inspectorName: input.inspectorName,
    summary: draft.summary,
    overallAssessment: draft.overallAssessment,
    turnoverReady: draft.turnoverReady,
    issues,
    recommendedActions: draft.recommendedActions,
    photoNotes,
    printableSummary,
  };
}

export function rebuildPrintableSummary(report: InspectionReport): string {
  const lines = [
    report.title,
    `Report ID: ${report.id}`,
    `Generated: ${new Date(report.generatedAt).toLocaleString()}`,
    report.inspectorName ? `Inspector: ${report.inspectorName}` : "",
    "",
    "SUMMARY",
    report.summary,
    "",
    "OVERALL ASSESSMENT",
    report.overallAssessment,
    report.niche === "apartment_turnover"
      ? `Turnover ready: ${report.turnoverReady.toUpperCase()}`
      : "",
    "",
    "ISSUES",
    ...report.issues.map(
      (i, n) =>
        `${n + 1}. [${i.severity.toUpperCase()}] ${i.category} — ${i.location}\n   ${i.description}\n   Action: ${i.recommendedAction}`
    ),
    "",
    "RECOMMENDED ACTIONS",
    ...report.recommendedActions.map((a) => `• ${a}`),
    "",
    "PHOTO NOTES",
    ...report.photoNotes.map(
      (p) => `Photo ${p.photoIndex + 1} (${p.fileName}): ${p.note}`
    ),
    "",
    INSPECTION_DISCLAIMER_SHORT,
  ].filter(Boolean);
  return lines.join("\n");
}

export function applyReportEdits(
  report: InspectionReport,
  patch: Partial<InspectionReport>
): InspectionReport {
  const next = { ...report, ...patch };
  return { ...next, printableSummary: rebuildPrintableSummary(next) };
}
