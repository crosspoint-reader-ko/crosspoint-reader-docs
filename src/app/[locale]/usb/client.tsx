"use client";

import { useTranslations } from "next-intl";
import { useBridge } from "@/lib/usb/useBridge";
import { FileManager } from "@/components/usb/FileManager";

export function UsbPageClient() {
  const tHero = useTranslations("usb.hero");
  const tInstructions = useTranslations("usb.instructions");
  const tBrowserUnsupported = useTranslations("usb.browserUnsupported");
  const { bridge, state, connect, disconnect, supported } = useBridge();

  const richTags = {
    strong: (chunks: React.ReactNode) => (
      <strong className="font-semibold text-gray-900">{chunks}</strong>
    ),
    code: (chunks: React.ReactNode) => (
      <code className="bg-gray-100 text-gray-800 rounded px-1.5 py-0.5 text-[0.92em] font-mono">
        {chunks}
      </code>
    ),
  };

  return (
    <>
      {/* Hero */}
      <section className="pt-14 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wide uppercase rounded-full bg-blue-100 text-blue-700 ring-1 ring-blue-200">
            {tHero("browserBadge")}
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
            {tHero("title")}
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            {tHero("subtitle")}
          </p>
        </div>
      </section>

      {/* Browser unsupported warning */}
      {!supported && (
        <section className="px-4 sm:px-6 lg:px-8 mb-8">
          <div className="mx-auto max-w-5xl">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 flex gap-4">
              <div className="flex-shrink-0 rounded-full bg-amber-100 p-2 text-amber-600">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-amber-900">
                  {tBrowserUnsupported("title")}
                </h3>
                <p className="text-sm text-amber-800 mt-1">
                  {tBrowserUnsupported("description")}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* File Manager */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <FileManager
            bridge={bridge}
            state={state}
            onConnect={connect}
            onDisconnect={disconnect}
          />
        </div>
      </section>

      {/* Instructions */}
      <section className="py-14 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            {tInstructions("title")}
          </h2>
          <div className="grid gap-5 md:grid-cols-3">
            {(["step1", "step2", "step3"] as const).map((step, i) => (
              <div
                key={step}
                className="rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-semibold text-lg mb-4">
                  {i + 1}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {tInstructions(`${step}.title`)}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {tInstructions.rich(`${step}.body`, richTags)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl bg-blue-50/60 border border-blue-100 p-5">
            <h4 className="font-semibold text-blue-900 mb-1">
              {tInstructions("noteTitle")}
            </h4>
            <p className="text-sm text-blue-800">{tInstructions("note")}</p>
          </div>
        </div>
      </section>
    </>
  );
}
