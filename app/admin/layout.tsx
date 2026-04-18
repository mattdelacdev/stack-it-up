import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import { getCurrentProfile } from "@/lib/supabase/server";

export const metadata = { title: "Admin — StackItUp" };

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { user, profile } = await getCurrentProfile();
  if (!user) redirect("/login?next=/admin");
  if (profile?.role !== "admin") notFound();

  const authUser = {
    email: user.email ?? "",
    firstName: profile?.first_name ?? null,
    isAdmin: true,
    username: profile?.username ?? null,
  };

  return (
    <div className="min-h-screen bg-bg text-text">
      <SiteHeader authUser={authUser} />
      <div className="border-b-4 border-primary/40 bg-bg-deep/60">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-3">
          <Link href="/admin" className="font-display text-sm text-text">
            <span className="text-gradient">ADMIN</span>
          </Link>
          <nav className="flex gap-4 font-display text-xs tracking-[0.3em]">
            <Link href="/admin/subscribers" className="hover:text-accent">
              SUBSCRIBERS
            </Link>
            <Link href="/admin/supplements" className="hover:text-accent">
              SUPPLEMENTS
            </Link>
            <Link href="/admin/profiles" className="hover:text-accent">
              PROFILES
            </Link>
          </nav>
        </div>
      </div>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
