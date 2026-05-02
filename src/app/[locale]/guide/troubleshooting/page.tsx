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
const code = (chunks: React.ReactNode) => (
  <code className="bg-blue-100 px-1 rounded">{chunks}</code>
);
const codeGreen = (chunks: React.ReactNode) => (
  <code className="bg-green-100 px-1 rounded">{chunks}</code>
);

export default function GuideTroubleshootingPage() {
  const t = useTranslations("guide.troubleshooting");

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
              {/* Troubleshooting */}
              <div
                id="troubleshooting"
                className="rounded-2xl border border-gray-200 bg-white p-8 mb-8 scroll-mt-36"
              >
                <SectionLink
                  id="troubleshooting"
                  className="text-2xl font-bold text-gray-900 mb-6"
                >
                  {t("title")}
                </SectionLink>

                <p className="text-gray-600 mb-4">
                  {t.rich("intro", {
                    link: (chunks) => (
                      <a
                        href="https://www.serialmonitor.org/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {chunks}
                      </a>
                    ),
                  })}
                </p>

                <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-6 overflow-x-auto">
                  <code>pio device monitor</code>
                </pre>

                <p className="text-gray-600 mb-6">{t("bootloop")}</p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-blue-800 text-sm">
                    {t.rich("tip", { strong, code })}
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-900 text-sm">
                    {t.rich("v120", { strong, code: codeGreen })}
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
