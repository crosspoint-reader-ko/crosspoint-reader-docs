import { getReleases, type Release } from "@/lib/github";
import { CROSSPOINT_VERSION } from "@/constants/version";
import Link from "next/link";
import hljs from "highlight.js";
import { Marked } from "marked";

export const metadata = {
  title: "릴리즈 노트",
  description: "CrossPoint Reader 한국어 펌웨어 릴리즈 노트 및 변경사항",
};

const ITEMS_PER_PAGE = 3;

// 빌드 타임에 모든 페이지 생성
export async function generateStaticParams() {
  const releases = await getReleases();
  const totalPages = Math.max(1, Math.ceil(releases.length / ITEMS_PER_PAGE));

  return Array.from({ length: totalPages }, (_, i) => ({
    page: String(i + 1),
  }));
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  return `${year}년 ${month}월 ${day}일`;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

const markdown = new Marked({
  gfm: true,
  breaks: false,
  renderer: {
    code({ text, lang }) {
      const language = lang || "plaintext";
      let highlighted: string;
      try {
        if (language !== "plaintext" && hljs.getLanguage(language)) {
          highlighted = hljs.highlight(text, { language }).value;
        } else {
          highlighted = hljs.highlightAuto(text).value;
        }
      } catch {
        highlighted = text
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
      }
      return `<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm my-4"><code class="hljs language-${language}">${highlighted}</code></pre>`;
    },
    codespan({ text }) {
      return `<code class="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-pink-600">${text}</code>`;
    },
    link({ href, text }) {
      return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline break-all">${text}</a>`;
    },
    heading({ tokens, depth }) {
      const text = this.parser.parseInline(tokens);
      const classes: Record<number, string> = {
        1: "text-2xl font-bold mt-8 mb-4",
        2: "text-xl font-bold mt-6 mb-3",
        3: "text-lg font-semibold mt-4 mb-2",
        4: "text-base font-semibold mt-4 mb-2 text-gray-800",
        5: "text-sm font-semibold mt-3 mb-2 text-gray-800",
        6: "text-sm font-semibold mt-3 mb-2 text-gray-700",
      };
      return `<h${depth} class="${classes[depth] || classes[4]}">${text}</h${depth}>\n`;
    },
    list({ items, ordered }) {
      const tag = ordered ? "ol" : "ul";
      const cls = ordered
        ? "my-2 space-y-1 list-decimal list-inside"
        : "my-2 space-y-1 list-disc list-inside";
      const body = items.map((item) => this.listitem(item)).join("");
      return `<${tag} class="${cls}">${body}</${tag}>`;
    },
    listitem({ tokens }) {
      return `<li>${this.parser.parse(tokens)}</li>`;
    },
    paragraph({ tokens }) {
      return `<div class="my-2">${this.parser.parseInline(tokens)}</div>`;
    },
    table({ header, rows }) {
      const thead =
        "<thead class=\"bg-gray-50\"><tr>" +
        header
          .map(
            (cell) =>
              `<th class="px-3 py-2 text-left text-sm font-semibold text-gray-900 border border-gray-200">${this.parser.parseInline(cell.tokens)}</th>`,
          )
          .join("") +
        "</tr></thead>";
      const tbody =
        "<tbody>" +
        rows
          .map(
            (row) =>
              "<tr>" +
              row
                .map(
                  (cell) =>
                    `<td class="px-3 py-2 text-sm text-gray-700 border border-gray-200">${this.parser.parseInline(cell.tokens)}</td>`,
                )
                .join("") +
              "</tr>",
          )
          .join("") +
        "</tbody>";
      return `<div class="my-4 overflow-x-auto"><table class="min-w-full border border-gray-200 rounded-lg">${thead}${tbody}</table></div>`;
    },
    blockquote({ tokens }) {
      const inner = this.parser.parse(tokens);
      return `<blockquote class="my-2 pl-4 border-l-4 border-gray-300 text-gray-600 italic">${inner}</blockquote>`;
    },
  },
});

const ALERT_STYLES: Record<
  string,
  { wrapper: string; heading: string; body: string; icon: string }
> = {
  TIP: {
    wrapper:
      "my-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg",
    heading: "flex items-center gap-2 text-green-700 font-semibold mb-1",
    body: "text-green-800",
    icon: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>',
  },
  NOTE: {
    wrapper: "my-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg",
    heading: "flex items-center gap-2 text-blue-700 font-semibold mb-1",
    body: "text-blue-800",
    icon: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>',
  },
  WARNING: {
    wrapper:
      "my-4 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg",
    heading: "flex items-center gap-2 text-yellow-700 font-semibold mb-1",
    body: "text-yellow-800",
    icon: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>',
  },
  IMPORTANT: {
    wrapper:
      "my-4 p-4 bg-purple-50 border-l-4 border-purple-500 rounded-r-lg",
    heading: "flex items-center gap-2 text-purple-700 font-semibold mb-1",
    body: "text-purple-800",
    icon: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>',
  },
};

function transformAlerts(html: string): string {
  return html.replace(
    /<blockquote class="[^"]*"><div class="my-2">\[!(TIP|NOTE|WARNING|IMPORTANT)\]<\/div>([\s\S]*?)<\/blockquote>/g,
    (_, kind: string, body: string) => {
      const style = ALERT_STYLES[kind];
      if (!style) return _;
      return `<div class="${style.wrapper}"><div class="${style.heading}">${style.icon}${kind}</div><div class="${style.body}">${body.trim()}</div></div>`;
    },
  );
}

