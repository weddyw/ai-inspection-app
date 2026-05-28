"use client";

import type { InspectionIssue } from "@/lib/types";

const severityClass: Record<InspectionIssue["severity"], string> = {
  low: "bg-slate-100 text-slate-700",
  medium: "bg-amber-100 text-amber-900",
  high: "bg-orange-100 text-orange-900",
  critical: "bg-red-100 text-red-900",
};

type Props = {
  issues: InspectionIssue[];
  onChange?: (issues: InspectionIssue[]) => void;
};

export default function StructuredIssuesTable({ issues, onChange }: Props) {
  function updateIssue(id: string, patch: Partial<InspectionIssue>) {
    if (!onChange) return;
    onChange(issues.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }

  return (
    <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-3 py-3 sm:px-4">#</th>
            <th className="px-3 py-3 sm:px-4">Issue</th>
            <th className="px-3 py-3 sm:px-4">Severity</th>
            <th className="px-3 py-3 sm:px-4">Recommendation</th>
            <th className="px-3 py-3 sm:px-4">Photo</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {issues.map((row, index) => (
            <tr key={row.id} className="bg-white align-top">
              <td className="px-3 py-3 text-slate-400 sm:px-4">{index + 1}</td>
              <td className="px-3 py-3 sm:px-4">
                {onChange ? (
                  <textarea
                    className="w-full min-w-[140px] rounded border border-slate-200 px-2 py-1 text-sm"
                    rows={2}
                    value={row.issue}
                    onChange={(e) => updateIssue(row.id, { issue: e.target.value })}
                  />
                ) : (
                  <span className="font-medium text-slate-900">{row.issue}</span>
                )}
                {row.location ? (
                  <p className="mt-1 text-xs text-slate-500">{row.location}</p>
                ) : null}
              </td>
              <td className="px-3 py-3 sm:px-4">
                {onChange ? (
                  <select
                    className="rounded border border-slate-200 px-2 py-1 text-xs"
                    value={row.severity}
                    onChange={(e) =>
                      updateIssue(row.id, {
                        severity: e.target.value as InspectionIssue["severity"],
                      })
                    }
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                ) : (
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold uppercase ${severityClass[row.severity]}`}
                  >
                    {row.severity}
                  </span>
                )}
              </td>
              <td className="px-3 py-3 sm:px-4">
                {onChange ? (
                  <textarea
                    className="w-full min-w-[160px] rounded border border-slate-200 px-2 py-1 text-sm"
                    rows={2}
                    value={row.recommendation}
                    onChange={(e) =>
                      updateIssue(row.id, { recommendation: e.target.value })
                    }
                  />
                ) : (
                  <span className="text-slate-700">{row.recommendation}</span>
                )}
              </td>
              <td className="px-3 py-3 font-medium text-indigo-700 sm:px-4">
                Photo {row.photoRef}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {issues.length === 0 ? (
        <p className="p-4 text-center text-sm text-slate-500">No issues detected.</p>
      ) : null}
    </div>
  );
}
