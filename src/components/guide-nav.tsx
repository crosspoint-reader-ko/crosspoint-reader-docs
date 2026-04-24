"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const SECTIONS = [
  { href: "/guide", label: "기본" },
  { href: "/guide/settings", label: "설정" },
  { href: "/guide/files", label: "파일·Calibre" },
  { href: "/guide/customize", label: "커스터마이즈" },
  { href: "/guide/roadmap", label: "제한사항·로드맵" },
  { href: "/guide/troubleshooting", label: "문제 해결" },
] as const;

export function GuideNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="사용자 가이드"
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
              {s.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
