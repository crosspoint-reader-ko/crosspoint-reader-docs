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

export default function GuideRoadmapPage() {
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
            <h1 className="text-4xl font-bold text-gray-900">제한사항 및 로드맵</h1>
            <p className="mt-4 text-lg text-gray-600">
              펌웨어가 현재 지원하지 않는 기능과 향후 계획입니다.
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
                  6. 현재 제한사항 및 로드맵
                </SectionLink>

                <p className="text-gray-600 mb-4">
                  이 펌웨어는 현재 활발히 개발 중입니다. 다음 기능은{" "}
                  <strong>아직 지원되지 않지만</strong> 향후 업데이트에서 추가될
                  예정입니다. 각 항목의 링크를 통해 토론에 참여할 수 있습니다:
                </p>

                <h4 className="text-lg font-medium text-gray-700 mt-4 mb-2">
                  렌더링
                </h4>
                <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                  <li>
                    <a
                      href="https://github.com/crosspoint-reader/crosspoint-reader/discussions/243"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      다크 모드
                    </a>{" "}
                    - 화면 반전 읽기 모드
                  </li>
                  <li>
                    <a
                      href="https://github.com/crosspoint-reader/crosspoint-reader/discussions/479"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      안티앨리어싱 파라미터 및 작은 폰트
                    </a>
                  </li>
                </ul>

                <h4 className="text-lg font-medium text-gray-700 mt-4 mb-2">
                  탐색 및 UI
                </h4>
                <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                  <li>
                    <a
                      href="https://github.com/crosspoint-reader/crosspoint-reader/discussions/520"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      페이지 이동
                    </a>{" "}
                    - 특정 페이지로 바로 이동
                  </li>
                  <li>
                    <a
                      href="https://github.com/crosspoint-reader/crosspoint-reader/discussions/456"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      책 내 검색
                    </a>{" "}
                    - 단어/문장 검색 기능
                  </li>
                  <li>
                    <a
                      href="https://github.com/crosspoint-reader/crosspoint-reader/discussions/239"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      북마크
                    </a>{" "}
                    - 책갈피 추가/관리
                  </li>
                  <li>
                    <a
                      href="https://github.com/crosspoint-reader/crosspoint-reader/discussions/416"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      텍스트 하이라이팅
                    </a>{" "}
                    - 간단한 텍스트 강조 기능
                  </li>
                  <li>
                    <a
                      href="https://github.com/crosspoint-reader/crosspoint-reader/discussions/538"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      인라인 각주
                    </a>{" "}
                    - 팝업 형태의 각주 표시
                  </li>
                  <li>
                    <a
                      href="https://github.com/crosspoint-reader/crosspoint-reader/discussions/301"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      상태 표시줄 옵션
                    </a>{" "}
                    - 시간 표시 등 추가 옵션
                  </li>
                  <li>
                    <a
                      href="https://github.com/crosspoint-reader/crosspoint-reader/discussions/238"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      파일 검색/필터
                    </a>{" "}
                    - 라이브러리 내 책 검색
                  </li>
                  <li>
                    <a
                      href="https://github.com/crosspoint-reader/crosspoint-reader/discussions/508"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      메타데이터 기반 브라우저
                    </a>{" "}
                    - 저자/제목별 정렬
                  </li>
                </ul>

                <h4 className="text-lg font-medium text-gray-700 mt-4 mb-2">
                  자동화 및 통계
                </h4>
                <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                  <li>
                    <a
                      href="https://github.com/crosspoint-reader/crosspoint-reader/discussions/226"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      읽기 통계
                    </a>{" "}
                    - 읽기 시간/속도 추적
                  </li>
                </ul>

                <h4 className="text-lg font-medium text-gray-700 mt-4 mb-2">
                  외부 서비스 연동
                </h4>
                <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                  <li>
                    <a
                      href="https://github.com/crosspoint-reader/crosspoint-reader/discussions/257"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Readwise/Instapaper 동기화
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/crosspoint-reader/crosspoint-reader/discussions/517"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Goodreads 연동
                    </a>
                  </li>
                </ul>

                <h4 className="text-lg font-medium text-gray-700 mt-4 mb-2">
                  다국어 지원
                </h4>
                <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                  <li>
                    <a
                      href="https://github.com/crosspoint-reader/crosspoint-reader/discussions/284"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      태국어 지원
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/crosspoint-reader/crosspoint-reader/discussions/494"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      아랍어 지원
                    </a>{" "}
                    - RTL 텍스트 렌더링
                  </li>
                  <li>
                    <a
                      href="https://github.com/crosspoint-reader/crosspoint-reader/discussions/276"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      베트남어 지원
                    </a>
                  </li>
                </ul>

                <h4 className="text-lg font-medium text-gray-700 mt-4 mb-2">
                  하드웨어 및 시스템
                </h4>
                <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                  <li>
                    <a
                      href="https://github.com/crosspoint-reader/crosspoint-reader/discussions/117"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      블루투스 페이지 터너
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/crosspoint-reader/crosspoint-reader/discussions/221"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      잠금 화면
                    </a>{" "}
                    - 간단한 비밀번호 잠금
                  </li>
                  <li>
                    <a
                      href="https://github.com/crosspoint-reader/crosspoint-reader/discussions/211"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      부팅 동작 선택
                    </a>{" "}
                    - 마지막 책으로 바로 시작
                  </li>
                  <li>
                    <a
                      href="https://github.com/crosspoint-reader/crosspoint-reader/discussions/359"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      설정 백업/복원
                    </a>{" "}
                    - 웹서버를 통한 설정 백업
                  </li>
                </ul>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                  <p className="text-blue-800 text-sm">
                    <strong>참여하기:</strong> 새로운 기능 제안이나 의견은{" "}
                    <a
                      href="https://github.com/crosspoint-reader/crosspoint-reader/discussions"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      GitHub Discussions
                    </a>
                    에서, 한국어 펌웨어 관련 논의는{" "}
                    <a
                      href="https://github.com/crosspoint-reader-ko/crosspoint-reader-ko/discussions"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      한국어 펌웨어 Discussions
                    </a>
                    에서 공유해주세요.
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
