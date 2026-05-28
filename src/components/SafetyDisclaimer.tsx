import { DRAFT_REVIEW_NOTE, INSPECTION_DISCLAIMER_SHORT } from "@/lib/disclaimer";

type Props = { variant?: "banner" | "compact" | "export" };

export default function SafetyDisclaimer({ variant = "banner" }: Props) {
  if (variant === "compact") {
    return <p className="text-xs leading-5 text-slate-500">{INSPECTION_DISCLAIMER_SHORT}</p>;
  }
  if (variant === "export") {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        <p className="font-semibold">Before you export</p>
        <p className="mt-1 leading-6">{INSPECTION_DISCLAIMER_SHORT}</p>
        <p className="mt-2 text-xs text-amber-800">{DRAFT_REVIEW_NOTE}</p>
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-700">
      <p className="font-medium text-slate-900">Important</p>
      <p className="mt-1 leading-6">{INSPECTION_DISCLAIMER_SHORT}</p>
      <p className="mt-2 text-xs text-slate-500">{DRAFT_REVIEW_NOTE}</p>
    </div>
  );
}
