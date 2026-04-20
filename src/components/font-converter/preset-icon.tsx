import type { JSX } from "react";

interface PresetIconProps {
  id: string;
  className?: string;
}

const SVG_PROPS = {
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  strokeWidth: 2,
} as const;

export function PresetIcon({
  id,
  className = "w-4 h-4",
}: PresetIconProps): JSX.Element {
  switch (id) {
    case "all":
      return (
        <svg className={className} {...SVG_PROPS}>
          <circle cx="12" cy="12" r="9" />
          <path
            strokeLinecap="round"
            d="M3 12h18M12 3a12 12 0 0 1 0 18M12 3a12 12 0 0 0 0 18"
          />
        </svg>
      );
    case "korean":
      return <span className="text-sm font-bold leading-none">가</span>;
    case "hanja":
      return <span className="text-sm font-bold leading-none">漢</span>;
    case "hanjaExtended":
      return (
        <span className="text-xs font-bold leading-none whitespace-nowrap">
          漢+
        </span>
      );
    case "japanese":
      return <span className="text-sm font-bold leading-none">あ</span>;
    case "chinese":
      return <span className="text-sm font-bold leading-none">中</span>;
    case "fullwidth":
      return <span className="text-sm font-bold leading-none">Ａ</span>;
    case "publishing":
      return (
        <svg className={className} {...SVG_PROPS}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      );
    case "math":
      return <span className="text-sm font-bold leading-none">∑</span>;
    case "symbols":
      return <span className="text-sm font-bold leading-none">★</span>;
    case "european":
      return (
        <span className="text-xs font-bold leading-none whitespace-nowrap">
          Aé
        </span>
      );
    case "multilingual":
      return (
        <svg className={className} {...SVG_PROPS}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    case "phonetics":
      return (
        <svg className={className} {...SVG_PROPS}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
      );
    case "emoji":
      return (
        <svg className={className} {...SVG_PROPS}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    default:
      return <span className={className} />;
  }
}
