import Link from "next/link";

export const metadata = { title: "Admin — StackItUp" };

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-bg text-text">
      <header className="border-b-4 border-primary/40 bg-bg-deep/60">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-4">
          <Link href="/admin" className="font-display text-xl text-text">
            <span className="text-gradient">ADMIN</span>
          </Link>
          <nav className="flex gap-4 font-display text-xs tracking-[0.3em]">
            <Link href="/admin/subscribers" className="hover:text-accent">
              SUBSCRIBERS
            </Link>
            <Link href="/admin/supplements" className="hover:text-accent">
              SUPPLEMENTS
            </Link>
          </nav>
          <Link
            href="/"
            className="ml-auto font-display text-xs tracking-[0.3em] text-text/60 hover:text-accent"
          >
            ← SITE
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
