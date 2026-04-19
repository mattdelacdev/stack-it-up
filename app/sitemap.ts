import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { fetchSupplementList } from "@/lib/supplements";
import { fetchFeaturedStacks } from "@/lib/featured-stacks";
import { benefitList } from "@/lib/benefits";
import { bestGoalList } from "@/lib/best";
import { comparePairs } from "@/lib/compare";
import { getServerSupabase } from "@/lib/supabase/server";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/quiz`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/supplements`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/stacks`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/best`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/compare`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/download`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/refund`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const benefitRoutes: MetadataRoute.Sitemap = benefitList.map((b) => ({
    url: `${SITE_URL}/optimize/${b.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const bestRoutes: MetadataRoute.Sitemap = bestGoalList.map((g) => ({
    url: `${SITE_URL}/best/${g.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const compareRoutes: MetadataRoute.Sitemap = comparePairs.map((p) => ({
    url: `${SITE_URL}/compare/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  let supplementRoutes: MetadataRoute.Sitemap = [];
  try {
    const supplements = await fetchSupplementList();
    supplementRoutes = supplements.map((s) => ({
      url: `${SITE_URL}/supplements/${s.id}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    }));
  } catch {
    // Env missing or DB unreachable at build — skip dynamic entries rather than fail the sitemap.
  }

  let profileRoutes: MetadataRoute.Sitemap = [];
  try {
    const supabase = await getServerSupabase();
    const { data } = await supabase
      .from("profiles")
      .select("username, updated_at")
      .eq("is_public", true)
      .not("username", "is", null);
    profileRoutes = (data ?? []).map((p: { username: string; updated_at: string | null }) => ({
      url: `${SITE_URL}/u/${p.username}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : now,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    }));
  } catch {
    // ignore
  }

  let stackRoutes: MetadataRoute.Sitemap = [];
  try {
    const stacks = await fetchFeaturedStacks();
    stackRoutes = stacks.map((s) => ({
      url: `${SITE_URL}/stacks/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    }));
  } catch {
    // ignore
  }

  return [
    ...staticRoutes,
    ...benefitRoutes,
    ...bestRoutes,
    ...compareRoutes,
    ...supplementRoutes,
    ...stackRoutes,
    ...profileRoutes,
  ];
}
