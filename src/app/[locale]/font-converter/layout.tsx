import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("fontConverter");
  return {
    title: `${t("page.metaTitle")} | CrossPoint Reader`,
    description: t("page.metaDescription"),
  };
}

export default function FontConverterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
