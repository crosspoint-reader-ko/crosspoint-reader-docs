"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { GuideNav } from "@/components/guide-nav";
import { useEffect } from "react";
import Link from "next/link";

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

const tocSections: { id: string; title: string }[] = [
  { id: "file-upload", title: "파일 전송" },
  { id: "calibre-wireless", title: "Calibre 무선 전송" },
  { id: "calibre-plugins", title: "Calibre 플러그인" },
];

export default function GuideFilesPage() {
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <GuideNav />

      <main className="flex-grow">
        {/* Hero */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900">파일 전송 · Calibre 연동</h1>
            <p className="mt-4 text-lg text-gray-600">
              기기에 전자책을 업로드하고 Calibre와 연동하는 방법입니다.
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
                  <div id="file-upload" className="scroll-mt-36">
                    <SectionLink
                      id="file-upload"
                      className="text-xl font-semibold text-gray-800 mb-2"
                    >
                      3.4 파일 전송 화면
                    </SectionLink>
                    <p className="text-gray-600 mb-2">
                      새 전자책을 기기에 업로드할 수 있습니다. 화면에 들어가면
                      WiFi 선택 대화상자가 표시되고, X4가 웹 서버를 호스팅하기
                      시작합니다.
                    </p>
                    <p className="text-gray-600 mb-2">
                      웹 브라우저 업로드 외에도 <strong>WebDAV</strong> 프로토콜을
                      지원하여 파일 관리자에서 직접 파일을 전송할 수 있습니다.
                      자세한 설정은{" "}
                      <Link
                        href="/webserver"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        웹서버 가이드
                      </Link>
                      를 참조하세요.
                    </p>
                    <p className="text-gray-600">
                      또한 웹 UI에서 SD 카드에 저장된 책을 <strong>직접
                      다운로드</strong>할 수 있어 다른 기기로 책을 옮기는 데에도
                      유용합니다. (v1.2.0 이상)
                    </p>
                  </div>

                  <div id="calibre-wireless" className="scroll-mt-36">
                    <SectionLink
                      id="calibre-wireless"
                      className="text-xl font-semibold text-gray-800 mb-2"
                    >
                      3.4.1 Calibre 무선 전송
                    </SectionLink>
                    <p className="text-gray-600 mb-4">
                      CrossPoint는 Calibre 디바이스 플러그인을 사용한 무선 전송을
                      지원합니다. 플러그인 설치는 아래{" "}
                      <Link
                        href="#calibre-plugins"
                        className="text-blue-600 hover:text-blue-800"
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToSection("calibre-plugins");
                        }}
                      >
                        Calibre 플러그인
                      </Link>{" "}
                      챕터를 먼저 진행하세요.
                    </p>
                    <ol className="list-decimal list-inside text-gray-600 space-y-2">
                      <li>
                        플러그인이 설치된 Calibre에서 CrossPoint Reader 기기가
                        자동 감지됩니다.
                      </li>
                      <li>
                        기기에서: <strong>파일 전송 → Calibre 연결 → 네트워크
                        참가</strong>
                      </li>
                      <li>
                        컴퓨터와 기기가 같은 WiFi 네트워크에 있는지 확인합니다.
                      </li>
                      <li>
                        Calibre에서 &quot;기기로 보내기&quot;를 클릭하면
                        EPUB/TXT 파일이 기기의 <code className="bg-gray-100 px-1 rounded">/books/</code>
                        폴더로 전송됩니다.
                      </li>
                    </ol>
                  </div>

                  <div id="calibre-plugins" className="scroll-mt-36">
                    <SectionLink
                      id="calibre-plugins"
                      className="text-xl font-semibold text-gray-800 mb-2"
                    >
                      3.4.2 Calibre 플러그인
                    </SectionLink>
                    <p className="text-gray-600 mb-4">
                      CrossPoint Reader 한국어 팀에서 제공하는{" "}
                      <strong>crosspoint_reader</strong> Calibre 플러그인은
                      기기로 무선 전송, 단축 메뉴, 기본 변환 프로파일 등을
                      통합 제공합니다. 원본 프로젝트의 포크로, 한국어 환경과
                      한국어 펌웨어 사양에 맞게 조정되어 있습니다.
                    </p>

                    <h4 className="text-lg font-medium text-gray-700 mt-4 mb-2">
                      주요 기능
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                      <li>Calibre 메뉴에서 기기 자동 감지 및 무선 연결</li>
                      <li>
                        <strong>기기로 보내기</strong>로 EPUB/TXT 파일을 WiFi로
                        전송
                      </li>
                      <li>CrossPoint 추천 변환 프로파일 기본 탑재</li>
                      <li>
                        한국어 폰트 포함 메타데이터 동기화 (책 제목, 저자, 커버
                        이미지 등 한글 표시 지원)
                      </li>
                    </ul>

                    <h4 className="text-lg font-medium text-gray-700 mt-4 mb-2">
                      설치 방법
                    </h4>
                    <ol className="list-decimal list-inside text-gray-600 space-y-2 mb-4">
                      <li>
                        <a
                          href="https://github.com/crosspoint-reader-ko/calibre-plugins/releases"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          crosspoint-reader-ko/calibre-plugins/releases
                        </a>
                        {" "}에서 최신{" "}
                        <code className="bg-gray-100 px-1 rounded">
                          crosspoint_reader.zip
                        </code>{" "}
                        파일을 다운로드합니다.
                      </li>
                      <li>
                        Calibre 실행 → <strong>환경 설정 → 플러그인</strong> 탭
                        이동
                      </li>
                      <li>
                        <strong>파일에서 플러그인 불러오기</strong> 선택 →
                        다운로드한 zip 파일 선택
                      </li>
                      <li>
                        Calibre를 재시작하면 플러그인이 활성화되고 기기가 자동
                        감지됩니다.
                      </li>
                    </ol>

                    <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-sm text-blue-800">
                      <strong>버전 호환:</strong> 한국어 펌웨어 v1.2.0+ 와 함께
                      사용을 권장합니다. 이전 펌웨어에서는 일부 메타데이터 전송
                      기능이 제한될 수 있습니다.
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
