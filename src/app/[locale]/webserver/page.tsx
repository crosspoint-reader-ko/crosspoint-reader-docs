import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "webserver.metadata" });
  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
    },
  };
}

export default async function WebserverPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("webserver");

  const richTags = {
    strong: (chunks: React.ReactNode) => <strong>{chunks}</strong>,
    code: (chunks: React.ReactNode) => (
      <code className="bg-gray-100 px-1 rounded">{chunks}</code>
    ),
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900">
              {t("hero.title")}
            </h1>
            <p className="mt-4 text-lg text-gray-600">{t("hero.subtitle")}</p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg prose-blue max-w-none">
              {/* Overview */}
              <div className="rounded-2xl border border-gray-200 bg-white p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {t("overview.title")}
                </h2>
                <p className="text-gray-600 mb-4">{t("overview.intro")}</p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>{t("overview.features.upload")}</li>
                  <li>{t("overview.features.browse")}</li>
                  <li>{t("overview.features.folder")}</li>
                  <li>{t("overview.features.delete")}</li>
                  <li>{t.rich("overview.features.download", richTags)}</li>
                  <li>{t.rich("overview.features.webdav", richTags)}</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-4">
                  {t("overview.requirementsTitle")}
                </h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>{t("overview.requirements.device")}</li>
                  <li>{t("overview.requirements.wifi")}</li>
                  <li>{t.rich("overview.requirements.client", richTags)}</li>
                </ul>
              </div>

              {/* Step 1 */}
              <div className="rounded-2xl border border-gray-200 bg-white p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {t("step1.title")}
                </h2>
                <ol className="list-decimal list-inside text-gray-600 space-y-2">
                  <li>{t.rich("step1.items.settings", richTags)}</li>
                  <li>{t.rich("step1.items.wifi", richTags)}</li>
                  <li>{t("step1.items.scan")}</li>
                </ol>
              </div>

              {/* Step 2 */}
              <div className="rounded-2xl border border-gray-200 bg-white p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {t("step2.title")}
                </h2>

                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {t("step2.availableNetworksTitle")}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t("step2.availableNetworksIntro")}
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 mb-6">
                  <li>{t.rich("step2.indicators.signal", richTags)}</li>
                  <li>{t.rich("step2.indicators.lock", richTags)}</li>
                  <li>{t.rich("step2.indicators.saved", richTags)}</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {t("step2.selectNetworkTitle")}
                </h3>
                <ol className="list-decimal list-inside text-gray-600 space-y-2 mb-6">
                  <li>{t.rich("step2.selectNetwork.navigate", richTags)}</li>
                  <li>{t.rich("step2.selectNetwork.confirm", richTags)}</li>
                </ol>

                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {t("step2.passwordTitle")}
                </h3>
                <p className="text-gray-600 mb-4">{t("step2.passwordIntro")}</p>
                <ol className="list-decimal list-inside text-gray-600 space-y-1 mb-4">
                  <li>{t("step2.passwordSteps.keyboard")}</li>
                  <li>{t("step2.passwordSteps.navigate")}</li>
                  <li>{t.rich("step2.passwordSteps.confirm", richTags)}</li>
                  <li>{t.rich("step2.passwordSteps.done", richTags)}</li>
                </ol>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm">
                    <strong>{t("step2.noteLabel")}</strong> {t("step2.note")}
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="rounded-2xl border border-gray-200 bg-white p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {t("step3.title")}
                </h2>
                <p className="text-gray-600 mb-4">{t("step3.intro")}</p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                  <li>{t.rich("step3.info.ssid", richTags)}</li>
                  <li>{t.rich("step3.info.ip", richTags)}</li>
                  <li>{t.rich("step3.info.url", richTags)}</li>
                </ul>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-sm">
                    <strong>{t("step3.importantLabel")}</strong>{" "}
                    {t("step3.important")}
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="rounded-2xl border border-gray-200 bg-white p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {t("step4.title")}
                </h2>

                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {t("step4.computerTitle")}
                </h3>
                <ol className="list-decimal list-inside text-gray-600 space-y-1 mb-6">
                  <li>{t.rich("step4.computer.sameWifi", richTags)}</li>
                  <li>{t("step4.computer.openBrowser")}</li>
                  <li>{t("step4.computer.enterIp")}</li>
                  <li>{t("step4.computer.press")}</li>
                </ol>

                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {t("step4.mobileTitle")}
                </h3>
                <ol className="list-decimal list-inside text-gray-600 space-y-1">
                  <li>{t.rich("step4.mobile.sameWifi", richTags)}</li>
                  <li>{t("step4.mobile.openBrowser")}</li>
                  <li>{t("step4.mobile.enterIp")}</li>
                  <li>{t("step4.mobile.go")}</li>
                </ol>
              </div>

              {/* Step 5 */}
              <div className="rounded-2xl border border-gray-200 bg-white p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {t("step5.title")}
                </h2>

                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {t("step5.homeTitle")}
                </h3>
                <p className="text-gray-600 mb-4">{t("step5.homeIntro")}</p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 mb-6">
                  <li>{t("step5.home.status")}</li>
                  <li>{t("step5.home.wifi")}</li>
                  <li>{t("step5.home.ip")}</li>
                  <li>{t("step5.home.memory")}</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {t("step5.fileManagerTitle")}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t.rich("step5.fileManagerIntro", richTags)}
                </p>

                <div className="bg-gray-50 rounded-lg p-6 space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      {t("step5.browseTitle")}
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>{t("step5.browse.show")}</li>
                      <li>{t("step5.browse.click")}</li>
                      <li>{t("step5.browse.path")}</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      {t("step5.uploadTitle")}
                    </h4>
                    <ol className="list-decimal list-inside text-gray-600 space-y-1">
                      <li>{t.rich("step5.upload.addButton", richTags)}</li>
                      <li>{t.rich("step5.upload.selectMenu", richTags)}</li>
                      <li>{t.rich("step5.upload.chooseFile", richTags)}</li>
                      <li>{t.rich("step5.upload.uploadButton", richTags)}</li>
                      <li>{t("step5.upload.progress")}</li>
                      <li>{t("step5.upload.refresh")}</li>
                    </ol>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                      <p className="text-blue-800 text-sm">
                        <strong>{t("step5.uploadNoteLabel")}</strong>{" "}
                        {t("step5.uploadNote")}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      {t("step5.newFolderTitle")}
                    </h4>
                    <ol className="list-decimal list-inside text-gray-600 space-y-1">
                      <li>{t.rich("step5.newFolder.addButton", richTags)}</li>
                      <li>{t.rich("step5.newFolder.selectMenu", richTags)}</li>
                      <li>{t("step5.newFolder.name")}</li>
                      <li>{t.rich("step5.newFolder.create", richTags)}</li>
                    </ol>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      {t("step5.deleteTitle")}
                    </h4>
                    <ol className="list-decimal list-inside text-gray-600 space-y-1">
                      <li>{t("step5.delete.icon")}</li>
                      <li>{t("step5.delete.confirm")}</li>
                      <li>{t.rich("step5.delete.button", richTags)}</li>
                    </ol>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3">
                      <p className="text-red-800 text-sm">
                        <strong>{t("step5.deleteWarningLabel")}</strong>{" "}
                        {t("step5.deleteWarning")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Troubleshooting */}
              <div className="rounded-2xl border border-gray-200 bg-white p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {t("troubleshooting.title")}
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {t("troubleshooting.notVisible.title")}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      <strong>
                        {t("troubleshooting.notVisible.problemLabel")}
                      </strong>{" "}
                      {t("troubleshooting.notVisible.problem")}
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>
                        {t.rich(
                          "troubleshooting.notVisible.items.sameWifi",
                          richTags,
                        )}
                      </li>
                      <li>{t("troubleshooting.notVisible.items.ip")}</li>
                      <li>
                        {t.rich(
                          "troubleshooting.notVisible.items.http",
                          richTags,
                        )}
                      </li>
                      <li>{t("troubleshooting.notVisible.items.vpn")}</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {t("troubleshooting.drops.title")}
                    </h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>{t("troubleshooting.drops.items.closer")}</li>
                      <li>{t("troubleshooting.drops.items.signal")}</li>
                      <li>{t("troubleshooting.drops.items.interference")}</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {t("troubleshooting.uploadFails.title")}
                    </h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>{t("troubleshooting.uploadFails.items.valid")}</li>
                      <li>{t("troubleshooting.uploadFails.items.space")}</li>
                      <li>{t("troubleshooting.uploadFails.items.smaller")}</li>
                      <li>{t("troubleshooting.uploadFails.items.refresh")}</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Security */}
              <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {t("security.title")}
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>{t("security.items.port")}</li>
                  <li>{t.rich("security.items.noAuth", richTags)}</li>
                  <li>{t("security.items.connected")}</li>
                  <li>{t("security.items.stop")}</li>
                  <li>{t("security.items.trusted")}</li>
                </ul>
              </div>

              {/* Exit */}
              <div className="rounded-2xl border border-gray-200 bg-white p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {t("exit.title")}
                </h2>
                <p className="text-gray-600 mb-4">{t("exit.intro")}</p>
                <ol className="list-decimal list-inside text-gray-600 space-y-2">
                  <li>{t.rich("exit.steps.back", richTags)}</li>
                  <li>{t("exit.steps.stop")}</li>
                  <li>{t("exit.steps.disconnect")}</li>
                  <li>{t("exit.steps.return")}</li>
                </ol>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                  <p className="text-green-800 text-sm">{t("exit.success")}</p>
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
