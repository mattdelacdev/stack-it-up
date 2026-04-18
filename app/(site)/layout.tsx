import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import NewsletterForm from "@/components/NewsletterForm";
import { getCurrentProfile } from "@/lib/supabase/server";

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { user, profile } = await getCurrentProfile();
  const authUser = user
    ? {
        email: user.email ?? "",
        firstName: profile?.first_name ?? null,
        isAdmin: profile?.role === "admin",
        username: profile?.username ?? null,
      }
    : null;
  return (
    <>
      <SiteHeader authUser={authUser} />
      {children}
      <NewsletterForm />
      <SiteFooter />
    </>
  );
}