function parseMarkdown(text: string): string {
  if (!text) return "";
  const normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const html = markdown.parse(normalized) as string;
  return transformAlerts(html);
}

function ReleaseCard({
  release,
  isLatest,
}: {
  release: Release;
  isLatest: boolean;
}) {
  return (
    <article
      className={`rounded-2xl border bg-white p-6 shadow-sm ${
        isLatest ? "border-blue-200 ring-2 ring-blue-100" : "border-gray-200"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900">
              {release.name || release.tag_name}
            </h2>
            {isLatest && (
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                최신
              </span>
            )}
            {release.prerelease && (
              <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                Pre-release
              </span>
            )}
          </div>
          <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 6h.008v.008H6V6z"
                />
              </svg>
              {release.tag_name}
            </span>
            <span className="flex items-center gap-1">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                />
              </svg>
              {formatDate(release.published_at)}
            </span>
          </div>
        </div>
        <a
          href={release.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              clipRule="evenodd"
            />
          </svg>
          GitHub
        </a>
      </div>

      {release.body && (
        <div
          className="mt-6 prose prose-sm max-w-none text-gray-600 [&_pre]:bg-gray-900 [&_pre]:text-gray-100 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:text-sm [&_pre_code]:bg-transparent [&_pre_code]:p-0"
          dangerouslySetInnerHTML={{
            __html: parseMarkdown(release.body),
          }}
        />
      )}

      {release.assets.length > 0 && (
        <div className="mt-6 border-t border-gray-100 pt-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">다운로드</h3>
          <div className="space-y-2">
            {release.assets.map((asset) => (
              <a
                key={asset.name}
                href={asset.browser_download_url}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-gray-900">
                    {asset.name}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>{formatBytes(asset.size)}</span>
                  <span className="flex items-center gap-1">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                    {asset.download_count}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const renderPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      {currentPage > 1 ? (
        <Link
          href={`/releases/${currentPage - 1}`}
          className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          이전
        </Link>
      ) : (
        <span className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-400 cursor-not-allowed">
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          이전
        </span>
      )}

      <div className="flex items-center gap-1">
        {renderPageNumbers().map((page, idx) =>
          typeof page === "number" ? (
            <Link
              key={idx}
              href={`/releases/${page}`}
              className={`min-w-[40px] rounded-lg px-3 py-2 text-sm font-medium text-center transition-colors ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {page}
            </Link>
          ) : (
            <span key={idx} className="px-2 text-gray-400">
              {page}
            </span>
          )
        )}
      </div>

      {currentPage < totalPages ? (
        <Link
          href={`/releases/${currentPage + 1}`}
          className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
        >
          다음
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </Link>
      ) : (
        <span className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-400 cursor-not-allowed">
          다음
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </span>
      )}
    </div>
  );
}

export default async function ReleasesPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const currentPage = parseInt(page, 10);
  const releases = await getReleases();

  const totalPages = Math.ceil(releases.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentReleases = releases.slice(startIndex, endIndex);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
              홈으로 돌아가기
            </Link>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              릴리즈 노트
            </h1>
            <p className="mt-4 text-lg text-gray-300">
              CrossPoint Reader 한국어 펌웨어 버전별 변경사항
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
              <span className="text-sm text-gray-300">현재 버전</span>
              <span className="rounded-full bg-blue-500 px-3 py-1 text-sm font-semibold">
                v{CROSSPOINT_VERSION}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Releases List */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {releases.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                릴리즈 정보를 불러올 수 없습니다.
              </p>
              <a
                href="https://github.com/crosspoint-reader-ko/crosspoint-reader-ko/releases"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center text-blue-600 hover:underline"
              >
                GitHub에서 릴리즈 보기
                <svg
                  className="ml-1 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
              </a>
            </div>
          ) : (
            <>
              <div className="space-y-8">
                {currentReleases.map((release, index) => (
                  <ReleaseCard
                    key={release.id}
                    release={release}
                    isLatest={currentPage === 1 && index === 0}
                  />
                ))}
              </div>

              <Pagination currentPage={currentPage} totalPages={totalPages} />

              {totalPages > 1 && (
                <div className="mt-4 text-center text-sm text-gray-500">
                  {releases.length}개의 릴리즈 중 {startIndex + 1}-
                  {Math.min(endIndex, releases.length)}
                </div>
              )}
            </>
          )}

          {/* Back to Home */}
          <div className="mt-12 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
