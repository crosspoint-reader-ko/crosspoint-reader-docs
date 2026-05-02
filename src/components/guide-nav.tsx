"use client";

import { Link } from "@/i18n/navigation";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

const SECTIONS = [
  { href: "/guide", labelKey: "basics" },
  { href: "/guide/settings", labelKey: "settings" },
  { href: "/guide/files", labelKey: "files" },
  { href: "/guide/customize", labelKey: "customize" },
  { href: "/guide/roadmap", labelKey: "roadmap" },
  { href: "/guide/troubleshooting", labelKey: "troubleshooting" },
] as const;

export function GuideNav() {
  const pathname = usePathname();
  const t = useTranslations("guide.nav");
  return (
    <nav
      aria-label={t("ariaLabel")}
      className="sticky top-16 z-30 bg-white/80 backdrop-blur border-b border-gray-200"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-3 flex gap-2 overflow-x-auto">
        {SECTIONS.map((s) => {
          const active =
            s.href === "/guide"
              ? pathname === "/guide" || pathname === "/guide/"
              : pathname?.startsWith(s.href);
          return (
            <Link
              key={s.href}
              href={s.href}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-blue-50 hover:text-blue-600 border border-gray-200"
              }`}
            >
              {t(s.labelKey)}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
