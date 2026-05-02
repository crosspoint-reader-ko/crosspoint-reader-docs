"use client";

interface TocSection {
  id: string;
  title: string;
}

/**
 * 페이지 내 섹션 점프용 TOC. 상단 라우팅 nav(pill)와 시각적으로 명확히 구분되도록
 * 텍스트 링크 + `#` 프리픽스 패턴으로 렌더링.
 */
export function InPageToc({
  sections,
  label,
  className = "",
}: {
  sections: TocSection[];
  label?: string;
  className?: string;
}) {
  if (sections.length === 0) return null;

  return (
    <nav
      aria-label={label}
      className={`mt-8 flex flex-wrap items-center justify-center gap-x-1 gap-y-1.5 ${className}`}
    >
      {label && (
        <span className="text-xs uppercase tracking-wider text-gray-400 mr-2">
          {label}
        </span>
      )}
      {sections.map((section, idx) => (
        <span key={section.id} className="inline-flex items-center">
          {idx > 0 && (
            <span aria-hidden className="mx-2 text-gray-300 select-none">
              ·
            </span>
          )}
          <button
            onClick={() => {
              const el = document.getElementById(section.id);
              if (el) {
                el.scrollIntoView({ behavior: "smooth" });
                window.history.pushState(null, "", `#${section.id}`);
              }
            }}
            className="group inline-flex items-center gap-1 text-sm text-blue-600/90 hover:text-blue-700 transition-colors"
          >
            <span
              aria-hidden
              className="font-mono text-blue-400 group-hover:text-blue-600 transition-colors"
            >
              #
            </span>
            <span className="underline-offset-4 decoration-blue-300/60 group-hover:underline">
              {section.title}
            </span>
          </button>
        </span>
      ))}
    </nav>
  );
}
