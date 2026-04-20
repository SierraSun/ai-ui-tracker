import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-bg flex items-center justify-center">
      <div className="text-center">
        <p className="text-[10px] font-mono text-dim uppercase tracking-widest mb-4">404</p>
        <h1 className="text-2xl font-mono text-text mb-6">Tool not found</h1>
        <Link
          href="/"
          className="text-[10px] font-mono text-dim hover:text-text transition-colors uppercase tracking-widest"
        >
          ← Back to archive
        </Link>
      </div>
    </main>
  );
}
