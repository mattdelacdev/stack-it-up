import type { Metadata, Viewport } from "next";
import { Bungee, VT323, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";

const display = Bungee({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-display",
  display: "swap",
});

const mono = VT323({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono",
  display: "swap",
});

const body = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "StackItUp — Build Your Personalized Supplement Stack",
    template: "%s — StackItUp",
  },
  description:
    "Take a 60-second quiz and get a personalized, science-backed supplement routine tailored to your goals, diet, and lifestyle.",
  keywords: [
    "supplement stack",
    "personalized supplements",
    "supplement quiz",
    "vitamins",
    "nootropics",
    "sleep supplements",
    "energy supplements",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "StackItUp — Build Your Personalized Supplement Stack",
    description:
      "Take a 60-second quiz and get a personalized, science-backed supplement routine tailored to your goals.",
    type: "website",
    siteName: SITE_NAME,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "StackItUp — Build Your Personalized Supplement Stack",
    description:
      "Take a 60-second quiz and get a personalized, science-backed supplement routine.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#1E1B4B" },
    { media: "(prefers-color-scheme: light)", color: "#FBBF24" },
  ],
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: absoluteUrl("/opengraph-image"),
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/supplements?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${mono.variable} ${body.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark'){document.documentElement.dataset.theme=t;}else{document.documentElement.dataset.theme='dark';}}catch(e){document.documentElement.dataset.theme='dark';}})();`,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-accent focus:text-bg focus:px-4 focus:py-2 focus:font-display"
        >
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
