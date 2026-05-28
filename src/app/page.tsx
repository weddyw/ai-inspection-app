import Link from "next/link";
import AppShell from "@/components/AppShell";

export default function Home() {
  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8 sm:py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
            AI inspector assistant
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Turn photos into inspection reports in minutes
          </h1>
          <p className="mt-5 text-lg leading-7 text-slate-600">
            Upload 5–20 photos. Pick the inspection type. Get detected issues, severity ratings,
            and recommended actions — then download a timestamped PDF. Built to help document
            inspections, not replace qualified inspectors.
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
            How it works
          </h2>
          <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { n: "1", t: "Upload photos", d: "5–20 images from phone or camera" },
              { n: "2", t: "Select type", d: "Apartment, equipment, roof, or vehicle" },
              { n: "3", t: "AI analysis", d: "Issues, severity, and recommendations" },
              { n: "4", t: "PDF report", d: "Issue list, photo notes, timestamps" },
            ].map((s) => (
              <li
                key={s.n}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <span className="text-xs font-bold text-indigo-600">Step {s.n}</span>
                <p className="mt-2 font-semibold text-slate-900">{s.t}</p>
                <p className="mt-1 text-sm text-slate-600">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-16">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500">
            Inspection types (V1)
          </h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              "Apartment turnover",
              "Equipment inspection",
              "Roof inspection",
              "Vehicle inspection",
            ].map((label) => (
              <li
                key={label}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800"
              >
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AppShell>
  );
}
