"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { GuideNav } from "@/components/guide-nav";
import { InPageToc } from "@/components/in-page-toc";
import { useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

// Section Link Component
function SectionLink({
  id,
  children,
  className = "",
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={`#${id}`}
      className={`group flex items-center gap-2 hover:text-blue-600 transition-colors ${className}`}
      onClick={(e) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          window.history.pushState(null, "", `#${id}`);
        }
      }}
    >
      {children}
      <svg
        className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
        />
      </svg>
    </a>
  );
}

const strong = (chunks: React.ReactNode) => <strong>{chunks}</strong>;
const em = (chunks: React.ReactNode) => <em>{chunks}</em>;
const code = (chunks: React.ReactNode) => (
  <code className="bg-gray-100 px-1 rounded">{chunks}</code>
);
const codeWhite = (chunks: React.ReactNode) => (
  <code className="bg-white/60 px-1 rounded">{chunks}</code>
);
const codeBlue = (chunks: React.ReactNode) => (
  <code className="bg-blue-100 px-1 rounded">{chunks}</code>
);

export default function GuideSettingsPage() {
  const t = useTranslations("guide.settings");

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", `#${id}`);
    }
  };

  const tocSections: { id: string; title: string }[] = [
    { id: "settings", title: t("toc.settings") },
    { id: "epub-reader-menu", title: t("toc.epubReader") },
    { id: "txt-reader-menu", title: t("toc.txtReader") },
  ];

  const displayItems = t.raw("system.display.items") as string[];
  const readerItems = t.raw("system.reader.items") as string[];
  const controlsItems = t.raw("system.controls.items") as string[];
  const epubItems = t.raw("epubReader.items") as string[];
  const txtItems = t.raw("txtReader.items") as string[];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <GuideNav />

      <main className="flex-grow">
        {/* Hero */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900">
              {t("hero.title")}
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              {t("hero.description")}
            </p>
            <InPageToc sections={tocSections} />
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg prose-blue max-w-none prose-a:no-underline">
              <div
                id="screens"
                className="rounded-2xl border border-gray-200 bg-white p-8 mb-8 scroll-mt-36"
              >
                <div className="space-y-6">
                  <div id="settings" className="scroll-mt-36">
                    <SectionLink
                      id="settings"
                      className="text-xl font-semibold text-gray-800 mb-2"
                    >
                      {t("system.title")}
                    </SectionLink>
                    <p className="text-gray-500 text-sm mb-3">
                      {t.rich("system.subtitle", { strong })}
                    </p>
                    <p className="text-gray-600 mb-4">{t("system.intro")}</p>

                    <p className="text-gray-600 mb-4">
                      {t.rich("system.v120Note", { strong })}
                    </p>

                    <h4 className="text-lg font-medium text-gray-700 mt-4 mb-2">
                      {t("system.display.title")}
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                      {displayItems.map((_item, i) => (
                        <li key={i}>
                          {t.rich(`system.display.items.${i}`, {
                            strong,
                            em,
                          })}
                        </li>
                      ))}
                    </ul>

                    <h4 className="text-lg font-medium text-gray-700 mt-4 mb-2">
                      {t("system.reader.title")}
                    </h4>
                    <p className="text-gray-500 text-xs mb-2">
                      {t("system.reader.uiLabels")}
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                      <li>
                        {t.rich("system.reader.fontSetting", {
                          strong,
                          link: (chunks) => (
                            <Link
                              href="/guide/customize#custom-font"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              {chunks}
                            </Link>
                          ),
                        })}
                      </li>
                      {readerItems.map((_item, i) => (
                        <li key={i}>
                          {t.rich(`system.reader.items.${i}`, { strong, em })}
                        </li>
                      ))}
                    </ul>

                    <h4 className="text-lg font-medium text-gray-700 mt-4 mb-2">
                      {t("system.controls.title")}
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                      {controlsItems.map((_item, i) => (
                        <li key={i}>
                          {t.rich(`system.controls.items.${i}`, {
                            strong,
                            em,
                          })}
                        </li>
                      ))}
                    </ul>

                    <h4 className="text-lg font-medium text-gray-700 mt-4 mb-2">
                      {t("system.systemTab.title")}
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>
                        {t.rich("system.systemTab.sleepTimeout", { strong })}
                      </li>
                      <li>
                        {t.rich("system.systemTab.hiddenFiles", {
                          strong,
                          code,
                        })}
                      </li>
                      <li>{t.rich("system.systemTab.wifi", { strong })}</li>
                      <li>
                        {t.rich("system.systemTab.koreaderSync", {
                          strong,
                          link: (chunks) => (
                            <Link
                              href="/guide/customize#koreader-sync"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              {chunks}
                            </Link>
                          ),
                        })}
                      </li>
                      <li>{t.rich("system.systemTab.opds", { strong })}</li>
                      <li>
                        {t.rich("system.systemTab.clearCache", { strong })}
                      </li>
                      <li>
                        {t.rich("system.systemTab.checkUpdate", {
                          strong,
                          code,
                        })}
                      </li>
                      <li>
                        {t.rich("system.systemTab.sdUpdate", {
                          strong,
                          code,
                          link: (chunks) => (
                            <Link
                              href="/install"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              {chunks}
                            </Link>
                          ),
                        })}
                      </li>
                      <li>
                        {t.rich("system.systemTab.language", { strong })}
                      </li>
                    </ul>

                    <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
                      {t.rich("system.saveFormatNote", {
                        strong,
                        code: codeWhite,
                      })}
                    </div>
                  </div>

                  {/* EPUB Reader Menu (OK popup) */}
                  <div id="epub-reader-menu" className="scroll-mt-36">
                    <SectionLink
                      id="epub-reader-menu"
                      className="text-xl font-semibold text-gray-800 mb-2"
                    >
                      {t("epubReader.title")}
                    </SectionLink>
                    <p className="text-gray-600 mb-3">
                      {t.rich("epubReader.intro", { strong })}
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                      {epubItems.map((_item, i) => (
                        <li key={i}>
                          {t.rich(`epubReader.items.${i}`, { strong, em })}
                        </li>
                      ))}
                      <li>
                        {t.rich("epubReader.screenshot", {
                          strong,
                          code,
                          link: (chunks) => (
                            <Link
                              href="/guide/customize#screenshot"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              {chunks}
                            </Link>
                          ),
                        })}
                      </li>
                      <li>{t.rich("epubReader.qr", { strong })}</li>
                      <li>{t.rich("epubReader.home", { strong })}</li>
                      <li>
                        {t.rich("epubReader.syncProgress", {
                          strong,
                          link: (chunks) => (
                            <Link
                              href="/guide/customize#koreader-sync"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              {chunks}
                            </Link>
                          ),
                        })}
                      </li>
                      <li>{t.rich("epubReader.clearCache", { strong })}</li>
                      <li>
                        {t.rich("epubReader.resetTimer", {
                          strong,
                          link: (chunks) => (
                            <Link
                              href="/guide/customize#reading-timer"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              {chunks}
                            </Link>
                          ),
                        })}
                      </li>
                    </ul>
                    <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-sm text-blue-800 mb-2">
                      {t.rich("epubReader.footerNote", {
                        strong,
                        code: codeBlue,
                      })}
                    </div>
                  </div>

                  {/* TXT Reader Menu (OK popup) */}
                  <div id="txt-reader-menu" className="scroll-mt-36">
                    <SectionLink
                      id="txt-reader-menu"
                      className="text-xl font-semibold text-gray-800 mb-2"
                    >
                      {t("txtReader.title")}
                    </SectionLink>
                    <p className="text-gray-600 mb-3">
                      {t("txtReader.intro")}
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                      {txtItems.map((_item, i) => (
                        <li key={i}>
                          {t.rich(`txtReader.items.${i}`, { strong, em })}
                        </li>
                      ))}
                      <li>
                        {t.rich("txtReader.resetTimer", {
                          strong,
                          link: (chunks) => (
                            <Link
                              href="/guide/customize#reading-timer"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              {chunks}
                            </Link>
                          ),
                        })}
                      </li>
                    </ul>
                    <p className="text-gray-500 text-xs">
                      {t("txtReader.footerNote")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
