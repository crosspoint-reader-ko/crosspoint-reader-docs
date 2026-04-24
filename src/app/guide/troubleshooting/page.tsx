"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { GuideNav } from "@/components/guide-nav";
import { useEffect } from "react";

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

export default function GuideTroubleshootingPage() {
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
            <h1 className="text-4xl font-bold text-gray-900">문제 해결 및 부트루프 탈출</h1>
            <p className="mt-4 text-lg text-gray-600">
              기기에 문제가 발생했을 때 확인할 수 있는 가이드입니다.
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
                  7. 문제 해결 및 부트루프 탈출
                </SectionLink>

                <p className="text-gray-600 mb-4">
                  CrossPoint 사용 중 문제나 충돌이 발생하면 이슈 티켓을 작성하고
                  시리얼 모니터 로그를 첨부해 주세요. 기기를 컴퓨터에 연결하고
                  시리얼 모니터를 시작하면 로그를 확인할 수 있습니다.{" "}
                  <a
                    href="https://www.serialmonitor.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Serial Monitor
                  </a>{" "}
                  또는 다음 명령어를 사용하세요:
                </p>

                <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-6 overflow-x-auto">
                  <code>pio device monitor</code>
                </pre>

                <p className="text-gray-600 mb-6">
                  기기가 부트루프에 빠진 경우, 리셋 버튼을 눌렀다 떼고, 설정된
                  뒤로 버튼과 전원 버튼을 동시에 누른 채로 유지하면 홈 화면으로
                  부팅됩니다.
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-blue-800 text-sm">
                    <strong>팁:</strong> 책이 제대로 렌더링되지 않거나 이상한
                    동작이 발생하면, SD 카드의{" "}
                    <code className="bg-blue-100 px-1 rounded">
                      .crosspoint
                    </code>{" "}
                    디렉토리를 삭제하여 캐시를 초기화해 보세요. 설정과 읽기
                    위치는 유지되지만 렌더링 캐시가 재생성됩니다.
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-900 text-sm">
                    <strong>v1.2.0 신기능:</strong> 기기가 비정상 종료된 경우
                    다음 부팅 시 <strong>충돌 원인(Crash Reason)</strong>이 화면에
                    표시되며, 크래시 리포트가 SD 카드 루트의{" "}
                    <code className="bg-green-100 px-1 rounded">
                      crash_report.txt
                    </code>{" "}
                    파일로 자동 저장됩니다. 이슈 제보 시 해당 파일을 첨부해
                    주세요.
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
