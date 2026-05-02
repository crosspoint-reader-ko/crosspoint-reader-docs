"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

interface Section {
  id: string;
  titleKey:
    | "overview"
    | "appliedFonts"
    | "unicodeRanges"
    | "fontConversion"
    | "pythonConversion"
    | "license";
}

const sections: Section[] = [
  { id: "overview", titleKey: "overview" },
  { id: "applied-fonts", titleKey: "appliedFonts" },
  { id: "unicode-ranges", titleKey: "unicodeRanges" },
  { id: "font-conversion", titleKey: "fontConversion" },
  { id: "python-conversion", titleKey: "pythonConversion" },
  { id: "license", titleKey: "license" },
];

export default function KoreanFontContent() {
  const searchParams = useSearchParams();
  const t = useTranslations("koreanFont");

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const element = document.getElementById(hash);
      if (element) {
        setTimeout(() => {
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - 100;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }, 100);
      }
    }
  }, [searchParams]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - 100;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      window.history.pushState(null, "", `#${id}`);
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-linear-to-b from-blue-50 to-white py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900">{t("hero.title")}</h1>
          <p className="mt-4 text-lg text-gray-600">{t("hero.subtitle")}</p>
          {/* Quick Navigation */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-full hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-colors"
              >
                {t(`sections.${section.titleKey}`)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg prose-blue max-w-none">
            {/* Overview */}
            <div id="overview" className="rounded-2xl border border-gray-200 bg-white p-8 mb-8 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("overview.title")}</h2>
              <p className="text-gray-600 mb-4">{t("overview.intro")}</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>
                  <strong>{t("overview.epubLabel")}</strong> {t("overview.epubDesc")}
                </li>
                <li>
                  <strong>{t("overview.uiLabel")}</strong> {t("overview.uiDesc")}
                </li>
              </ul>
            </div>

            {/* Applied Fonts */}
            <div id="applied-fonts" className="rounded-2xl border border-gray-200 bg-white p-8 mb-8 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {t("appliedFonts.title")}
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">
                        {t("appliedFonts.table.purpose")}
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">
                        {t("appliedFonts.table.font")}
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">
                        {t("appliedFonts.table.style")}
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">
                        {t("appliedFonts.table.size")}
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">
                        {t("appliedFonts.table.header")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-700 border-b">
                        {t("appliedFonts.table.epubReader")}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 border-b">
                        KoPub Batang
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 border-b">
                        Regular
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 border-b">
                        14
                      </td>
                      <td className="px-4 py-3 text-sm border-b">
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                          kopub_14_regular.h
                        </code>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-700 border-b">
                        {t("appliedFonts.table.ui")}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 border-b">
                        Pretendard
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 border-b">
                        Regular
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 border-b">
                        8
                      </td>
                      <td className="px-4 py-3 text-sm border-b">
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                          pretendard_8.h
                        </code>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {t("appliedFonts.table.small")}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        Pretendard
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        Regular
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">8</td>
                      <td className="px-4 py-3 text-sm">
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                          pretendard_8.h
                        </code>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Unicode Ranges */}
            <div id="unicode-ranges" className="rounded-2xl border border-gray-200 bg-white p-8 mb-8 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {t("unicodeRanges.title")}
              </h2>
              <p className="text-gray-600 mb-4">{t("unicodeRanges.intro")}</p>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 rounded-lg text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900 border-b">
                        {t("unicodeRanges.table.range")}
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900 border-b">
                        {t("unicodeRanges.table.description")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <tr>
                      <td className="px-4 py-2 border-b">
                        <code className="bg-gray-100 px-1 rounded">
                          0xAC00-0xD7AF
                        </code>
                      </td>
                      <td className="px-4 py-2 border-b">
                        {t("unicodeRanges.rows.hangulSyllables")}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border-b">
                        <code className="bg-gray-100 px-1 rounded">
                          0x3130-0x318F
                        </code>
                      </td>
                      <td className="px-4 py-2 border-b">
                        {t("unicodeRanges.rows.hangulJamo")}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border-b">
                        <code className="bg-gray-100 px-1 rounded">
                          0x4E00-0x9FFF
                        </code>
                      </td>
                      <td className="px-4 py-2 border-b">
                        {t("unicodeRanges.rows.cjkUnified")}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border-b">
                        <code className="bg-gray-100 px-1 rounded">
                          0x3000-0x303F
                        </code>
                      </td>
                      <td className="px-4 py-2 border-b">
                        {t("unicodeRanges.rows.cjkSymbols")}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border-b">
                        <code className="bg-gray-100 px-1 rounded">
                          0x2000-0x206F
                        </code>
                      </td>
                      <td className="px-4 py-2 border-b">
                        {t("unicodeRanges.rows.generalPunctuation")}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border-b">
                        <code className="bg-gray-100 px-1 rounded">
                          0x2100-0x214F
                        </code>
                      </td>
                      <td className="px-4 py-2 border-b">
                        {t("unicodeRanges.rows.letterlikeSymbols")}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border-b">
                        <code className="bg-gray-100 px-1 rounded">
                          0x2150-0x218F
                        </code>
                      </td>
                      <td className="px-4 py-2 border-b">
                        {t("unicodeRanges.rows.numberForms")}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border-b">
                        <code className="bg-gray-100 px-1 rounded">
                          0x2190-0x21FF
                        </code>
                      </td>
                      <td className="px-4 py-2 border-b">
                        {t("unicodeRanges.rows.arrows")}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border-b">
                        <code className="bg-gray-100 px-1 rounded">
                          0x2200-0x22FF
                        </code>
                      </td>
                      <td className="px-4 py-2 border-b">
                        {t("unicodeRanges.rows.mathOperators")}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border-b">
                        <code className="bg-gray-100 px-1 rounded">
                          0x2460-0x24FF
                        </code>
                      </td>
                      <td className="px-4 py-2 border-b">
                        {t("unicodeRanges.rows.enclosedAlpha")}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border-b">
                        <code className="bg-gray-100 px-1 rounded">
                          0x2500-0x257F
                        </code>
                      </td>
                      <td className="px-4 py-2 border-b">
                        {t("unicodeRanges.rows.boxDrawings")}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border-b">
                        <code className="bg-gray-100 px-1 rounded">
                          0x25A0-0x25FF
                        </code>
                      </td>
                      <td className="px-4 py-2 border-b">
                        {t("unicodeRanges.rows.geometricShapes")}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border-b">
                        <code className="bg-gray-100 px-1 rounded">
                          0x2600-0x26FF
                        </code>
                      </td>
                      <td className="px-4 py-2 border-b">
                        {t("unicodeRanges.rows.miscSymbols")}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border-b">
                        <code className="bg-gray-100 px-1 rounded">
                          0x2700-0x27BF
                        </code>
                      </td>
                      <td className="px-4 py-2 border-b">
                        {t("unicodeRanges.rows.dingbats")}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2">
                        <code className="bg-gray-100 px-1 rounded">
                          0x3200-0x32FF
                        </code>
                      </td>
                      <td className="px-4 py-2">
                        {t("unicodeRanges.rows.enclosedCjk")}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Font Conversion */}
            <div id="font-conversion" className="rounded-2xl border border-gray-200 bg-white p-8 mb-8 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {t("fontConversion.title")}
              </h2>
              <p className="text-gray-600 mb-4">
                {t("fontConversion.intro.before")}
                <code className="bg-gray-100 px-1 rounded">.epdfont</code>
                {t("fontConversion.intro.after")}
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  {t("fontConversion.webConverter.title")}
                </h3>
                <p className="text-blue-700 mb-4">
                  {t("fontConversion.webConverter.description")}
                </p>
                <a
                  href="/font-converter"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  {t("fontConversion.webConverter.openButton")}
                </a>
              </div>

              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {t("fontConversion.usage.title")}
              </h3>
              <ol className="list-decimal list-inside text-gray-600 space-y-2 mb-6">
                <li>
                  <a href="/font-converter" className="text-blue-600 hover:underline">
                    {t("fontConversion.usage.step1.linkText")}
                  </a>
                  {t("fontConversion.usage.step1.after")}
                </li>
                <li>{t("fontConversion.usage.step2")}</li>
                <li>{t("fontConversion.usage.step3")}</li>
                <li>
                  {t("fontConversion.usage.step4.before")}
                  <code className="bg-gray-100 px-1 rounded">.epdfont</code>
                  {t("fontConversion.usage.step4.middle1")}
                  <code className="bg-gray-100 px-1 rounded">/.crosspoint/fonts/</code>
                  {t("fontConversion.usage.step4.middle2")}
                  <code className="bg-gray-100 px-1 rounded">/fonts/</code>
                  {t("fontConversion.usage.step4.after")}
                </li>
                <li>{t("fontConversion.usage.step5")}</li>
              </ol>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-yellow-800 mb-2">
                  {t("fontConversion.limitations.title")}
                </h4>
                <div className="text-sm text-yellow-700 space-y-2">
                  <p>
                    <strong>{t("fontConversion.limitations.supported")}</strong>{" "}
                    {t("fontConversion.limitations.supportedValue")}
                  </p>
                  <p>
                    <strong>{t("fontConversion.limitations.notSupported")}</strong>
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>
                      <strong>{t("fontConversion.limitations.variableFonts")}</strong>
                      {t("fontConversion.limitations.variableFontsDesc")}
                    </li>
                    <li>
                      <strong>{t("fontConversion.limitations.colorFonts")}</strong>
                      {t("fontConversion.limitations.colorFontsDesc")}
                    </li>
                    <li>
                      <strong>{t("fontConversion.limitations.bitmapFonts")}</strong>
                      {t("fontConversion.limitations.bitmapFontsDesc")}
                    </li>
                  </ul>
                  <p className="mt-2 text-yellow-600">
                    {t("fontConversion.limitations.note")}
                  </p>
                </div>
              </div>

            </div>

            {/* Python Advanced Conversion */}
            <div id="python-conversion" className="rounded-2xl border border-gray-200 bg-white p-8 mb-8 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {t("pythonConversion.title")}
              </h2>
              <p className="text-gray-600 mb-4">
                {t("pythonConversion.intro")}
              </p>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-800 mb-2">
                    {t("pythonConversion.requirements.title")}
                  </h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>{t("pythonConversion.requirements.python")}</li>
                    <li>{t("pythonConversion.requirements.freetype")}</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-800 mb-2">
                    {t("pythonConversion.install.title")}
                  </h4>
                  <div className="bg-gray-900 rounded-lg p-3 overflow-x-auto">
                    <code className="text-sm text-green-400">pip install freetype-py</code>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-800 mb-2">
                    {t("pythonConversion.download.title")}
                  </h4>
                  <a
                    href="/ttf_to_epdfont.py"
                    download="ttf_to_epdfont.py"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-900 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    {t("pythonConversion.download.button")}
                  </a>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-800 mb-2">
                    {t("pythonConversion.usage.title")}
                  </h4>
                  <div className="bg-gray-900 rounded-lg p-3 overflow-x-auto">
                    <code className="text-sm text-green-400 whitespace-pre">
                      {t.raw("pythonConversion.usage.command") as string}
                    </code>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-800 mb-2">
                    {t("pythonConversion.options.title")}
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left py-2 px-3 font-medium text-gray-900 border-b">
                            {t("pythonConversion.options.table.option")}
                          </th>
                          <th className="text-left py-2 px-3 font-medium text-gray-900 border-b">
                            {t("pythonConversion.options.table.description")}
                          </th>
                          <th className="text-left py-2 px-3 font-medium text-gray-900 border-b">
                            {t("pythonConversion.options.table.default")}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-700">
                        <tr className="border-b">
                          <td className="py-2 px-3 font-mono text-xs">--2bit</td>
                          <td className="py-2 px-3">
                            {t("pythonConversion.options.rows.twoBitDesc")}
                          </td>
                          <td className="py-2 px-3">
                            {t("pythonConversion.options.rows.twoBitDefault")}
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 px-3 font-mono text-xs">--line-height</td>
                          <td className="py-2 px-3">
                            {t("pythonConversion.options.rows.lineHeightDesc")}
                          </td>
                          <td className="py-2 px-3">1.2</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 px-3 font-mono text-xs">--letter-spacing</td>
                          <td className="py-2 px-3">
                            {t("pythonConversion.options.rows.letterSpacingDesc")}
                          </td>
                          <td className="py-2 px-3">0</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 px-3 font-mono text-xs">--width-scale</td>
                          <td className="py-2 px-3">
                            {t("pythonConversion.options.rows.widthScaleDesc")}
                          </td>
                          <td className="py-2 px-3">1.0</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 px-3 font-mono text-xs">--baseline-offset</td>
                          <td className="py-2 px-3">
                            {t("pythonConversion.options.rows.baselineOffsetDesc")}
                          </td>
                          <td className="py-2 px-3">0</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 font-mono text-xs">-o, --output</td>
                          <td className="py-2 px-3">
                            {t("pythonConversion.options.rows.outputDesc")}
                          </td>
                          <td className="py-2 px-3">
                            {t.raw("pythonConversion.options.rows.outputDefault") as string}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-800 mb-2">
                    {t("pythonConversion.example.title")}
                  </h4>
                  <div className="bg-gray-900 rounded-lg p-3 overflow-x-auto">
                    <code className="text-sm text-green-400 whitespace-pre">{`python ttf_to_epdfont.py kopub-batang 28 "KoPub Batang Light.ttf" \\
    --2bit \\
    --line-height 1.2 \\
    --letter-spacing 0 \\
    --width-scale 1.0 \\
    -o kopub_batang_28.epdfont`}</code>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div className="text-sm text-blue-700">
                      <p className="font-medium mb-1">{t("pythonConversion.info.title")}</p>
                      <p>{t("pythonConversion.info.description")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* License */}
            <div id="license" className="rounded-2xl border border-blue-200 bg-blue-50 p-8 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {t("license.title")}
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800">{t("license.kopub.title")}</h3>
                  <p className="text-gray-600 mb-2">
                    <a
                      href="https://www.kopus.org/biz-electronic-font2/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {t("license.kopub.providerLink")}
                    </a>
                    {t("license.kopub.providerSuffix")}
                  </p>
                  <ul className="text-sm text-gray-600 list-disc list-inside space-y-1 ml-2">
                    <li>{t("license.kopub.items.free")}</li>
                    <li>{t("license.kopub.items.commercial")}</li>
                    <li>{t("license.kopub.items.noModify")}</li>
                    <li>{t("license.kopub.items.noResale")}</li>
                  </ul>
                  <p className="text-xs text-gray-500 mt-2">
                    {t("license.kopub.termsBefore")}
                    <a
                      href="https://www.kopus.org/wp-content/uploads/2021/04/%EC%84%9C%EC%B2%B4_%EB%9D%BC%EC%9D%B4%EC%84%A0%EC%8A%A4.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {t("license.kopub.termsLink")}
                    </a>
                    {t("license.kopub.termsAfter")}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{t("license.pretendard.title")}</h3>
                  <p className="text-gray-600">
                    <a
                      href="https://github.com/orioncactus/pretendard"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {t("license.pretendard.linkText")}
                    </a>
                    {t("license.pretendard.suffix")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
