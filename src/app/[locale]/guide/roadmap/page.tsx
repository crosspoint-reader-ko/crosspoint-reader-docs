"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { GuideNav } from "@/components/guide-nav";
import { useEffect } from "react";
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

function RoadmapLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:text-blue-800"
    >
      {children}
    </a>
  );
}

export default function GuideRoadmapPage() {
  const t = useTranslations("guide.roadmap");

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
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg prose-blue max-w-none prose-a:no-underline">
              {/* Limitations */}
              <div
                id="limitations"
                className="rounded-2xl border border-yellow-200 bg-yellow-50 p-8 scroll-mt-36"
              >
                <SectionLink
                  id="limitations"
                  className="text-2xl font-bold text-gray-900 mb-6"
                >
                  {t("title")}
                </SectionLink>

                <p className="text-gray-600 mb-4">
                  {t.rich("intro", { strong })}
                </p>

                <h4 className="text-lg font-medium text-gray-700 mt-4 mb-2">
                  {t("rendering.title")}
                </h4>
                <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                  <li>
                    <RoadmapLink href="https://github.com/crosspoint-reader/crosspoint-reader/discussions/243">
                      {t("rendering.darkMode")}
                    </RoadmapLink>
                    {t("rendering.darkModeDesc")}
                  </li>
                  <li>
                    <RoadmapLink href="https://github.com/crosspoint-reader/crosspoint-reader/discussions/479">
                      {t("rendering.antialiasing")}
                    </RoadmapLink>
                  </li>
                </ul>

                <h4 className="text-lg font-medium text-gray-700 mt-4 mb-2">
                  {t("navigation.title")}
                </h4>
                <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                  <li>
                    <RoadmapLink href="https://github.com/crosspoint-reader/crosspoint-reader/discussions/520">
                      {t("navigation.pageJump")}
                    </RoadmapLink>
                    {t("navigation.pageJumpDesc")}
                  </li>
                  <li>
                    <RoadmapLink href="https://github.com/crosspoint-reader/crosspoint-reader/discussions/456">
                      {t("navigation.search")}
                    </RoadmapLink>
                    {t("navigation.searchDesc")}
                  </li>
                  <li>
                    <RoadmapLink href="https://github.com/crosspoint-reader/crosspoint-reader/discussions/239">
                      {t("navigation.bookmark")}
                    </RoadmapLink>
                    {t("navigation.bookmarkDesc")}
                  </li>
                  <li>
                    <RoadmapLink href="https://github.com/crosspoint-reader/crosspoint-reader/discussions/416">
                      {t("navigation.highlight")}
                    </RoadmapLink>
                    {t("navigation.highlightDesc")}
                  </li>
                  <li>
                    <RoadmapLink href="https://github.com/crosspoint-reader/crosspoint-reader/discussions/538">
                      {t("navigation.footnote")}
                    </RoadmapLink>
                    {t("navigation.footnoteDesc")}
                  </li>
                  <li>
                    <RoadmapLink href="https://github.com/crosspoint-reader/crosspoint-reader/discussions/301">
                      {t("navigation.statusBar")}
                    </RoadmapLink>
                    {t("navigation.statusBarDesc")}
                  </li>
                  <li>
                    <RoadmapLink href="https://github.com/crosspoint-reader/crosspoint-reader/discussions/238">
                      {t("navigation.fileSearch")}
                    </RoadmapLink>
                    {t("navigation.fileSearchDesc")}
                  </li>
                  <li>
                    <RoadmapLink href="https://github.com/crosspoint-reader/crosspoint-reader/discussions/508">
                      {t("navigation.metadata")}
                    </RoadmapLink>
                    {t("navigation.metadataDesc")}
                  </li>
                </ul>

                <h4 className="text-lg font-medium text-gray-700 mt-4 mb-2">
                  {t("automation.title")}
                </h4>
                <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                  <li>
                    <RoadmapLink href="https://github.com/crosspoint-reader/crosspoint-reader/discussions/226">
                      {t("automation.stats")}
                    </RoadmapLink>
                    {t("automation.statsDesc")}
                  </li>
                </ul>

                <h4 className="text-lg font-medium text-gray-700 mt-4 mb-2">
                  {t("external.title")}
                </h4>
                <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                  <li>
                    <RoadmapLink href="https://github.com/crosspoint-reader/crosspoint-reader/discussions/257">
                      {t("external.readwise")}
                    </RoadmapLink>
                  </li>
                  <li>
                    <RoadmapLink href="https://github.com/crosspoint-reader/crosspoint-reader/discussions/517">
                      {t("external.goodreads")}
                    </RoadmapLink>
                  </li>
                </ul>

                <h4 className="text-lg font-medium text-gray-700 mt-4 mb-2">
                  {t("i18n.title")}
                </h4>
                <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                  <li>
                    <RoadmapLink href="https://github.com/crosspoint-reader/crosspoint-reader/discussions/284">
                      {t("i18n.thai")}
                    </RoadmapLink>
                  </li>
                  <li>
                    <RoadmapLink href="https://github.com/crosspoint-reader/crosspoint-reader/discussions/494">
                      {t("i18n.arabic")}
                    </RoadmapLink>
                    {t("i18n.arabicDesc")}
                  </li>
                  <li>
                    <RoadmapLink href="https://github.com/crosspoint-reader/crosspoint-reader/discussions/276">
                      {t("i18n.vietnamese")}
                    </RoadmapLink>
                  </li>
                </ul>

                <h4 className="text-lg font-medium text-gray-700 mt-4 mb-2">
                  {t("hardware.title")}
                </h4>
                <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                  <li>
                    <RoadmapLink href="https://github.com/crosspoint-reader/crosspoint-reader/discussions/117">
                      {t("hardware.bluetooth")}
                    </RoadmapLink>
                  </li>
                  <li>
                    <RoadmapLink href="https://github.com/crosspoint-reader/crosspoint-reader/discussions/221">
                      {t("hardware.lockScreen")}
                    </RoadmapLink>
                    {t("hardware.lockScreenDesc")}
                  </li>
                  <li>
                    <RoadmapLink href="https://github.com/crosspoint-reader/crosspoint-reader/discussions/211">
                      {t("hardware.bootBehavior")}
                    </RoadmapLink>
                    {t("hardware.bootBehaviorDesc")}
                  </li>
                  <li>
                    <RoadmapLink href="https://github.com/crosspoint-reader/crosspoint-reader/discussions/359">
                      {t("hardware.backupRestore")}
                    </RoadmapLink>
                    {t("hardware.backupRestoreDesc")}
                  </li>
                </ul>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                  <p className="text-blue-800 text-sm">
                    {t.rich("participate", {
                      strong,
                      link1: (chunks) => (
                        <a
                          href="https://github.com/crosspoint-reader/crosspoint-reader/discussions"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          {chunks}
                        </a>
                      ),
                      link2: (chunks) => (
                        <a
                          href="https://github.com/crosspoint-reader-ko/crosspoint-reader-ko/discussions"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          {chunks}
                        </a>
                      ),
                    })}
                  </p>
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
