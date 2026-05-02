"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { GuideNav } from "@/components/guide-nav";
import Image from "next/image";
import { getAssetPath } from "@/lib/basePath";
import { useEffect, useState } from "react";
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

// Common rich element factories
const strong = (chunks: React.ReactNode) => <strong>{chunks}</strong>;
const em = (chunks: React.ReactNode) => <em>{chunks}</em>;
const code = (chunks: React.ReactNode) => (
  <code className="bg-gray-100 px-1 rounded">{chunks}</code>
);
const codeBlue = (chunks: React.ReactNode) => (
  <code className="bg-blue-100 px-1 rounded">{chunks}</code>
);

export default function GuidePage() {
  const t = useTranslations("guide.basics");
  const [deviceTab, setDeviceTab] = useState<"x3" | "x4">("x4");

  // Handle hash on page load
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
    { id: "whats-new", title: t("toc.whatsNew") },
    { id: "hardware", title: t("toc.hardware") },
    { id: "power", title: t("toc.power") },
    { id: "screens", title: t("toc.screens") },
    { id: "reading", title: t("toc.reading") },
    { id: "chapter", title: t("toc.chapter") },
  ];

  const settingsUiItems = t.raw("whatsNew.settingsUi.items") as string[];
  const filesItems = t.raw("whatsNew.files.items") as string[];
  const readingItems = t.raw("whatsNew.reading.items") as string[];
  const systemItems = t.raw("whatsNew.system.items") as string[];
  const x3Specs = t.raw("hardware.x3Specs") as string[];
  const x3SensorItems = t.raw("hardware.x3Sensors.items") as string[];
  const x4Specs = t.raw("hardware.x4Specs") as string[];
  const x4FeatureItems = t.raw("hardware.x4Features.items") as string[];
  const controlItems = t.raw("screens.controlItems") as string[];

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
            <p className="mt-4 text-lg text-gray-600">{t("hero.description")}</p>
            <p className="mt-2 text-sm text-gray-500">
              {t.rich("hero.currentVersion", { strong })}
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

        {/* What's New */}
        <section className="py-10 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div
              id="whats-new"
              className="rounded-2xl border border-blue-200 bg-blue-50 p-6 scroll-mt-36"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {t("whatsNew.title")}
              </h2>
              <p className="text-gray-700 mb-4">
                {t.rich("whatsNew.intro", {
                  link: (chunks) => (
                    <Link
                      href="/releases"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      {chunks}
                    </Link>
                  ),
                })}
              </p>
              <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {t("whatsNew.settingsUi.title")}
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    {settingsUiItems.map((item, i) => (
                      <li key={i}>
                        {t.rich(`whatsNew.settingsUi.items.${i}`, {
                          strong,
                          code: (chunks) => (
                            <code className="bg-blue-100 px-1 rounded">
                              {chunks}
                            </code>
                          ),
                        })}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {t("whatsNew.files.title")}
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    {filesItems.map((_item, i) => (
                      <li key={i}>{t(`whatsNew.files.items.${i}`)}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {t("whatsNew.reading.title")}
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    {readingItems.map((_item, i) => (
                      <li key={i}>
                        {t.rich(`whatsNew.reading.items.${i}`, { strong })}
                      </li>
                    ))}
                    <li>
                      {t.rich("whatsNew.reading.timer", {
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
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {t("whatsNew.system.title")}
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    {systemItems.map((_item, i) => (
                      <li key={i}>{t(`whatsNew.system.items.${i}`)}</li>
                    ))}
                    <li>
                      {t.rich("whatsNew.system.sleepFolder", {
                        code: codeBlue,
                      })}
                    </li>
                    <li>{t("whatsNew.system.languages")}</li>
                  </ul>
                </div>
                <div className="sm:col-span-2">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {t("whatsNew.x3.title")}
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>{t.rich("whatsNew.x3.tilt", { strong })}</li>
                    <li>{t.rich("whatsNew.x3.clock", { strong })}</li>
                    <li>{t("whatsNew.x3.shared")}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg prose-blue max-w-none prose-a:no-underline">
              {/* Hardware Overview */}
              <div
                id="hardware"
                className="rounded-2xl border border-gray-200 bg-white p-8 mb-8 scroll-mt-36"
              >
                <SectionLink
                  id="hardware"
                  className="text-2xl font-bold text-gray-900 mb-4"
                >
                  {t("hardware.title")}
                </SectionLink>
                <p className="text-gray-600 mb-6">
                  {t.rich("hardware.intro", { strong })}
                </p>

                {/* Device tab switcher */}
                <div
                  role="tablist"
                  aria-label={t("hardware.tabAria")}
                  className="mb-6 inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1"
                >
                  {(
                    [
                      { id: "x4", label: "Xteink X4" },
                      { id: "x3", label: "Xteink X3" },
                    ] as const
                  ).map((tabItem) => (
                    <button
                      key={tabItem.id}
                      type="button"
                      role="tab"
                      aria-selected={deviceTab === tabItem.id}
                      onClick={() => setDeviceTab(tabItem.id)}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        deviceTab === tabItem.id
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {tabItem.label}
                    </button>
                  ))}
                </div>

                <div className="mb-8">
                  <Image
                    src={getAssetPath(
                      deviceTab === "x3"
                        ? "/x3-device-overview.svg"
                        : "/x4-device-overview.svg",
                    )}
                    alt={
                      deviceTab === "x3"
                        ? t("hardware.imageAltX3")
                        : t("hardware.imageAltX4")
                    }
                    width={800}
                    height={deviceTab === "x3" ? 422 : 422}
                    className="w-full h-auto rounded-lg bg-white"
                    unoptimized
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    {deviceTab === "x3"
                      ? t("hardware.imageCreditX3")
                      : t("hardware.imageCreditX4")}
                  </p>
                </div>

                {deviceTab === "x3" ? (
                  <div className="grid sm:grid-cols-2 gap-4 mb-8 text-sm">
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {t("hardware.specs")}
                      </h4>
                      <ul className="text-gray-700 space-y-1">
                        {x3Specs.map((spec, i) => (
                          <li key={i}>{spec}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {t("hardware.x3Sensors.title")}
                      </h4>
                      <ul className="text-gray-700 space-y-1">
                        {x3SensorItems.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                      <p className="text-xs text-gray-500 mt-3">
                        {t.rich("hardware.x3Sensors.note", {
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
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4 mb-8 text-sm">
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {t("hardware.specs")}
                      </h4>
                      <ul className="text-gray-700 space-y-1">
                        {x4Specs.map((spec, i) => (
                          <li key={i}>{spec}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {t("hardware.x4Features.title")}
                      </h4>
                      <ul className="text-gray-700 space-y-1">
                        {x4FeatureItems.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                      <p className="text-xs text-gray-500 mt-3">
                        {t("hardware.x4Features.note")}
                      </p>
                    </div>
                  </div>
                )}

                <h3
                  id="buttons"
                  className="text-xl font-semibold text-gray-800 mb-4 scroll-mt-36"
                >
                  {t("hardware.buttons.title")}
                </h3>

                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">
                          {t("hardware.buttons.headerLocation")}
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">
                          {t("hardware.buttons.headerButton")}
                        </th>
                      </tr>
                    </thead>
                    {deviceTab === "x3" ? (
                      <tbody>
                        <tr>
                          <td className="px-4 py-3 text-sm text-gray-700 border-b">
                            <strong>{t("hardware.buttons.bottom")}</strong>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700 border-b">
                            {t("hardware.buttons.x3BottomButtons")}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm text-gray-700 border-b">
                            <strong>{t("hardware.buttons.leftSide")}</strong>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700 border-b">
                            {t("hardware.buttons.x3LeftButtons")}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm text-gray-700 border-b">
                            <strong>{t("hardware.buttons.rightSide")}</strong>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700 border-b">
                            {t("hardware.buttons.x3RightButtons")}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm text-gray-700 border-b">
                            <strong>{t("hardware.buttons.top")}</strong>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700 border-b">
                            {t("hardware.buttons.x3TopButtons")}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            <strong>{t("hardware.buttons.back")}</strong>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {t("hardware.buttons.x3BackButtons")}
                          </td>
                        </tr>
                      </tbody>
                    ) : (
                      <tbody>
                        <tr>
                          <td className="px-4 py-3 text-sm text-gray-700 border-b">
                            <strong>{t("hardware.buttons.bottom")}</strong>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700 border-b">
                            {t("hardware.buttons.x4BottomButtons")}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm text-gray-700 border-b">
                            <strong>{t("hardware.buttons.leftSide")}</strong>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700 border-b">
                            {t("hardware.buttons.x4LeftButtons")}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm text-gray-700 border-b">
                            <strong>{t("hardware.buttons.rightSide")}</strong>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700 border-b">
                            {t("hardware.buttons.x4RightButtons")}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            <strong>{t("hardware.buttons.back")}</strong>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {t("hardware.buttons.x4BackButtons")}
                          </td>
                        </tr>
                      </tbody>
                    )}
                  </table>
                </div>
                <p className="text-gray-600 mt-4 text-sm">
                  {t.rich("hardware.buttons.footer", {
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

              {/* Power */}
              <div
                id="power"
                className="rounded-2xl border border-gray-200 bg-white p-8 mb-8 scroll-mt-36"
              >
                <SectionLink
                  id="power"
                  className="text-2xl font-bold text-gray-900 mb-6"
                >
                  {t("power.title")}
                </SectionLink>

                <h3
                  id="power-on-off"
                  className="text-xl font-semibold text-gray-800 mb-4 scroll-mt-36"
                >
                  {t("power.onOff")}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t.rich("power.onOffDesc", { strong })}
                </p>
                <p className="text-gray-600 mb-4">
                  {t.rich("power.onOffShortClick", {
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
                <p className="text-gray-600 mb-6">{t("power.reboot")}</p>

                <h3
                  id="first-launch"
                  className="text-xl font-semibold text-gray-800 mb-4 scroll-mt-36"
                >
                  {t("power.firstLaunch")}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t.rich("power.firstLaunchDesc", {
                    link: (chunks) => (
                      <a
                        href="#home"
                        className="text-blue-600 hover:text-blue-800"
                        onClick={(e) => {
                          e.preventDefault();
                          document
                            .getElementById("home")
                            ?.scrollIntoView({ behavior: "smooth" });
                          window.history.pushState(null, "", "#home");
                        }}
                      >
                        {chunks}
                      </a>
                    ),
                  })}
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm">
                    {t.rich("power.firstLaunchNote", { strong, em })}
                  </p>
                </div>
              </div>

              {/* Screens */}
              <div
                id="screens"
                className="rounded-2xl border border-gray-200 bg-white p-8 mb-8 scroll-mt-36"
              >
                <SectionLink
                  id="screens"
                  className="text-2xl font-bold text-gray-900 mb-6"
                >
                  {t("screens.title")}
                </SectionLink>

                <div className="space-y-6">
                  <div id="home" className="scroll-mt-36">
                    <SectionLink
                      id="home"
                      className="text-xl font-semibold text-gray-800 mb-2"
                    >
                      {t("screens.home")}
                    </SectionLink>
                    <p className="text-gray-600">
                      {t.rich("screens.homeDesc", { strong })}
                    </p>
                  </div>

                  <div id="file-explorer" className="scroll-mt-36">
                    <SectionLink
                      id="file-explorer"
                      className="text-xl font-semibold text-gray-800 mb-2"
                    >
                      {t("screens.fileExplorer")}
                    </SectionLink>
                    <p className="text-gray-600 mb-2">
                      {t("screens.fileExplorerIntro")}
                    </p>

                    <h4 className="text-lg font-medium text-gray-700 mt-3 mb-2">
                      {t("screens.recent")}
                    </h4>
                    <p className="text-gray-600 mb-2">
                      {t("screens.recentDesc")}
                    </p>

                    <h4 className="text-lg font-medium text-gray-700 mt-3 mb-2">
                      {t("screens.files")}
                    </h4>
                    <p className="text-gray-600 mb-2">
                      {t("screens.filesDesc")}
                    </p>

                    <p className="text-gray-600 mt-3 mb-2">
                      {t.rich("screens.controlsLabel", { strong })}
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {controlItems.map((_item, i) => (
                        <li key={i}>
                          {t.rich(`screens.controlItems.${i}`, {
                            strong,
                            code,
                          })}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div id="reading-screen" className="scroll-mt-36">
                    <SectionLink
                      id="reading-screen"
                      className="text-xl font-semibold text-gray-800 mb-2"
                    >
                      {t("screens.readingScreen")}
                    </SectionLink>
                    <p className="text-gray-600">
                      {t.rich("screens.readingScreenDesc", {
                        link: (chunks) => (
                          <a
                            href="#reading"
                            className="text-blue-600 hover:text-blue-800"
                            onClick={(e) => {
                              e.preventDefault();
                              document
                                .getElementById("reading")
                                ?.scrollIntoView({ behavior: "smooth" });
                              window.history.pushState(null, "", "#reading");
                            }}
                          >
                            {chunks}
                          </a>
                        ),
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Reading Mode */}
              <div
                id="reading"
                className="rounded-2xl border border-gray-200 bg-white p-8 mb-8 scroll-mt-36"
              >
                <SectionLink
                  id="reading"
                  className="text-2xl font-bold text-gray-900 mb-6"
                >
                  {t("reading.title")}
                </SectionLink>

                <p className="text-gray-600 mb-6">{t("reading.intro")}</p>

                <h3
                  id="page-turning"
                  className="text-xl font-semibold text-gray-800 mb-4 scroll-mt-36"
                >
                  {t("reading.pageTurning")}
                </h3>
                <div className="overflow-x-auto mb-6">
                  <table className="min-w-full border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">
                          {t("reading.headerAction")}
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">
                          {t("reading.headerButton")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700 border-b">
                          <strong>{t("reading.prevPage")}</strong>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 border-b">
                          {t.rich("reading.leftOrPrev", { em })}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          <strong>{t("reading.nextPage")}</strong>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {t.rich("reading.rightOrNext", { em })}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-gray-600 text-sm mt-2">
                  {t.rich("reading.sideButtonsNote", {
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
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <p className="text-blue-800 text-sm">
                    {t.rich("reading.tipPower", {
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

                <h3
                  id="chapter-nav"
                  className="text-xl font-semibold text-gray-800 mb-4 mt-6 scroll-mt-36"
                >
                  {t("reading.chapterNav")}
                </h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
                  <li>{t.rich("reading.nextChapter", { strong })}</li>
                  <li>{t.rich("reading.prevChapter", { strong })}</li>
                </ul>

                <h3
                  id="system-nav"
                  className="text-xl font-semibold text-gray-800 mb-4 scroll-mt-36"
                >
                  {t("reading.systemNav")}
                </h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>{t.rich("reading.backToFiles", { strong })}</li>
                  <li>{t.rich("reading.backToHome", { strong })}</li>
                  <li>
                    {t.rich("reading.chapterMenu", {
                      strong,
                      link: (chunks) => (
                        <a
                          href="#chapter"
                          className="text-blue-600 hover:text-blue-800"
                          onClick={(e) => {
                            e.preventDefault();
                            document
                              .getElementById("chapter")
                              ?.scrollIntoView({ behavior: "smooth" });
                            window.history.pushState(null, "", "#chapter");
                          }}
                        >
                          {chunks}
                        </a>
                      ),
                    })}
                  </li>
                </ul>

                <h3
                  id="supported-languages"
                  className="text-xl font-semibold text-gray-800 mb-4 mt-6 scroll-mt-36"
                >
                  {t("reading.supportedLanguages")}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t("reading.supportedLanguagesIntro")}
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                  <li>{t.rich("reading.latinBlock", { strong })}</li>
                  <li>{t.rich("reading.cyrillicBlock", { strong })}</li>
                  <li>{t.rich("reading.koreanBlock", { strong })}</li>
                </ul>
                <p className="text-gray-600 mb-4 text-sm">
                  {t("reading.languageNote")}
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-sm">
                    {t.rich("reading.unsupportedLangs", { strong })}
                  </p>
                </div>

                <h3
                  id="epub-images"
                  className="text-xl font-semibold text-gray-800 mb-4 mt-6 scroll-mt-36"
                >
                  {t("reading.epubImages")}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t.rich("reading.epubImagesDesc", { strong })}
                </p>
                <p className="text-gray-600 mb-4">
                  {t.rich("reading.jpegdecNote", { strong })}
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-sm">
                    {t.rich("reading.imagesLimitNote", {
                      strong,
                      link: (chunks) => (
                        <a
                          href="https://github.com/bigbag/epub-to-xtc-converter"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {chunks}
                        </a>
                      ),
                    })}
                  </p>
                </div>
              </div>

              {/* Chapter Selection */}
              <div
                id="chapter"
                className="rounded-2xl border border-gray-200 bg-white p-8 mb-8 scroll-mt-36"
              >
                <SectionLink
                  id="chapter"
                  className="text-2xl font-bold text-gray-900 mb-6"
                >
                  {t("chapter.title")}
                </SectionLink>

                <p className="text-gray-600 mb-4">
                  {t.rich("chapter.intro", { strong })}
                </p>

                <ol className="list-decimal list-inside text-gray-600 space-y-2">
                  <li>{t("chapter.step1")}</li>
                  <li>{t.rich("chapter.step2", { strong })}</li>
                  <li>{t.rich("chapter.step3", { strong, em })}</li>
                </ol>

                <h4 className="text-lg font-medium text-gray-700 mt-6 mb-2">
                  {t("chapter.koreaderSync")}
                </h4>
                <p className="text-gray-600 mb-2">
                  {t("chapter.koreaderSyncIntro")}
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>{t.rich("chapter.koreaderSyncProgress", { strong })}</li>
                  <li>{t("chapter.koreaderSyncChapter")}</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
