import Link from "next/link";
import AppShell from "@/components/AppShell";
import { inspectionTemplates } from "@/lib/niches";

export default function Home() {
  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8 sm:py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
            AI inspector assistant
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Turn field photos into inspection reports
          </h1>
          <p className="mt-5 text-lg leading-7 text-slate-600">
            Upload photos from your phone. AI vision flags debris, water damage, rust, drywall
            damage, and more — then outputs a structured report with severity, recommendations, and
            photo references. Export a PDF your customers will actually use.
          </p>
          <Link
            href="/inspect"
            className="mt-8 inline-flex rounded-full bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white hover:bg-indigo-500"
          >
            Start inspection — free
          </Link>
        </div>

        <div className="mt-16">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500">
            Must-have workflow
          </h2>
          <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                t: "Photo upload",
                d: "Mobile camera, gallery, drag & drop — 5–20 photos",
              },
              { t: "AI vision", d: "Detects issues with severity and photo reference" },
              {
                t: "Structured report",
                d: "Issue · Severity · Recommendation · Photo #",
              },
              { t: "PDF export", d: "Timestamped report with findings and images" },
            ].map((s, i) => (
              <li
                key={s.t}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <span className="text-xs font-bold text-indigo-600">Step {i + 1}</span>
                <p className="mt-2 font-semibold text-slate-900">{s.t}</p>
                <p className="mt-1 text-sm text-slate-600">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-16">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500">
            Inspection templates
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {inspectionTemplates.map((t) => (
              <li
                key={t.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <p className="font-semibold text-slate-900">{t.label}</p>
                <p className="mt-1 text-sm text-slate-600">{t.description}</p>
                <p className="mt-3 text-xs text-slate-500">
                  e.g. {t.visionTargets.slice(0, 3).join(" · ")}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AppShell>
  );
}
