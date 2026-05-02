import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getLatestRelease } from "@/lib/github";
import { CROSSPOINT_VERSION } from "@/constants/version";
import { getAssetPath } from "@/lib/basePath";
import { readFileSync } from "fs";
import { join } from "path";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "install.metadata" });
  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
    },
  };
}

interface StoreFirmwareInfo {
  x4File: string | null;
  x4Version: string | null;
  x3File: string | null;
  x3Version: string | null;
}

function loadStoreFirmwareInfo(): StoreFirmwareInfo {
  try {
    const data = JSON.parse(
      readFileSync(
        join(process.cwd(), "public", "firmware", "versions.json"),
        "utf-8",
      ),
    );
    return {
      x4File: data.x4ChineseOfficialFile || null,
      x4Version: data.x4ChineseOfficial || null,
      x3File: data.x3ChineseOfficialFile || null,
      x3Version: data.x3ChineseOfficial || null,
    };
  } catch {
    return { x4File: null, x4Version: null, x3File: null, x3Version: null };
  }
}

export default async function InstallPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("install");
  const latestRelease = await getLatestRelease();
  const storeFirmware = loadStoreFirmwareInfo();

  // API에서 가져온 정보 사용, 실패 시 fallback
  const version = latestRelease?.tag_name || CROSSPOINT_VERSION;

  // 웹 플래시용 펌웨어 (firmware.bin)
  const webFirmwareFilename =
    latestRelease?.web_firmware_name || "firmware.bin";
  const webFirmwareDownloadUrl =
    latestRelease?.web_firmware_url ||
    `https://github.com/crosspoint-reader-ko/crosspoint-reader-ko/releases/download/${CROSSPOINT_VERSION}/firmware.bin`;

  // esptool용 머지된 펌웨어 (CrossPoint-*.bin)
  const mergedFirmwareFilename =
    latestRelease?.merged_firmware_name ||
    `CrossPoint-${CROSSPOINT_VERSION}.bin`;
  const mergedFirmwareDownloadUrl =
    latestRelease?.merged_firmware_url ||
    `https://github.com/crosspoint-reader-ko/crosspoint-reader-ko/releases/download/${CROSSPOINT_VERSION}/CrossPoint-${CROSSPOINT_VERSION}.bin`;

  const richElements = {
    strong: (chunks: React.ReactNode) => <strong>{chunks}</strong>,
    code: (chunks: React.ReactNode) => (
      <code className="bg-gray-200 px-2 py-0.5 rounded text-sm">{chunks}</code>
    ),
  };
  const richElementsLargeCode = {
    strong: (chunks: React.ReactNode) => <strong>{chunks}</strong>,
    code: (chunks: React.ReactNode) => (
      <code className="bg-gray-200 px-2 py-1 rounded text-sm">{chunks}</code>
    ),
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700 mb-4">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
              </span>
              {t("hero.currentVersion", { version })}
            </div>
            <h1 className="text-4xl font-bold text-gray-900">{t("hero.title")}</h1>
            <p className="mt-4 text-lg text-gray-600">
              {t("hero.description")}
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg prose-blue max-w-none">
              {/* Method 1: Web Flash */}
              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-8 mb-12">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex h-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-sm px-3">
                    {t("method1.badge")}
                  </span>
                  <h2 className="text-2xl font-bold text-gray-900 m-0">
                    {t("method1.title")}
                  </h2>
                </div>
                <p className="text-gray-600 mb-6">
                  {t("method1.description")}
                </p>

                <div className="not-prose space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-sm">
                      1
                    </div>
                    <h3 className="font-semibold text-gray-900">
                      {t("method1.step1.title")}
                    </h3>
                  </div>
                  <p className="text-gray-600 ml-12">
                    {t.rich("method1.step1.x4", richElements)}
                    <br />
                    {t.rich("method1.step1.x3", richElements)}
                    <br />
                    <span className="text-sm text-gray-500">
                      {t.rich("method1.step1.note", richElements)}
                    </span>
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-sm">
                      2
                    </div>
                    <h3 className="font-semibold text-gray-900">
                      {t("method1.step2.title")}
                    </h3>
                  </div>
                  <div className="ml-12">
                    <p className="text-gray-600">
                      {t("method1.step2.description")}
                    </p>
                    <Link
                      href="/flasher"
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors mt-3"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                        />
                      </svg>
                      {t("method1.step2.button")}
                    </Link>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-sm">
                      3
                    </div>
                    <h3 className="font-semibold text-gray-900">
                      {t("method1.step3.title")}
                    </h3>
                  </div>
                  <div className="ml-12">
                    <p className="text-gray-600">
                      {t.rich("method1.step3.description", richElements)}
                    </p>
                    <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                      <li>{t("method1.step3.bullet1")}</li>
                      <li>{t("method1.step3.bullet2")}</li>
                    </ul>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-sm">
                      4
                    </div>
                    <h3 className="font-semibold text-gray-900">
                      {t("method1.step4.title")}
                    </h3>
                  </div>
                  <div className="ml-12">
                    <p className="text-gray-600">
                      {t("method1.step4.description")}
                    </p>
                    <ol className="list-decimal list-inside text-gray-600 mt-2 space-y-1">
                      <li>{t.rich("method1.step4.item1", richElements)}</li>
                      <li>{t.rich("method1.step4.item2", richElements)}</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Method 2: SD Card Update */}
              <div className="rounded-2xl border border-green-200 bg-green-50 p-8 mb-12">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex h-8 shrink-0 items-center justify-center rounded-full bg-green-600 text-white font-bold text-sm px-3">
                    {t("method2.badge")}
                  </span>
                  <h2 className="text-2xl font-bold text-gray-900 m-0">
                    {t("method2.title")}
                  </h2>
                </div>
                <p className="text-gray-600 mb-6">
                  {t("method2.description")}
                </p>

                <div className="not-prose space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      {t("method2.newUserTitle")}
                    </h3>
                    <ol className="list-decimal list-inside text-gray-600 space-y-2 ml-2">
                      <li>
                        {t.rich("method2.newUserStep1", {
                          ...richElements,
                          filename: webFirmwareFilename,
                        })}
                      </li>
                      <li>
                        {t.rich("method2.newUserStep2", richElements)}
                      </li>
                      <li>{t("method2.newUserStep3")}</li>
                      <li>{t.rich("method2.newUserStep4", richElements)}</li>
                      <li>{t("method2.newUserStep5")}</li>
                    </ol>
                  </div>

                  <div className="border-t border-green-200 pt-6">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      {t("method2.existingUserTitle")}
                    </h3>
                    <ol className="list-decimal list-inside text-gray-600 space-y-2 ml-2">
                      <li>
                        {t.rich("method2.existingUserStep1", {
                          ...richElements,
                          filename: webFirmwareFilename,
                        })}
                      </li>
                      <li>{t("method2.existingUserStep2")}</li>
                      <li>{t.rich("method2.existingUserStep3", richElements)}</li>
                      <li>{t("method2.existingUserStep4")}</li>
                      <li>{t("method2.existingUserStep5")}</li>
                    </ol>
                    <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
                      <p className="text-sm text-blue-800">
                        {t.rich("method2.existingUserTip", richElements)}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-green-200 pt-6">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      {t("method2.otaTitle")}
                    </h3>
                    <p className="text-gray-600">
                      {t.rich("method2.otaDescription", richElements)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Method 3: External Web Flasher */}
              <div className="rounded-2xl border border-gray-200 bg-white p-8 mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {t("method3.title")}
                </h2>
                <p className="text-gray-600 mb-6">
                  {t("method3.description")}
                </p>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {t("method3.step1Title")}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {t.rich("method3.step1Description", {
                        ...richElementsLargeCode,
                        filename: webFirmwareFilename,
                      })}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 mt-3">
                      <a
                        href={webFirmwareDownloadUrl}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-900 transition-colors"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                          />
                        </svg>
                        {t("method3.downloadButton")}
                      </a>
                      <a
                        href="https://github.com/crosspoint-reader-ko/crosspoint-reader-ko/releases"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        {t("method3.releasesButton")}
                      </a>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {t("method3.step2Title")}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {t("method3.step2Description")}
                    </p>
                    <a
                      href="https://xteink.dve.al/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-2 text-blue-600 hover:text-blue-700"
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
                          d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                        />
                      </svg>
                      {t("method3.openExternalFlasher")}
                    </a>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {t("method3.step3Title")}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {t.rich("method3.step3Description", richElements)}
                    </p>
                    <ol className="list-decimal list-inside text-gray-600 mt-2 space-y-1">
                      <li>{t.rich("method3.step3Item1", richElements)}</li>
                      <li>{t.rich("method3.step3Item2", richElements)}</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Method 4: esptool */}
              <div className="rounded-2xl border border-gray-200 bg-white p-8 mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {t("method4.title")}
                </h2>
                <p className="text-gray-600 mb-6">
                  {t("method4.description")}
                </p>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {t("method4.step1Title")}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {t.rich("method4.step1Description", {
                        ...richElementsLargeCode,
                        filename: mergedFirmwareFilename,
                      })}
                    </p>
                    <a
                      href={mergedFirmwareDownloadUrl}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-900 transition-colors mt-3"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                        />
                      </svg>
                      {t("method4.downloadMergedButton")}
                    </a>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {t("method4.step2Title")}
                    </h3>
                    <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 mt-2 overflow-x-auto">
                      <code>pip install esptool</code>
                    </pre>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {t("method4.step3Title")}
                    </h3>
                    <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 mt-2 overflow-x-auto">
                      <code>
                        esptool.py --chip esp32c3 write_flash 0x0{" "}
                        {mergedFirmwareFilename}
                      </code>
                    </pre>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <svg
                        className="h-6 w-6 text-yellow-600 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                        />
                      </svg>
                      <div>
                        <h4 className="font-semibold text-yellow-800">
                          {t("method4.cautionTitle")}
                        </h4>
                        <p className="text-yellow-700 text-sm mt-1">
                          {t("method4.cautionText")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reverting */}
              <div className="rounded-2xl border border-gray-200 bg-white p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {t("revert.title")}
                </h2>
                <p className="text-gray-600 mb-6">
                  {t("revert.description")}
                </p>

                <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <div className="flex gap-2">
                    <svg className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                    </svg>
                    <p className="text-sm text-blue-800">
                      {t("revert.settingsNote")}
                    </p>
                  </div>
                </div>

                {/* Store Firmware Downloads */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    {t("revert.storeDownloadsTitle")}
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {storeFirmware.x4File && (
                      <a
                        href={getAssetPath(`/firmware/${storeFirmware.x4File}`)}
                        download
                        className="flex items-center justify-between gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900">
                            {t("revert.x4Label")}{" "}
                            {storeFirmware.x4Version && (
                              <span className="text-sm font-normal text-gray-500">
                                v{storeFirmware.x4Version}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {storeFirmware.x4File}
                          </div>
                        </div>
                        <svg className="h-5 w-5 text-gray-600 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                      </a>
                    )}
                    {storeFirmware.x3File && (
                      <a
                        href={getAssetPath(`/firmware/${storeFirmware.x3File}`)}
                        download
                        className="flex items-center justify-between gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900">
                            {t("revert.x3Label")}{" "}
                            {storeFirmware.x3Version && (
                              <span className="text-sm font-normal text-gray-500">
                                v{storeFirmware.x3Version}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {storeFirmware.x3File}
                          </div>
                        </div>
                        <svg className="h-5 w-5 text-gray-600 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                      </a>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    {t("revert.filenameNote")}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900">
                      {t("revert.option1Title")}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      <Link
                        href="/flasher"
                        className="text-blue-600 hover:underline"
                      >
                        {t("revert.option1Link")}
                      </Link>
                      {t("revert.option1Suffix")}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900">
                      {t("revert.option2Title")}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {t.rich("revert.option2Description", richElements)}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900">
                      {t("revert.option3Title")}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      <a
                        href="https://xteink.dve.al/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        xteink.dve.al
                      </a>
                      {t("revert.option3Suffix")}
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
