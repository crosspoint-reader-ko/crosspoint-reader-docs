"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { GuideNav } from "@/components/guide-nav";
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
const codeBlue = (chunks: React.ReactNode) => (
  <code className="bg-blue-100 px-1 rounded">{chunks}</code>
);
const codeYellow = (chunks: React.ReactNode) => (
  <code className="bg-yellow-100 px-1 rounded">{chunks}</code>
);

export default function GuideCustomizePage() {
  const t = useTranslations("guide.customize");

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
    { id: "koreader-sync", title: t("toc.koreaderSync") },
    { id: "sleep-screen", title: t("toc.sleepScreen") },
    { id: "custom-font", title: t("toc.customFont") },
    { id: "screenshot", title: t("toc.screenshot") },
    { id: "reading-timer", title: t("toc.readingTimer") },
  ];

  const optionASteps = t.raw("koreaderSync.optionASteps") as string[];
  const sleepItems = t.raw("sleepScreen.items") as string[];
  const rules = t.raw("readingTimer.rules") as string[][];

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
            {/* Quick Navigation */}
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {tocSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-full hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-colors"
                >
                  {section.title}
                </button>
              ))}
            </div>
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
                  <div id="koreader-sync" className="scroll-mt-36">
                    <SectionLink
                      id="koreader-sync"
                      className="text-xl font-semibold text-gray-800 mb-2"
                    >
                      {t("koreaderSync.title")}
                    </SectionLink>
                    <p className="text-gray-600 mb-4">
                      {t("koreaderSync.intro")}
                    </p>

                    <h4 className="text-lg font-medium text-gray-700 mt-4 mb-2">
                      {t.rich("koreaderSync.optionA", { code })}
                    </h4>
                    <ol className="list-decimal list-inside text-gray-600 space-y-2 mb-4">
                      {optionASteps.map((_item, i) => (
                        <li key={i}>
                          {t.rich(`koreaderSync.optionASteps.${i}`, {
                            strong,
                            code,
                          })}
                        </li>
                      ))}
                      <li>
                        {t.rich("koreaderSync.step4Intro", { strong })}
                        <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                          <li>
                            {t.rich("koreaderSync.step4ApplyRemote", {
                              strong,
                            })}
                          </li>
                          <li>
                            {t.rich("koreaderSync.step4UploadLocal", {
                              strong,
                            })}
                          </li>
                        </ul>
                      </li>
                    </ol>

                    <h4 className="text-lg font-medium text-gray-700 mt-4 mb-2">
                      {t("koreaderSync.optionB")}
                    </h4>
                    <p className="text-gray-600 mb-2">
                      {t("koreaderSync.optionBIntro")}
                    </p>
                    <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-4 overflow-x-auto text-sm">
                      <code>{`mkdir -p kosync-quickstart && cd kosync-quickstart
cat > compose.yaml <<'YAML'
services:
  kosync:
    image: koreader/kosync:latest
    ports:
      - "7200:7200"
      - "17200:17200"
    volumes:
      - ./data/redis:/var/lib/redis
    environment:
      - ENABLE_USER_REGISTRATION=true
    restart: unless-stopped
YAML

docker compose up -d
# 또는: podman compose up -d`}</code>
                    </pre>
                    <ol className="list-decimal list-inside text-gray-600 space-y-2 mb-4">
                      <li>
                        {t.rich("koreaderSync.optionBHealthcheck", {
                          code1: code,
                          code2: code,
                          state: () => <>{'{"state":"OK"}'}</>,
                        }) as React.ReactNode}
                      </li>
                      <li>{t("koreaderSync.optionBRegister")}</li>
                      <li>
                        {t.rich("koreaderSync.optionBSetUrl", {
                          strong,
                          code1: code,
                          code2: code,
                        })}
                      </li>
                    </ol>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-yellow-800 text-sm">
                        {t.rich("koreaderSync.securityWarning", {
                          strong,
                          code: codeYellow,
                        })}
                      </p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                      <p className="text-blue-800 text-sm">
                        {t.rich("koreaderSync.tip", { strong })}
                      </p>
                    </div>
                  </div>

                  <div id="sleep-screen" className="scroll-mt-36">
                    <SectionLink
                      id="sleep-screen"
                      className="text-xl font-semibold text-gray-800 mb-2"
                    >
                      {t("sleepScreen.title")}
                    </SectionLink>
                    <p className="text-gray-600 mb-2">
                      {t("sleepScreen.intro")}
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                      {sleepItems.map((_item, i) => (
                        <li key={i}>
                          {t.rich(`sleepScreen.items.${i}`, { strong })}
                        </li>
                      ))}
                    </ul>

                    <p className="text-gray-600 mb-2">
                      {t.rich("sleepScreen.customSetup", { strong })}
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>
                        {t.rich("sleepScreen.multiImages", {
                          strong,
                          code1: code,
                          code2: code,
                          code3: code,
                        })}
                      </li>
                      <li>
                        {t.rich("sleepScreen.singleImage", {
                          strong,
                          code1: code,
                          code2: code,
                          code3: code,
                        })}
                      </li>
                    </ul>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                      <p className="text-yellow-800 text-sm">
                        {t.rich("sleepScreen.settingNote", {
                          strong,
                          link: (chunks) => (
                            <Link
                              href="/guide/settings#settings"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              {chunks}
                            </Link>
                          ),
                        })}
                      </p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                      <p className="text-blue-800 text-sm">
                        {t.rich("sleepScreen.tip", {
                          strong,
                          link: (chunks) => (
                            <a
                              href="https://wallpaperconverter.jakegreen.dev/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                              {chunks}
                            </a>
                          ),
                        })}
                      </p>
                    </div>
                  </div>

                  <div id="custom-font" className="scroll-mt-36">
                    <SectionLink
                      id="custom-font"
                      className="text-xl font-semibold text-gray-800 mb-2"
                    >
                      {t("customFont.title")}
                    </SectionLink>
                    <p className="text-gray-600 mb-4">
                      {t("customFont.intro")}
                    </p>

                    <h4 className="text-lg font-medium text-gray-700 mb-2">
                      {t("customFont.prepareFontTitle")}
                    </h4>
                    <ol className="list-decimal list-inside text-gray-600 space-y-1 mb-4">
                      <li>
                        {t.rich("customFont.prepareStep1", {
                          code,
                          link: (chunks) => (
                            <Link
                              href="/font-converter"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              {chunks}
                            </Link>
                          ),
                        })}
                      </li>
                      <li>
                        {t.rich("customFont.prepareStep2", {
                          code1: code,
                          code2: code,
                        })}
                      </li>
                    </ol>

                    <h4 className="text-lg font-medium text-gray-700 mb-2">
                      {t("customFont.applyTitle")}
                    </h4>
                    <ol className="list-decimal list-inside text-gray-600 space-y-1 mb-4">
                      <li>
                        {t.rich("customFont.applyStep1", {
                          strong,
                          link: (chunks) => (
                            <Link
                              href="/guide/settings#settings"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              {chunks}
                            </Link>
                          ),
                        })}
                      </li>
                      <li>{t("customFont.applyStep2")}</li>
                      <li>{t("customFont.applyStep3")}</li>
                    </ol>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                      <p className="text-blue-800 text-sm">
                        {t.rich("customFont.defaultFontNote", { strong })}
                      </p>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                      <p className="text-yellow-800 text-sm">
                        {t.rich("customFont.limitNote", {
                          strong,
                          link: (chunks) => (
                            <Link
                              href="/korean-font"
                              className="text-yellow-700 underline hover:text-yellow-900"
                            >
                              {chunks}
                            </Link>
                          ),
                        })}
                      </p>
                    </div>
                  </div>

                  <div id="screenshot" className="scroll-mt-36">
                    <SectionLink
                      id="screenshot"
                      className="text-xl font-semibold text-gray-800 mb-2"
                    >
                      {t("screenshot.title")}
                    </SectionLink>
                    <p className="text-gray-600 mb-2">
                      {t("screenshot.intro")}
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                      <li>{t.rich("screenshot.method1", { strong })}</li>
                      <li>{t.rich("screenshot.method2", { strong })}</li>
                    </ul>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-800 text-sm">
                        {t.rich("screenshot.note", {
                          strong,
                          code: codeBlue,
                        })}
                      </p>
                    </div>
                  </div>

                  <div id="reading-timer" className="scroll-mt-36">
                    <SectionLink
                      id="reading-timer"
                      className="text-xl font-semibold text-gray-800 mb-2"
                    >
                      {t("readingTimer.title")}
                    </SectionLink>
                    <p className="text-gray-600 mb-3">
                      {t.rich("readingTimer.intro", { code })}
                    </p>

                    <h4 className="text-lg font-medium text-gray-700 mt-4 mb-2">
                      {t("readingTimer.whereTitle")}
                    </h4>
                    <p className="text-gray-600 mb-3">
                      {t.rich("readingTimer.whereDesc", {
                        strong,
                        code1: code,
                        code2: code,
                        code3: code,
                        code4: code,
                        code5: code,
                      })}
                    </p>

                    <h4 className="text-lg font-medium text-gray-700 mt-4 mb-2">
                      {t("readingTimer.rulesTitle")}
                    </h4>
                    <div className="overflow-x-auto mb-4">
                      <table className="min-w-full border border-gray-200 rounded-lg text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left font-semibold text-gray-900 border-b">
                              {t("readingTimer.rulesHeaderSituation")}
                            </th>
                            <th className="px-4 py-2 text-left font-semibold text-gray-900 border-b">
                              {t("readingTimer.rulesHeaderAction")}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {rules.map((row, i) => (
                            <tr key={i}>
                              <td
                                className={`px-4 py-2 text-gray-700 ${
                                  i < rules.length - 1 ? "border-b" : ""
                                }`}
                              >
                                {row[0]}
                              </td>
                              <td
                                className={`px-4 py-2 text-gray-700 ${
                                  i < rules.length - 1 ? "border-b" : ""
                                }`}
                              >
                                {row[1]}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <h4 className="text-lg font-medium text-gray-700 mt-4 mb-2">
                      {t("readingTimer.resetTitle")}
                    </h4>
                    <p className="text-gray-600 mb-3">
                      {t.rich("readingTimer.resetDesc", { strong })}
                    </p>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                      <p className="mb-2">
                        <strong>{t("readingTimer.compatTitle")}</strong>
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>
                          {t.rich("readingTimer.compat1", {
                            code1: codeBlue,
                            code2: codeBlue,
                            code3: codeBlue,
                          })}
                        </li>
                        <li>
                          {t.rich("readingTimer.compat2", { code: codeBlue })}
                        </li>
                        <li>{t("readingTimer.compat3")}</li>
                      </ul>
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
