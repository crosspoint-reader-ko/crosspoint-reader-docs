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
  { id: "koreader-sync", title: "KOReader 동기화" },
  { id: "sleep-screen", title: "절전 화면" },
  { id: "custom-font", title: "커스텀 폰트" },
  { id: "screenshot", title: "스크린샷" },
];

export default function GuideCustomizePage() {
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
            <h1 className="text-4xl font-bold text-gray-900">커스터마이즈 · 동기화</h1>
            <p className="mt-4 text-lg text-gray-600">
              KOReader 동기화, 절전 화면, 커스텀 폰트, 스크린샷 사용법입니다.
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
                      3.5.5 KOReader 동기화 빠른 설정
                    </SectionLink>
                    <p className="text-gray-600 mb-4">
                      CrossPoint는 KOReader 호환 동기화 서버와 읽기 위치를
                      동기화할 수 있으며, 동일 서버/계정을 사용하는 KOReader
                      앱이나 기기와도 상호 운용됩니다.
                    </p>

                    <h4 className="text-lg font-medium text-gray-700 mt-4 mb-2">
                      옵션 A: 무료 공개 서버 ({" "}
                      <code className="bg-gray-100 px-1 rounded">
                        sync.koreader.rocks
                      </code>{" "}
                      )
                    </h4>
                    <ol className="list-decimal list-inside text-gray-600 space-y-2 mb-4">
                      <li>
                        (필요 시) 사용자 계정을 한 번만 등록합니다. 기존 KOReader
                        동기화 계정이 있다면 이 단계를 건너뛸 수 있습니다.
                      </li>
                      <li>
                        기기에서 <strong>설정 → 시스템 → KOReader 동기화</strong>
                        로 이동해 <strong>Username</strong>과{" "}
                        <strong>Password</strong>를 입력합니다. 비밀번호는 평문
                        그대로 입력하면 CrossPoint가 내부적으로 MD5를 계산합니다.
                      </li>
                      <li>
                        <strong>Sync Server URL</strong>을 비워두거나{" "}
                        <code className="bg-gray-100 px-1 rounded">
                          https://sync.koreader.rocks
                        </code>{" "}
                        로 설정한 뒤 <strong>Authenticate</strong>를 실행합니다.
                      </li>
                      <li>
                        책을 읽는 중에 <strong>확인</strong> 버튼을 눌러 리더
                        메뉴를 열고 <strong>Sync Progress</strong>를 선택합니다.
                        <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                          <li>
                            <strong>Apply Remote</strong>: 원격 진행 위치로
                            이동
                          </li>
                          <li>
                            <strong>Upload Local</strong>: 현재 진행 위치를
                            업로드
                          </li>
                        </ul>
                      </li>
                    </ol>

                    <h4 className="text-lg font-medium text-gray-700 mt-4 mb-2">
                      옵션 B: 자체 호스팅 (Docker Compose)
                    </h4>
                    <p className="text-gray-600 mb-2">
                      홈네트워크에 직접 동기화 서버를 띄울 수도 있습니다:
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
                        서버 상태 확인:{" "}
                        <code className="bg-gray-100 px-1 rounded">
                          curl -H &quot;Accept: application/vnd.koreader.v1+json&quot;
                          &quot;http://&lt;서버-IP&gt;:17200/healthcheck&quot;
                        </code>{" "}
                        &rarr;{" "}
                        <code className="bg-gray-100 px-1 rounded">
                          {"{\"state\":\"OK\"}"}
                        </code>
                      </li>
                      <li>
                        사용자 등록은 MD5 해시된 비밀번호로 진행합니다 (KOReader
                        kosync 기본 동작).
                      </li>
                      <li>
                        기기에서 <strong>Sync Server URL</strong>을{" "}
                        <code className="bg-gray-100 px-1 rounded">
                          http://&lt;서버-IP&gt;:17200
                        </code>{" "}
                        로 설정 (HTTPS 포트 7200 사용 시{" "}
                        <code className="bg-gray-100 px-1 rounded">
                          https://&lt;서버-IP&gt;:7200
                        </code>
                        ).
                      </li>
                    </ol>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-yellow-800 text-sm">
                        <strong>보안 경고:</strong> 평문 HTTP로 MD5 비밀번호를
                        주고받는 것은 안전하지 않습니다. 기기가 LAN 밖으로 트래픽을
                        내보내거나 공용 WiFi를 사용하는 환경에서는 HTTPS (
                        <code className="bg-yellow-100 px-1 rounded">
                          https://&lt;서버-IP&gt;:7200
                        </code>
                        )를 사용하고, 동기화 전용 계정을 만들어 메인 계정 비밀번호를
                        재사용하지 마세요.
                      </p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                      <p className="text-blue-800 text-sm">
                        <strong>팁:</strong> KOReader 동기화가 활성화된 상태에서
                        챕터 선택 화면을 열면 원격 진행 위치의 챕터 이름도 함께
                        표시되어, 다른 기기에서 읽던 위치를 쉽게 확인할 수
                        있습니다.
                      </p>
                    </div>
                  </div>

                  <div id="sleep-screen" className="scroll-mt-36">
                    <SectionLink
                      id="sleep-screen"
                      className="text-xl font-semibold text-gray-800 mb-2"
                    >
                      3.6 절전 화면 커스터마이징
                    </SectionLink>
                    <p className="text-gray-600 mb-2">
                      절전 화면 설정에 따라 표시되는 이미지가 달라집니다:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                      <li>
                        <strong>Dark (기본값):</strong> 어두운 배경 위의 CrossPoint 로고
                      </li>
                      <li>
                        <strong>Light:</strong> 흰색 배경 위의 CrossPoint 로고
                      </li>
                      <li>
                        <strong>Custom:</strong> SD 카드의 사용자 이미지 (아래 참조).
                        이미지가 없으면 Dark로 폴백
                      </li>
                      <li>
                        <strong>Cover:</strong> 현재 열려있는 책 표지. 책이
                        없을 때는 Dark로 폴백
                      </li>
                      <li>
                        <strong>Cover + Custom:</strong> 책이 열려있을 때만 표지
                        표시, 그 외에는 Custom 동작으로 폴백 (v1.2.0)
                      </li>
                      <li>
                        <strong>None:</strong> 빈 화면
                      </li>
                    </ul>

                    <p className="text-gray-600 mb-2">
                      <strong>Custom</strong> 또는 <strong>Cover + Custom</strong>을
                      사용할 때는 SD 카드에 이미지를 배치합니다:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>
                        <strong>여러 이미지 (권장):</strong> SD 카드 루트에{" "}
                        <code className="bg-gray-100 px-1 rounded">.sleep</code>{" "}
                        폴더 (숨김 폴더) 를 생성하고 원하는{" "}
                        <code className="bg-gray-100 px-1 rounded">.bmp</code>{" "}
                        이미지를 넣어둡니다. 기기가 슬립으로 진입할 때마다 이
                        중 하나가 무작위로 선택됩니다. (구버전 호환을 위해{" "}
                        <code className="bg-gray-100 px-1 rounded">sleep</code>{" "}
                        폴더도 폴백으로 인식됩니다.)
                      </li>
                      <li>
                        <strong>단일 이미지:</strong> 루트 디렉토리에{" "}
                        <code className="bg-gray-100 px-1 rounded">
                          sleep.bmp
                        </code>{" "}
                        파일 배치.{" "}
                        <code className="bg-gray-100 px-1 rounded">.sleep</code>
                        /
                        <code className="bg-gray-100 px-1 rounded">sleep</code>{" "}
                        폴더에서 유효한 이미지를 찾지 못했을 때 폴백으로
                        사용됩니다.
                      </li>
                    </ul>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                      <p className="text-yellow-800 text-sm">
                        <strong>참고:</strong> 이 이미지를 사용하려면{" "}
                        <Link
                          href="/guide/settings#settings"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          설정
                        </Link>
                        에서 <strong>절전 화면 이미지</strong>를{" "}
                        <strong>사용자 정의</strong>로 설정해야 합니다.
                      </p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                      <p className="text-blue-800 text-sm">
                        <strong>팁:</strong> 최상의 결과를 위해 24비트 색상의
                        비압축 BMP 파일과 480x800 픽셀 해상도를 사용하세요.{" "}
                        <a
                          href="https://wallpaperconverter.jakegreen.dev/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          X4 Wallpaper Converter
                        </a>
                        를 사용하면 이미지를 적합한 형식으로 쉽게 변환할 수
                        있습니다.
                      </p>
                    </div>
                  </div>

                  <div id="custom-font" className="scroll-mt-36">
                    <SectionLink
                      id="custom-font"
                      className="text-xl font-semibold text-gray-800 mb-2"
                    >
                      3.7 커스텀 폰트
                    </SectionLink>
                    <p className="text-gray-600 mb-4">
                      EPUB/TXT 리더에서 사용자 정의 폰트를 사용할 수 있습니다.
                      폰트 변경 시 재부팅 없이 즉시 적용되며, 현재 읽고 있던
                      위치도 그대로 유지됩니다. 단, 폰트 변경 시 기존 렌더링
                      캐시가 비활성화되고 인덱싱이 다시 수행됩니다.
                    </p>

                    <h4 className="text-lg font-medium text-gray-700 mb-2">
                      폰트 파일 준비
                    </h4>
                    <ol className="list-decimal list-inside text-gray-600 space-y-1 mb-4">
                      <li>
                        <code className="bg-gray-100 px-1 rounded">.epdfont</code>{" "}
                        확장자의 폰트 파일을 준비합니다. (
                        <Link
                          href="/font-converter"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          폰트 변환기
                        </Link>
                        를 사용하여 TTF/OTF 폰트를 변환할 수 있습니다.)
                      </li>
                      <li>
                        SD 카드의{" "}
                        <code className="bg-gray-100 px-1 rounded">
                          /.crosspoint/fonts/
                        </code>{" "}
                        또는 루트의{" "}
                        <code className="bg-gray-100 px-1 rounded">
                          /fonts/
                        </code>{" "}
                        폴더에 폰트 파일을 복사합니다.
                      </li>
                    </ol>

                    <h4 className="text-lg font-medium text-gray-700 mb-2">
                      폰트 적용
                    </h4>
                    <ol className="list-decimal list-inside text-gray-600 space-y-1 mb-4">
                      <li>
                        <Link
                          href="/guide/settings#settings"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          설정
                        </Link>{" "}
                        &gt; <strong>글꼴 설정</strong>으로 이동합니다.
                      </li>
                      <li>목록에서 원하는 폰트를 선택합니다.</li>
                      <li>선택한 폰트가 EPUB/TXT 리더에 즉시 적용됩니다.</li>
                    </ol>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                      <p className="text-blue-800 text-sm">
                        <strong>참고:</strong> 기본 폰트는{" "}
                        <strong>KoPub 바탕</strong>으로, 한국어 읽기에 최적화되어
                        있습니다.
                      </p>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                      <p className="text-yellow-800 text-sm">
                        <strong>지원 제한:</strong> 가변 폰트(Variable Fonts),
                        컬러 폰트(Emoji), 비트맵 전용 폰트는 지원되지 않습니다.
                        자세한 내용은{" "}
                        <Link
                          href="/korean-font"
                          className="text-yellow-700 underline hover:text-yellow-900"
                        >
                          한글 폰트
                        </Link>{" "}
                        페이지를 참조하세요.
                      </p>
                    </div>
                  </div>

                  <div id="screenshot" className="scroll-mt-36">
                    <SectionLink
                      id="screenshot"
                      className="text-xl font-semibold text-gray-800 mb-2"
                    >
                      3.8 스크린샷
                    </SectionLink>
                    <p className="text-gray-600 mb-2">
                      현재 화면의 스크린샷을 BMP 파일로 저장할 수 있습니다.
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                      <li>
                        <strong>방법 1:</strong> <strong>전원 + 볼륨 다운</strong>{" "}
                        버튼을 동시에 누르기
                      </li>
                      <li>
                        <strong>방법 2:</strong> 읽기 화면에서 챕터 메뉴를 열고{" "}
                        <strong>스크린샷</strong> 옵션 선택
                      </li>
                    </ul>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-800 text-sm">
                        <strong>참고:</strong> 스크린샷은 SD 카드의{" "}
                        <code className="bg-blue-100 px-1 rounded">
                          /.crosspoint/screenshots/
                        </code>{" "}
                        폴더에 저장됩니다.
                      </p>
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
