import { Suspense } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import NewsletterForm from "@/components/NewsletterForm";
import { getCurrentProfile } from "@/lib/supabase/server";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Suspense fallback={<SiteHeader authUser={null} />}>
        <SiteHeaderWithAuth />
      </Suspense>
      {children}
      <NewsletterForm />
      <SiteFooter />
    </>
  );
}

async function SiteHeaderWithAuth() {
  const { user, profile } = await getCurrentProfile();
  const authUser = user
    ? {
        email: user.email ?? "",
        firstName: profile?.first_name ?? null,
        isAdmin: profile?.role === "admin",
        username: profile?.username ?? null,
      }
    : null;
  return <SiteHeader authUser={authUser} />;
}
