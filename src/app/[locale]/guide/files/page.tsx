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
const code = (chunks: React.ReactNode) => (
  <code className="bg-gray-100 px-1 rounded">{chunks}</code>
);

export default function GuideFilesPage() {
  const t = useTranslations("guide.files");

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
    { id: "file-upload", title: t("toc.fileUpload") },
    { id: "calibre-wireless", title: t("toc.calibreWireless") },
    { id: "calibre-plugins", title: t("toc.calibrePlugins") },
  ];

  const features = t.raw("calibrePlugins.features") as string[];

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
                  <div id="file-upload" className="scroll-mt-36">
                    <SectionLink
                      id="file-upload"
                      className="text-xl font-semibold text-gray-800 mb-2"
                    >
                      {t("fileUpload.title")}
                    </SectionLink>
                    <p className="text-gray-600 mb-2">{t("fileUpload.intro")}</p>
                    <p className="text-gray-600 mb-2">
                      {t.rich("fileUpload.webdav", {
                        strong,
                        link: (chunks) => (
                          <Link
                            href="/webserver"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {chunks}
                          </Link>
                        ),
                      })}
                    </p>
                    <p className="text-gray-600">
                      {t.rich("fileUpload.directDownload", { strong })}
                    </p>
                  </div>

                  <div id="calibre-wireless" className="scroll-mt-36">
                    <SectionLink
                      id="calibre-wireless"
                      className="text-xl font-semibold text-gray-800 mb-2"
                    >
                      {t("calibreWireless.title")}
                    </SectionLink>
                    <p className="text-gray-600 mb-4">
                      {t.rich("calibreWireless.intro", {
                        link: (chunks) => (
                          <a
                            href="#calibre-plugins"
                            className="text-blue-600 hover:text-blue-800"
                            onClick={(e) => {
                              e.preventDefault();
                              scrollToSection("calibre-plugins");
                            }}
                          >
                            {chunks}
                          </a>
                        ),
                      })}
                    </p>
                    <ol className="list-decimal list-inside text-gray-600 space-y-2">
                      <li>{t("calibreWireless.step1")}</li>
                      <li>
                        {t.rich("calibreWireless.step2", { strong })}
                      </li>
                      <li>{t("calibreWireless.step3")}</li>
                      <li>
                        {t.rich("calibreWireless.step4", { code })}
                      </li>
                    </ol>
                  </div>

                  <div id="calibre-plugins" className="scroll-mt-36">
                    <SectionLink
                      id="calibre-plugins"
                      className="text-xl font-semibold text-gray-800 mb-2"
                    >
                      {t("calibrePlugins.title")}
                    </SectionLink>
                    <p className="text-gray-600 mb-4">
                      {t.rich("calibrePlugins.intro", { strong })}
                    </p>

                    <h4 className="text-lg font-medium text-gray-700 mt-4 mb-2">
                      {t("calibrePlugins.featuresTitle")}
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                      {features.map((_item, i) => (
                        <li key={i}>
                          {t.rich(`calibrePlugins.features.${i}`, { strong })}
                        </li>
                      ))}
                    </ul>

                    <h4 className="text-lg font-medium text-gray-700 mt-4 mb-2">
                      {t("calibrePlugins.installTitle")}
                    </h4>
                    <ol className="list-decimal list-inside text-gray-600 space-y-2 mb-4">
                      <li>
                        {t.rich("calibrePlugins.installStep1", {
                          code,
                          link: (chunks) => (
                            <a
                              href="https://github.com/crosspoint-reader-ko/calibre-plugins/releases"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              {chunks}
                            </a>
                          ),
                        })}
                      </li>
                      <li>
                        {t.rich("calibrePlugins.installStep2", { strong })}
                      </li>
                      <li>
                        {t.rich("calibrePlugins.installStep3", { strong })}
                      </li>
                      <li>{t("calibrePlugins.installStep4")}</li>
                    </ol>

                    <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-sm text-blue-800">
                      {t.rich("calibrePlugins.compatNote", { strong })}
                    </div>
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
