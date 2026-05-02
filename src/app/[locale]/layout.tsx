import "../globals.css";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { basePath } from "@/lib/basePath";
import { routing, type Locale } from "@/i18n/routing";

const siteUrl = "https://eunchurn.github.io/crosspoint-reader-docs";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });

  const siteName = t("name");
  const siteDescription = t("description");
  const ogLocale = locale === "ko" ? "ko_KR" : "en_US";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: t("title.default"),
      template: t("title.template"),
    },
    description: siteDescription,
    keywords: t("keywords").split(","),
    authors: [
      { name: "eunchurn", url: "https://github.com/eunchurn" },
      { name: "Dave Allie", url: "https://github.com/daveallie" },
    ],
    creator: "eunchurn",
    publisher: "CrossPoint Reader Contributors",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: siteName,
      description: siteDescription,
      url: locale === "ko" ? siteUrl : `${siteUrl}/${locale}`,
      siteName,
      locale: ogLocale,
      type: "website",
      images: [locale === "ko" ? "/opengraph-image" : `/${locale}/opengraph-image`],
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description: siteDescription,
      images: [locale === "ko" ? "/opengraph-image" : `/${locale}/opengraph-image`],
      creator: "@eunchurn",
    },
    icons: {
      icon: [
        { url: `${basePath}/logo.svg`, type: "image/svg+xml" },
        { url: `${basePath}/web-app-manifest-192x192.png`, sizes: "192x192", type: "image/png" },
        { url: `${basePath}/web-app-manifest-512x512.png`, sizes: "512x512", type: "image/png" },
      ],
      apple: [
        { url: `${basePath}/web-app-manifest-192x192.png`, sizes: "192x192", type: "image/png" },
      ],
    },
    manifest: `${basePath}/manifest.json`,
    alternates: {
      canonical: locale === "ko" ? siteUrl : `${siteUrl}/${locale}`,
      languages: {
        ko: siteUrl,
        en: `${siteUrl}/en`,
      },
    },
    category: "technology",
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale as Locale);

  return (
    <html lang={locale}>
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body className="bg-gray-50 text-gray-900 antialiased">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
