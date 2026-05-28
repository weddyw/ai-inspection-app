"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import PhotoUpload from "@/components/PhotoUpload";
import SafetyDisclaimer from "@/components/SafetyDisclaimer";
import { applyReportEdits } from "@/lib/buildReport";
import { buildInspectionPdf, downloadPdf } from "@/lib/pdfExport";
import { inspectionNiches } from "@/lib/niches";
import type {
  InspectionInput,
  InspectionNiche,
  InspectionReport,
  UploadedPhoto,
} from "@/lib/types";

const MIN_PHOTOS = 5;

const steps = [
  { n: 1, label: "Upload photos" },
  { n: 2, label: "Inspection type" },
  { n: 3, label: "AI analysis" },
  { n: 4, label: "Report" },
] as const;

const defaultInput: InspectionInput = {
  niche: "apartment_turnover",
  propertyLabel: "",
  unitNotes: "",
  inspectorName: "",
};

export default function InspectPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [input, setInput] = useState<InspectionInput>(defaultInput);
  const [report, setReport] = useState<InspectionReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [error, setError] = useState("");

  async function runAnalysis() {
    setLoading(true);
    setError("");
    setReport(null);
    try {
      const form = new FormData();
      photos.forEach((p) => form.append("photos", p.file));
      form.append("niche", input.niche);
      form.append("propertyLabel", input.propertyLabel);
      form.append("unitNotes", input.unitNotes);
      form.append("inspectorName", input.inspectorName);

      const res = await fetch("/api/analyze", { method: "POST", body: form });
      const data = (await res.json()) as
        | { ok: true; report: InspectionReport }
        | { ok: false; error: string };

      if (!data.ok) {
        setError(data.error || "Analysis failed.");
        setStep(3);
        return;
      }
      setReport(data.report);
      setStep(4);
    } catch {
      setError("Analysis failed. Check your connection and try again.");
      setStep(3);
    } finally {
      setLoading(false);
    }
  }

  function goAnalyze() {
    setStep(3);
    void runAnalysis();
  }

  async function handlePdf() {
    if (!report) return;
    setPdfLoading(true);
    try {
      const bytes = await buildInspectionPdf(report, photos);
      downloadPdf(bytes, `${report.id}-inspection.pdf`);
    } catch {
      setError("PDF export failed.");
    } finally {
      setPdfLoading(false);
    }
  }

  function patchReport(patch: Partial<InspectionReport>) {
    if (!report) return;
    setReport(applyReportEdits(report, patch));
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">New inspection</h1>
        <p className="mt-2 text-slate-600">
          Upload photos → choose type → AI findings → PDF report with timestamps.
        </p>

        <nav className="mt-8 flex gap-1 sm:gap-2" aria-label="Progress">
          {steps.map((s) => (
            <div
              key={s.n}
              className={`flex-1 rounded-lg border px-2 py-2 text-center text-[10px] font-medium sm:text-xs ${
                step === s.n
                  ? "border-indigo-600 bg-indigo-600 text-white"
                  : step > s.n
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-slate-200 bg-white text-slate-500"
              }`}
            >
              {s.n}. {s.label}
            </div>
          ))}
        </nav>

        {step === 1 ? (
          <div className="mt-6 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Step 1 — Upload photos</h2>
              <p className="mt-1 text-sm text-slate-600">
                Add {MIN_PHOTOS}–20 clear photos of the unit, equipment, roof, or vehicle.
              </p>
              <div className="mt-4">
                <PhotoUpload photos={photos} onChange={setPhotos} />
              </div>
              {error ? (
                <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              ) : null}
              <button
                type="button"
                disabled={photos.length < MIN_PHOTOS}
                onClick={() => {
                  setError("");
                  setStep(2);
                }}
                className="mt-5 w-full rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
              >
                Continue →
              </button>
            </div>
            <SafetyDisclaimer />
          </div>
        ) : null}

        {step === 2 ? (
          <div className="mt-6 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Step 2 — Inspection type</h2>
              <p className="mt-1 text-sm text-slate-600">{photos.length} photos ready for analysis.</p>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {inspectionNiches.map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => setInput((p) => ({ ...p, niche: n.id }))}
                    className={`rounded-xl border p-4 text-left transition ${
                      input.niche === n.id
                        ? "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <p className="font-medium text-slate-900">{n.label}</p>
                    <p className="mt-1 text-xs text-slate-600">{n.description}</p>
                  </button>
                ))}
              </div>

              <label className="mt-6 grid gap-1 text-sm">
                <span className="font-medium">Property / asset label *</span>
                <input
                  className="h-11 rounded-xl border border-slate-200 px-3"
                  placeholder="e.g. Unit 204, Building B — Dock 3 conveyor"
                  value={input.propertyLabel}
                  onChange={(e) => setInput((p) => ({ ...p, propertyLabel: e.target.value }))}
                />
              </label>
              <label className="mt-4 grid gap-1 text-sm">
                <span className="font-medium">Notes (optional)</span>
                <textarea
                  className="min-h-[80px] rounded-xl border border-slate-200 px-3 py-2"
                  placeholder="Move-out date, known issues, areas not photographed…"
                  value={input.unitNotes}
                  onChange={(e) => setInput((p) => ({ ...p, unitNotes: e.target.value }))}
                />
              </label>
              <label className="mt-4 grid gap-1 text-sm">
                <span className="font-medium">Inspector name (optional)</span>
                <input
                  className="h-11 rounded-xl border border-slate-200 px-3"
                  value={input.inspectorName}
                  onChange={(e) => setInput((p) => ({ ...p, inspectorName: e.target.value }))}
                />
              </label>

              <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  disabled={!input.propertyLabel.trim()}
                  onClick={goAnalyze}
                  className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                >
                  Run AI analysis →
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Step 3 — AI analysis</h2>
            {loading ? (
              <p className="mt-4 text-slate-600">Analyzing {photos.length} photos…</p>
            ) : error ? (
              <>
                <p className="mt-4 text-sm text-red-700">{error}</p>
                <button
                  type="button"
                  onClick={goAnalyze}
                  className="mt-4 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white"
                >
                  Retry
                </button>
              </>
            ) : null}
          </div>
        ) : null}

        {step === 4 && report ? (
          <div className="mt-6 space-y-6">
            <SafetyDisclaimer variant="export" />

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Step 4 — Inspection report</h2>
              <p className="mt-1 text-xs text-slate-500">
                {report.id} · {new Date(report.generatedAt).toLocaleString()}
              </p>

              <div className="mt-4 rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
                <p className="font-medium text-slate-900">Summary</p>
                <p className="mt-1">{report.summary}</p>
                <p className="mt-3 font-medium text-slate-900">Overall</p>
                <p className="mt-1">{report.overallAssessment}</p>
                {report.niche === "apartment_turnover" ? (
                  <p className="mt-3 text-sm">
                    Turnover ready:{" "}
                    <span className="font-semibold uppercase">{report.turnoverReady}</span>
                  </p>
                ) : null}
              </div>

              <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-slate-500">
                Issues ({report.issues.length})
              </h3>
              <ul className="mt-2 space-y-3">
                {report.issues.map((issue, i) => (
                  <li
                    key={issue.id}
                    className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm"
                  >
                    <p className="font-medium text-slate-900">
                      {i + 1}. [{issue.severity.toUpperCase()}] {issue.category} — {issue.location}
                    </p>
                    <p className="mt-1 text-slate-600">{issue.description}</p>
                    <p className="mt-1 text-slate-500">→ {issue.recommendedAction}</p>
                  </li>
                ))}
              </ul>

              <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-slate-500">
                Photos with notes
              </h3>
              <ul className="mt-2 grid gap-3 sm:grid-cols-2">
                {report.photoNotes.map((pn) => (
                  <li key={pn.photoIndex} className="rounded-lg border border-slate-200 p-2">
                    {photos[pn.photoIndex] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={photos[pn.photoIndex].dataUrl}
                        alt=""
                        className="aspect-video w-full rounded object-cover"
                      />
                    ) : null}
                    <p className="mt-2 text-xs font-medium text-slate-700">
                      Photo {pn.photoIndex + 1}: {pn.fileName}
                    </p>
                    <textarea
                      className="mt-1 w-full rounded border border-slate-200 px-2 py-1 text-xs"
                      value={pn.note}
                      onChange={(e) => {
                        const nextNotes = report.photoNotes.map((x) =>
                          x.photoIndex === pn.photoIndex
                            ? { ...x, note: e.target.value }
                            : x
                        );
                        setReport(applyReportEdits(report, { photoNotes: nextNotes }));
                      }}
                    />
                  </li>
                ))}
              </ul>

              <div className="mt-8 grid gap-3">
                <button
                  type="button"
                  disabled={pdfLoading}
                  onClick={() => void handlePdf()}
                  className="rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
                >
                  {pdfLoading ? "Building PDF…" : "Download PDF report"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const w = window.open("", "_blank");
                    if (!w || !report) return;
                    w.document.write(
                      `<pre style="font-family:system-ui;white-space:pre-wrap;padding:24px;">${report.printableSummary.replace(/</g, "&lt;")}</pre>`
                    );
                    w.document.close();
                    w.print();
                  }}
                  className="rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-800"
                >
                  Print report
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}
