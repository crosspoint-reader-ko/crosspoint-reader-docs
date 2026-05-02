import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import KoreanFontContent from "@/components/KoreanFontContent";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "koreanFont" });

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
    openGraph: {
      title: t("metadata.ogTitle"),
      description: t("metadata.ogDescription"),
    },
  };
}

export default async function KoreanFontPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="grow">
        <Suspense fallback={<div className="min-h-screen" />}>
          <KoreanFontContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
