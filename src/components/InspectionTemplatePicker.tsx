"use client";

import { getTemplate, inspectionTemplates } from "@/lib/niches";
import type { InspectionNiche } from "@/lib/types";

type Props = {
  value: InspectionNiche;
  onChange: (niche: InspectionNiche) => void;
};

export default function InspectionTemplatePicker({ value, onChange }: Props) {
  const selected = getTemplate(value);

  return (
    <div className="space-y-4">
      <div className="grid gap-2 sm:grid-cols-2">
        {inspectionTemplates.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className={`rounded-xl border p-4 text-left transition ${
              value === t.id
                ? "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600"
                : "border-slate-200 hover:bg-slate-50"
            }`}
          >
            <p className="font-medium text-slate-900">{t.label}</p>
            <p className="mt-1 text-xs text-slate-600">{t.description}</p>
          </button>
        ))}
      </div>

      {selected ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            AI vision checks for
          </p>
          <ul className="mt-2 grid gap-1 sm:grid-cols-2">
            {selected.visionTargets.map((target) => (
              <li key={target} className="flex gap-2 text-sm text-slate-700">
                <span className="text-indigo-500">•</span>
                {target}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
