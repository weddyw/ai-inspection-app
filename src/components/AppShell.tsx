import Link from "next/link";
import SafetyDisclaimer from "@/components/SafetyDisclaimer";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
              AI
            </span>
            <span className="text-lg font-semibold tracking-tight">Inspection Assistant</span>
          </Link>
          <Link
            href="/inspect"
            className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            New inspection
          </Link>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SafetyDisclaimer variant="compact" />
        </div>
      </footer>
    </div>
  );
}
