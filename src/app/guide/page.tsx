"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import { getAssetPath } from "@/lib/basePath";
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

export default function GuidePage() {
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900">사용자 가이드</h1>
            <p className="mt-4 text-lg text-gray-600">
              CrossPoint Reader 한국어 버전의 기본 사용 방법입니다.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              현재 문서 버전: <strong>v1.2.0-ko.0</strong>
            </p>
          </div>
        </section>

        {/* What's New */}
        <section className="py-10 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div
              id="whats-new"
              className="rounded-2xl border border-blue-200 bg-blue-50 p-6 scroll-mt-24"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                v1.2.0 주요 변경사항
              </h2>
              <p className="text-gray-700 mb-4">
                이 릴리즈는 upstream CrossPoint v1.2.0 을 한국어 펌웨어에
                통합한 메이저 업데이트입니다. 전체 릴리즈 노트는{" "}
                <Link
                  href="/releases"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  릴리즈 노트 페이지
                </Link>
                에서 확인할 수 있습니다.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    설정 & UI
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>설정 화면 4개 탭 (화면 / 리더 / 조작 / 시스템)</li>
                    <li>
                      바이너리 설정을{" "}
                      <code className="bg-blue-100 px-1 rounded">.json</code>{" "}
                      포맷으로 이전 (백업/복원 용이)
                    </li>
                    <li>테마에 맞춘 언어 선택 화면</li>
                    <li>방향 인식 팝업 (Landscape 모드에서도 올바르게 표시)</li>
                    <li>홈 화면 Lyra Extended 테마 (책 3권 표시)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    파일 관리
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>다중 선택 파일 삭제</li>
                    <li>전체 경로 바 (Full path bar)</li>
                    <li>파일 확장자 표시 및 [dir] 접두어</li>
                    <li>숨김 파일/폴더 표시 토글</li>
                    <li>BMP 이미지 뷰어</li>
                    <li>웹서버에서 책 직접 다운로드</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    읽기 경험
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      다음 챕터 <strong>사일런트 프리 인덱싱</strong>으로
                      더 빠른 챕터 전환
                    </li>
                    <li>
                      각주 인라인 탐색 (Footnote Navigation) / 슬림 각주 모드
                    </li>
                    <li>자동 페이지 넘김 (Auto Page Turn)</li>
                    <li>책 끝 페이지 탐색 동작 설정</li>
                    <li>
                      전원 버튼으로 <strong>수동 화면 새로고침</strong>
                    </li>
                    <li>JPEGDEC 기반 이미지 / 커버 변환 성능 개선</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    시스템 & 안정성
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>OPDS 검색 및 다음/이전 페이지 지원</li>
                    <li>충전 중 배터리 번개 인디케이터</li>
                    <li>1% 단위 배터리 잔량 표시 (X4)</li>
                    <li>크래시 원인 부팅 시 표시 + SD 크래시 로그 저장</li>
                    <li>
                      <code className="bg-blue-100 px-1 rounded">.sleep</code>{" "}
                      폴더 우선 + Cover + Custom 모드 개선
                    </li>
                    <li>헝가리어, 슬로베니아어, 리투아니아어, 카자흐어 등 추가</li>
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
                className="rounded-2xl border border-gray-200 bg-white p-8 mb-8 scroll-mt-24"
              >
                <SectionLink
                  id="hardware"
                  className="text-2xl font-bold text-gray-900 mb-6"
                >
                  1. 하드웨어 개요
                </SectionLink>

                <div className="mb-8">
                  <Image
                    src={getAssetPath("/device-overview.png")}
                    alt="Xteink X4 하드웨어 개요"
                    width={800}
                    height={600}
                    className="w-full h-auto rounded-lg"
                  />
                </div>

                <h3
                  id="buttons"
                  className="text-xl font-semibold text-gray-800 mb-4 scroll-mt-24"
                >
                  버튼 배치
                </h3>

                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">
                          위치
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">
                          버튼
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700 border-b">
                          <strong>하단</strong>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 border-b">
                          뒤로, 확인, 왼쪽, 오른쪽
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          <strong>우측면</strong>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          전원, 볼륨 업, 볼륨 다운, 리셋
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-gray-600 mt-4 text-sm">
                  버튼 배치는{" "}
                  <Link
                    href="#settings"
                    className="text-blue-600 hover:text-blue-800"
                    onClick={(e) => {
                      e.preventDefault();
                      document
                        .getElementById("settings")
                        ?.scrollIntoView({ behavior: "smooth" });
                      window.history.pushState(null, "", "#settings");
                    }}
                  >
                    설정
                  </Link>
                  에서 커스터마이징할 수 있습니다.
                </p>
              </div>

              {/* Power */}
              <div
                id="power"
                className="rounded-2xl border border-gray-200 bg-white p-8 mb-8 scroll-mt-24"
              >
                <SectionLink
                  id="power"
                  className="text-2xl font-bold text-gray-900 mb-6"
                >
                  2. 전원 및 시작
                </SectionLink>

                <h3
                  id="power-on-off"
                  className="text-xl font-semibold text-gray-800 mb-4 scroll-mt-24"
                >
                  전원 켜기/끄기
                </h3>
                <p className="text-gray-600 mb-4">
                  기기를 켜거나 끄려면 <strong>전원 버튼을 0.5초 이상</strong>{" "}
                  누르세요.
                </p>
                <p className="text-gray-600 mb-4">
                  <Link
                    href="#settings"
                    className="text-blue-600 hover:text-blue-800"
                    onClick={(e) => {
                      e.preventDefault();
                      document
                        .getElementById("settings")
                        ?.scrollIntoView({ behavior: "smooth" });
                      window.history.pushState(null, "", "#settings");
                    }}
                  >
                    설정
                  </Link>
                  에서 짧은 클릭으로 전원 버튼이 작동하도록 변경할 수 있습니다.
                </p>
                <p className="text-gray-600 mb-6">
                  기기를 재부팅하려면 (예: 펌웨어 업데이트 후 또는 기기가 멈춘
                  경우) 리셋 버튼을 눌렀다 떼고, 전원 버튼을 몇 초간 누르세요.
                </p>

                <h3
                  id="first-launch"
                  className="text-xl font-semibold text-gray-800 mb-4 scroll-mt-24"
                >
                  첫 실행
                </h3>
                <p className="text-gray-600 mb-4">
                  기기를 처음 켜면{" "}
                  <Link
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
                    홈 화면
                  </Link>
                  이 표시됩니다.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm">
                    <strong>참고:</strong> 이후 재시작 시에는 마지막으로 읽던
                    책이 자동으로 열립니다.
                  </p>
                </div>
              </div>

              {/* Screens */}
              <div
                id="screens"
                className="rounded-2xl border border-gray-200 bg-white p-8 mb-8 scroll-mt-24"
              >
                <SectionLink
                  id="screens"
                  className="text-2xl font-bold text-gray-900 mb-6"
                >
                  3. 화면 구성
                </SectionLink>

                <div className="space-y-6">
                  <div id="home" className="scroll-mt-24">
                    <SectionLink
                      id="home"
                      className="text-xl font-semibold text-gray-800 mb-2"
                    >
                      3.1 홈 화면
                    </SectionLink>
                    <p className="text-gray-600">
                      펌웨어의 메인 진입점입니다. 여기서{" "}
                      <strong>읽기 계속</strong>, <strong>파일 탐색기</strong>,{" "}
                      <strong>파일 전송</strong>, <strong>설정</strong> 화면으로
                      이동할 수 있습니다.
                    </p>
                  </div>

                  <div id="file-explorer" className="scroll-mt-24">
                    <SectionLink
                      id="file-explorer"
                      className="text-xl font-semibold text-gray-800 mb-2"
                    >
                      3.2 파일 탐색기
                    </SectionLink>
                    <p className="text-gray-600 mb-2">
                      파일 탐색기는 두 개의 탭으로 구성되어 있습니다:
                    </p>

                    <h4 className="text-lg font-medium text-gray-700 mt-3 mb-2">
                      Recent (최근 읽기)
                    </h4>
                    <p className="text-gray-600 mb-2">
                      최근에 열었던 책 목록을 표시합니다. 빠르게 이전에 읽던 책으로
                      돌아갈 수 있습니다.
                    </p>

                    <h4 className="text-lg font-medium text-gray-700 mt-3 mb-2">
                      Files (파일 브라우저)
                    </h4>
                    <p className="text-gray-600 mb-2">
                      SD 카드의 폴더 및 파일을 탐색합니다.
                    </p>

                    <p className="text-gray-600 mt-3 mb-2">
                      <strong>조작 방법:</strong>
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>
                        <strong>탭 전환:</strong> 좌/우 버튼으로 Recent와 Files 탭 간 이동
                      </li>
                      <li>
                        <strong>목록 탐색:</strong> 위/아래 (또는 볼륨
                        업/다운) 버튼으로 이동. 길게 누르면 페이지 단위로 스크롤
                      </li>
                      <li>
                        <strong>선택 열기:</strong> 확인 버튼으로 폴더 열기 또는
                        책 읽기
                      </li>
                      <li>
                        <strong>파일 삭제:</strong> 확인 버튼을 길게 눌렀다 떼면
                        삭제 확인 대화상자가 표시됩니다. (폴더 삭제는 지원되지
                        않습니다)
                      </li>
                      <li>
                        <strong>다중 선택 삭제:</strong> 여러 파일을 한 번에
                        선택해 삭제할 수 있습니다. (v1.2.0 이상)
                      </li>
                      <li>
                        <strong>전체 경로 표시:</strong> 상단에 현재 폴더의 전체
                        경로가 표시되어 깊은 폴더에서도 위치를 쉽게 확인할 수
                        있습니다.
                      </li>
                      <li>
                        <strong>파일 확장자 표시:</strong> 파일 이름과 확장자가
                        함께 표시되며 폴더는{" "}
                        <code className="bg-gray-100 px-1 rounded">[dir]</code>{" "}
                        접두어로 강조됩니다.
                      </li>
                      <li>
                        <strong>숨김 파일/폴더:</strong> 설정에서 활성화하면{" "}
                        <code className="bg-gray-100 px-1 rounded">.</code>{" "}
                        접두어가 붙은 항목들도 함께 표시됩니다.
                      </li>
                      <li>
                        <strong>BMP 이미지 뷰어:</strong> 파일 브라우저에서{" "}
                        <code className="bg-gray-100 px-1 rounded">.bmp</code>{" "}
                        파일을 선택하면 이미지 뷰어로 바로 열 수 있습니다.
                      </li>
                    </ul>
                  </div>

                  <div id="reading-screen" className="scroll-mt-24">
                    <SectionLink
                      id="reading-screen"
                      className="text-xl font-semibold text-gray-800 mb-2"
                    >
                      3.3 읽기 화면
                    </SectionLink>
                    <p className="text-gray-600">
                      자세한 내용은 아래{" "}
                      <Link
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
                        읽기 모드
                      </Link>{" "}
                      섹션을 참조하세요.
                    </p>
                  </div>

                  <div id="file-upload" className="scroll-mt-24">
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

                  <div id="calibre-wireless" className="scroll-mt-24">
                    <SectionLink
                      id="calibre-wireless"
                      className="text-xl font-semibold text-gray-800 mb-2"
                    >
                      3.4.1 Calibre 무선 전송
                    </SectionLink>
                    <p className="text-gray-600 mb-4">
                      CrossPoint는 Calibre 디바이스 플러그인을 사용한 무선 전송을
                      지원합니다.
                    </p>
                    <ol className="list-decimal list-inside text-gray-600 space-y-2">
                      <li>
                        Calibre에 플러그인 설치:{" "}
                        <a
                          href="https://github.com/crosspoint-reader-ko/calibre-plugins/releases"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          https://github.com/crosspoint-reader-ko/calibre-plugins/releases
                        </a>{" "}
                        에서 최신 crosspoint_reader 플러그인 zip 파일을 다운로드한
                        후, Calibre &rarr; 환경 설정 &rarr; 플러그인 &rarr;
                        파일에서 플러그인 불러오기 &rarr; zip 파일 선택
                      </li>
                      <li>
                        기기에서: 파일 전송 &rarr; Calibre 연결 &rarr; 네트워크
                        참가
                      </li>
                      <li>
                        컴퓨터와 기기가 같은 WiFi 네트워크에 있는지 확인
                      </li>
                      <li>
                        Calibre에서 &quot;기기로 보내기&quot;를 클릭하여 전송
                      </li>
                    </ol>
                  </div>

                  <div id="settings" className="scroll-mt-24">
                    <SectionLink
                      id="settings"
                      className="text-xl font-semibold text-gray-800 mb-2"
                    >
                      3.5 설정
                    </SectionLink>
                    <p className="text-gray-600 mb-4">
                      기기 동작을 설정할 수 있습니다. 설정은 4개 카테고리로
                      구분되어 있습니다:
                    </p>

                    <p className="text-gray-600 mb-4">
                      v1.2.0 부터 설정 화면은{" "}
                      <strong>화면 / 리더 / 조작 / 시스템</strong> 4개 탭으로
                      재구성되었습니다. 좌/우 버튼으로 탭을 전환하고, 위/아래로
                      항목을 선택할 수 있습니다. (원문 카테고리: Display /
                      Reader / Controls / System)
                    </p>

                    <h4 className="text-lg font-medium text-gray-700 mt-4 mb-2">
                      3.5.1 화면 (Display)
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                      <li>
                        <strong>절전 화면 이미지:</strong> 다크(기본값), 라이트,
                        사용자 정의, 커버, 커버 + 사용자 정의, 없음 중 선택.{" "}
                        <em>커버 + 사용자 정의</em>는 현재 책을 읽는 중에만 커버를
                        표시하고 그 외에는 사용자 정의 이미지로 대체합니다. (v1.2.0)
                      </li>
                      <li>
                        <strong>절전 화면 커버 모드:</strong> 맞춤(Fit) / 자르기(Crop)
                      </li>
                      <li>
                        <strong>절전 화면 커버 필터:</strong> 없음(그레이스케일) /
                        대비(흑백) / 반전 중 선택
                      </li>
                      <li>
                        <strong>상태 바:</strong> 없음, 진행 없음, 전체 + 퍼센트,
                        전체 + 도서 바, 도서 바만, 전체 + 챕터 바 중 선택
                        (&ldquo;상태 표시줄 설정&rdquo; 항목에서도 세부
                        구성 가능)
                      </li>
                      <li>
                        <strong>배터리 % 숨기기:</strong> 안 함(기본값), 리더에서,
                        항상 중 선택. 배터리 아이콘은 항상 표시됩니다.
                      </li>
                      <li>
                        <strong>부드러운 배터리 표시 (Smooth Battery):</strong>{" "}
                        X4에서 배터리 잔량이 기존 5% 단위가 아닌 1% 단위로 표시되어
                        더 정확한 잔량 확인이 가능합니다. (v1.2.0)
                      </li>
                      <li>
                        <strong>충전 인디케이터:</strong> 충전 중일 때 상태
                        바의 배터리 아이콘에 번개 모양이 표시됩니다. (Classic /
                        Lyra 테마 모두 지원)
                      </li>
                      <li>
                        <strong>새로고침 빈도:</strong> 고스팅 감소를 위한 전체
                        새로고침 주기 설정 (1, 5, 10, 15, 30 페이지)
                      </li>
                      <li>
                        <strong>UI 테마:</strong> 클래식(Classic), Lyra, Lyra
                        확장(Lyra Extended) 중 선택. Lyra 확장은 홈 화면에서 책을
                        1권 대신 3권까지 표시합니다.
                      </li>
                      <li>
                        <strong>이미지 표시 (Image Display):</strong> EPUB 본문의
                        이미지를 렌더링할지 여부 선택. 렌더링 비활성화 시 페이지
                        넘기기가 빨라집니다. (v1.2.0)
                      </li>
                      <li>
                        <strong>햇빛 번짐 보정:</strong> 흰색 X4 모델의 직사광선
                        번짐 문제 소프트웨어 보정 OFF/ON 선택
                      </li>
                    </ul>

                    <h4 className="text-lg font-medium text-gray-700 mt-4 mb-2">
                      3.5.2 리더 (Reader)
                    </h4>
                    <p className="text-gray-500 text-xs mb-2">
                      펌웨어 UI 레이블 기준: &ldquo;리더 줄 간격&rdquo;,
                      &ldquo;리더 화면 여백&rdquo;, &ldquo;리더 단락 정렬&rdquo;,
                      &ldquo;추가 단락 간격&rdquo;, &ldquo;단락 들여쓰기&rdquo;,
                      &ldquo;글자 단위 줄바꿈&rdquo;, &ldquo;텍스트
                      안티앨리어싱&rdquo; 등
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                      <li>
                        <strong>글꼴 설정:</strong> EPUB/TXT 리더에서 사용할
                        커스텀 폰트 선택 (자세한 내용은{" "}
                        <Link
                          href="#custom-font"
                          className="text-blue-600 hover:text-blue-800"
                          onClick={(e) => {
                            e.preventDefault();
                            document
                              .getElementById("custom-font")
                              ?.scrollIntoView({ behavior: "smooth" });
                            window.history.pushState(null, "", "#custom-font");
                          }}
                        >
                          커스텀 폰트
                        </Link>{" "}
                        섹션 참조)
                      </li>
                      <li>
                        <strong>UI 글꼴 크기:</strong> 작게, 보통(기본값), 크게,
                        아주 크게
                      </li>
                      <li>
                        <strong>리더 줄 간격:</strong> 좁게, 보통, 넓게 중 선택
                      </li>
                      <li>
                        <strong>리더 화면 여백:</strong> 5–40 픽셀 사이에서 5픽셀
                        단위로 조정
                      </li>
                      <li>
                        <strong>리더 단락 정렬:</strong> 양쪽 정렬(기본값),
                        왼쪽, 가운데, 오른쪽, 책 스타일 중 선택
                      </li>
                      <li>
                        <strong>내장 스타일:</strong> 책에 포함된 CSS 스타일
                        적용 ON/OFF 선택
                      </li>
                      <li>
                        <strong>하이픈 처리:</strong> 영어 등 단어 하이픈
                        분리 ON/OFF 선택. v1.2.0에서는 ISO 639-2 언어 코드를
                        사용하는 EPUB에 대해서도 하이픈 처리가 개선되었습니다.
                      </li>
                      <li>
                        <strong>읽기 방향:</strong> 세로 (기본값), 가로
                        시계방향, 반전, 가로 반시계방향 중 선택. v1.2.0에서는
                        리더 내부 팝업도 현재 방향에 맞춰 표시됩니다.
                      </li>
                      <li>
                        <strong>추가 단락 간격:</strong> 켜면 단락 사이에 공백
                        추가
                      </li>
                      <li>
                        <strong>단락 들여쓰기:</strong> 단락 첫 줄 들여쓰기
                        ON/OFF 선택 (추가 단락 간격과 독립적으로 설정 가능)
                      </li>
                      <li>
                        <strong>글자 단위 줄바꿈:</strong> 단어 단위가 아닌 글자
                        단위로 줄바꿈 (양쪽 정렬 시 단어 간격 균등 유지)
                      </li>
                      <li>
                        <strong>텍스트 안티앨리어싱:</strong> 텍스트에 부드러운
                        회색 가장자리 적용. 페이지 넘김이 약간 느려질 수 있습니다.
                      </li>
                      <li>
                        <strong>자동 페이지 넘김 (Auto Page Turn):</strong> 지정한
                        시간마다 자동으로 다음 페이지로 넘어갑니다. (v1.2.0)
                      </li>
                      <li>
                        <strong>끝 페이지 탐색 (End of Book):</strong> 책의 마지막
                        페이지에서 다음 페이지 버튼을 누르면 홈으로 돌아갈지,
                        그대로 유지할지 선택합니다. (v1.2.0)
                      </li>
                      <li>
                        <strong>각주 인라인 탐색 (Footnote Navigation):</strong>{" "}
                        본문 내 각주 링크를 따라가거나 돌아올 수 있으며, 슬림
                        각주(slim footnote) 표시 모드를 지원합니다. (v1.2.0)
                      </li>
                    </ul>

                    <h4 className="text-lg font-medium text-gray-700 mt-4 mb-2">
                      3.5.3 조작 (Controls)
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                      <li>
                        <strong>전면 버튼 재설정:</strong> 전면 4개 버튼의 기능을
                        자유롭게 재설정 (뒤로, 확인, 좌, 우 중 선택)
                      </li>
                      <li>
                        <strong>측면 버튼 배치 (리더):</strong> 볼륨 버튼의
                        이전/다음(기본값)/다음/이전 순서 변경 (읽기 시에만 적용)
                      </li>
                      <li>
                        <strong>길게 눌러 챕터 건너뛰기:</strong>{" "}
                        챕터 건너뛰기(기본값), 페이지 스크롤 중 선택
                      </li>
                      <li>
                        <strong>전원 버튼 짧게 누르기:</strong> 무시(기본값), 절전,
                        페이지 넘기기, <strong>화면 수동 새로고침(Manual Refresh)</strong>{" "}
                        중 선택. 수동 새로고침을 선택하면 짧은 전원 버튼 클릭으로
                        화면의 잔상(ghosting)을 즉시 제거할 수 있습니다. (v1.2.0)
                      </li>
                    </ul>

                    <h4 className="text-lg font-medium text-gray-700 mt-4 mb-2">
                      3.5.4 시스템 (System)
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>
                        <strong>절전 시간:</strong> 비활성 상태 후 자동 슬립까지
                        시간 설정 (1분, 5분, 10분(기본값), 15분, 30분)
                      </li>
                      <li>
                        <strong>Wi-Fi 네트워크:</strong> Wi-Fi 네트워크 선택 및
                        연결 관리
                      </li>
                      <li>
                        <strong>KOReader 동기화:</strong> KOReader 서버와의
                        읽기 위치 동기화 설정.{" "}
                        <Link
                          href="#koreader-sync"
                          className="text-blue-600 hover:text-blue-800"
                          onClick={(e) => {
                            e.preventDefault();
                            document
                              .getElementById("koreader-sync")
                              ?.scrollIntoView({ behavior: "smooth" });
                            window.history.pushState(null, "", "#koreader-sync");
                          }}
                        >
                          빠른 설정 가이드
                        </Link>
                        를 참고하세요.
                      </li>
                      <li>
                        <strong>OPDS 브라우저:</strong> OPDS 카탈로그를 통한
                        전자책 다운로드 (HTTP Basic 인증 지원). v1.2.0부터{" "}
                        <strong>검색 기능</strong>과{" "}
                        <strong>다음/이전 페이지 탐색</strong>을 지원합니다.
                      </li>
                      <li>
                        <strong>숨김 파일 표시:</strong> 파일 브라우저에서{" "}
                        <code className="bg-gray-100 px-1 rounded">.</code>{" "}
                        으로 시작하는 숨김 파일/폴더를 표시할지 선택 (v1.2.0)
                      </li>
                      <li>
                        <strong>읽기 캐시 삭제:</strong> 렌더링 캐시 및 임시
                        파일 삭제 (설정 및 읽기 위치는 유지됨)
                      </li>
                      <li>
                        <strong>업데이트 확인:</strong> WiFi를 통해 Crosspoint
                        펌웨어 업데이트 확인 (한국어 펌웨어는{" "}
                        <code className="bg-gray-100 px-1 rounded">
                          crosspoint-reader-ko
                        </code>{" "}
                        릴리즈를 바라봅니다)
                      </li>
                      <li>
                        <strong>언어:</strong> UI 언어 선택. v1.2.0 기준으로
                        한국어 포함 20여 개 언어가 정렬된 순서로 제공되며,
                        테마에 맞춰 표시됩니다. (새로 추가: 헝가리어, 슬로베니아어,
                        리투아니아어, 카자흐어, 벨라루스어, 핀란드어, 이탈리아어,
                        덴마크어, 네덜란드어, 폴란드어/우크라이나어 개선 등)
                      </li>
                      <li>
                        <strong>설정 저장 형식:</strong> v1.2.0 부터 설정은 기존
                        바이너리 파일 대신{" "}
                        <code className="bg-gray-100 px-1 rounded">.json</code>{" "}
                        으로 저장되어 손쉽게 백업/복원이 가능합니다. 한국어
                        전용{" "}
                        <code className="bg-gray-100 px-1 rounded">
                          customFontPath
                        </code>
                        ,{" "}
                        <code className="bg-gray-100 px-1 rounded">
                          characterWrap
                        </code>
                        ,{" "}
                        <code className="bg-gray-100 px-1 rounded">
                          paragraphIndent
                        </code>{" "}
                        값도 JSON 설정에 포함됩니다. (v1.1.1-ko.1+)
                      </li>
                    </ul>
                  </div>

                  <div id="koreader-sync" className="scroll-mt-24">
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

                  <div id="sleep-screen" className="scroll-mt-24">
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
                          href="#settings"
                          className="text-blue-600 hover:text-blue-800"
                          onClick={(e) => {
                            e.preventDefault();
                            document
                              .getElementById("settings")
                              ?.scrollIntoView({ behavior: "smooth" });
                            window.history.pushState(null, "", "#settings");
                          }}
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

                  <div id="custom-font" className="scroll-mt-24">
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
                          href="#settings"
                          className="text-blue-600 hover:text-blue-800"
                          onClick={(e) => {
                            e.preventDefault();
                            document
                              .getElementById("settings")
                              ?.scrollIntoView({ behavior: "smooth" });
                            window.history.pushState(null, "", "#settings");
                          }}
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

                  <div id="screenshot" className="scroll-mt-24">
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

              {/* Reading Mode */}
              <div
                id="reading"
                className="rounded-2xl border border-gray-200 bg-white p-8 mb-8 scroll-mt-24"
              >
                <SectionLink
                  id="reading"
                  className="text-2xl font-bold text-gray-900 mb-6"
                >
                  4. 읽기 모드
                </SectionLink>

                <p className="text-gray-600 mb-6">
                  책을 열면 버튼 배치가 읽기에 맞게 변경됩니다.
                </p>

                <h3
                  id="page-turning"
                  className="text-xl font-semibold text-gray-800 mb-4 scroll-mt-24"
                >
                  페이지 넘기기
                </h3>
                <div className="overflow-x-auto mb-6">
                  <table className="min-w-full border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">
                          동작
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">
                          버튼
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700 border-b">
                          <strong>이전 페이지</strong>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 border-b">
                          왼쪽 <em>또는</em> 이전
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          <strong>다음 페이지</strong>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          오른쪽 <em>또는</em> 다음
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-gray-600 text-sm mt-2">
                  측면 (볼륨) 버튼의 역할은{" "}
                  <Link
                    href="#settings"
                    className="text-blue-600 hover:text-blue-800"
                    onClick={(e) => {
                      e.preventDefault();
                      document
                        .getElementById("settings")
                        ?.scrollIntoView({ behavior: "smooth" });
                      window.history.pushState(null, "", "#settings");
                    }}
                  >
                    설정
                  </Link>
                  에서 바꿀 수 있습니다.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <p className="text-blue-800 text-sm">
                    <strong>팁:</strong>{" "}
                    <Link
                      href="#settings"
                      className="text-blue-600 hover:text-blue-800"
                      onClick={(e) => {
                        e.preventDefault();
                        document
                          .getElementById("settings")
                          ?.scrollIntoView({ behavior: "smooth" });
                        window.history.pushState(null, "", "#settings");
                      }}
                    >
                      설정
                    </Link>{" "}
                    &gt; <strong>전원 버튼 짧게 누르기</strong>를{" "}
                    <strong>페이지 넘기기</strong>로 설정하면 전원 버튼으로도
                    페이지를 넘길 수 있습니다.
                  </p>
                </div>

                <h3
                  id="chapter-nav"
                  className="text-xl font-semibold text-gray-800 mb-4 mt-6 scroll-mt-24"
                >
                  챕터 탐색
                </h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
                  <li>
                    <strong>다음 챕터:</strong> 오른쪽 (또는 다음) 버튼을{" "}
                    <strong>길게 누른 후</strong> 놓기
                  </li>
                  <li>
                    <strong>이전 챕터:</strong> 왼쪽 (또는 이전) 버튼을{" "}
                    <strong>길게 누른 후</strong> 놓기
                  </li>
                </ul>

                <h3
                  id="system-nav"
                  className="text-xl font-semibold text-gray-800 mb-4 scroll-mt-24"
                >
                  시스템 탐색
                </h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>
                    <strong>파일 탐색기로 돌아가기:</strong> 뒤로 버튼을 눌러 책을
                    닫고 파일 탐색기 화면으로 이동
                  </li>
                  <li>
                    <strong>홈으로 돌아가기:</strong> 뒤로 버튼을{" "}
                    <strong>길게 눌러</strong> 책을 닫고 홈 화면으로 이동
                  </li>
                  <li>
                    <strong>챕터 메뉴:</strong> 확인 버튼을 눌러{" "}
                    <Link
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
                      목차/챕터 선택 화면
                    </Link>{" "}
                    열기
                  </li>
                </ul>

                <h3
                  id="supported-languages"
                  className="text-xl font-semibold text-gray-800 mb-4 mt-6 scroll-mt-24"
                >
                  지원 언어
                </h3>
                <p className="text-gray-600 mb-4">
                  CrossPoint는 다음 유니코드 문자 블록을 사용하여 텍스트를
                  렌더링합니다:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                  <li>
                    <strong>라틴 문자 (기본, 보충, 확장-A):</strong> 영어,
                    독일어, 프랑스어, 스페인어, 포르투갈어, 이탈리아어,
                    네덜란드어, 스웨덴어, 노르웨이어, 덴마크어, 핀란드어,
                    폴란드어, 체코어, 헝가리어, 루마니아어, 슬로바키아어,
                    슬로베니아어, 리투아니아어, 터키어, 카탈루냐어 등
                  </li>
                  <li>
                    <strong>키릴 문자 (표준 및 확장):</strong> 러시아어,
                    우크라이나어, 벨라루스어, 불가리아어, 세르비아어,
                    마케도니아어, 카자흐어, 키르기스어, 몽골어 등
                  </li>
                  <li>
                    <strong>한국어:</strong> 한국어 펌웨어에서 완전 지원 (커스텀
                    폰트 포함)
                  </li>
                </ul>
                <p className="text-gray-600 mb-4 text-sm">
                  v1.2.0에서는 헝가리어, 슬로베니아어, 리투아니아어, 카자흐어,
                  벨라루스어 번역이 새로 추가되었고, 언어 선택 화면이 알파벳
                  순서로 정렬되며 현재 테마 스타일에 맞게 표시됩니다. 러시아어·
                  우크라이나어·스페인어·스웨덴어·네덜란드어·폴란드어·독일어·프랑스어·
                  이탈리아어·카탈루냐어·터키어·덴마크어·핀란드어 등 기존 번역도
                  크게 개선되었습니다.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-sm">
                    <strong>미지원:</strong> 중국어, 일본어, 베트남어, 히브리어,
                    아랍어, 그리스어, 페르시아어
                  </p>
                </div>

                <h3
                  id="epub-images"
                  className="text-xl font-semibold text-gray-800 mb-4 mt-6 scroll-mt-24"
                >
                  EPUB 이미지 지원
                </h3>
                <p className="text-gray-600 mb-4">
                  EPUB 파일에 포함된 JPG 및 PNG 이미지를 렌더링합니다.
                  이미지는 자동으로 화면 크기에 맞게 조정되며, 이미지 표시를
                  원하지 않을 경우 <strong>설정 → 화면 → 이미지 표시</strong>
                  를 끌 수 있습니다.
                </p>
                <p className="text-gray-600 mb-4">
                  v1.2.0에서는 커버 이미지 변환이 <strong>JPEGDEC</strong>{" "}
                  라이브러리로 교체되어 성능이 크게 향상되었고, 픽셀 단위 이미지
                  렌더링 오버헤드가 제거되어 이미지가 많은 책의 페이지 넘김이
                  빨라졌습니다. 큰 EPUB 파일 업로드 제한도 완화되었습니다.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-sm">
                    <strong>참고:</strong> 커버 이미지 등 큰 이미지는 여전히
                    변환에 시간이 걸릴 수 있습니다. GIF, SVG, WebP 등의 형식은
                    아직 지원되지 않습니다. 대용량 커버 EPUB은{" "}
                    <a
                      href="https://github.com/bigbag/epub-to-xtc-converter"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      EPUB to XTC Converter
                    </a>
                    로 미리 최적화하면 더 빠릅니다.
                  </p>
                </div>
              </div>

              {/* Chapter Selection */}
              <div
                id="chapter"
                className="rounded-2xl border border-gray-200 bg-white p-8 mb-8 scroll-mt-24"
              >
                <SectionLink
                  id="chapter"
                  className="text-2xl font-bold text-gray-900 mb-6"
                >
                  5. 챕터 선택 화면
                </SectionLink>

                <p className="text-gray-600 mb-4">
                  책 안에서 <strong>확인</strong> 버튼을 누르면 접근할 수
                  있습니다.
                </p>

                <ol className="list-decimal list-inside text-gray-600 space-y-2">
                  <li>위/아래 (또는 볼륨 업/다운)으로 원하는 챕터 선택</li>
                  <li>
                    <strong>확인</strong>을 눌러 해당 챕터로 이동
                  </li>
                  <li>
                    <em>
                      또는 <strong>뒤로</strong>를 눌러 취소하고 현재 페이지로
                      돌아가기
                    </em>
                  </li>
                </ol>

                <h4 className="text-lg font-medium text-gray-700 mt-6 mb-2">
                  KOReader 동기화
                </h4>
                <p className="text-gray-600 mb-2">
                  설정에서 KOReader 동기화가 활성화된 경우, 챕터 선택 화면에
                  추가 옵션이 표시됩니다:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>
                    <strong>Sync Progress:</strong> KOReader 서버에서 동기화된
                    읽기 위치로 이동
                  </li>
                  <li>
                    동기화된 챕터 이름이 함께 표시되어 다른 기기에서 읽던
                    위치를 쉽게 확인할 수 있습니다
                  </li>
                </ul>
              </div>

              {/* Limitations */}
              <div
                id="limitations"
                className="rounded-2xl border border-yellow-200 bg-yellow-50 p-8 scroll-mt-24"
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

              {/* Troubleshooting */}
              <div
                id="troubleshooting"
                className="rounded-2xl border border-gray-200 bg-white p-8 mb-8 scroll-mt-24"
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
                    표시되며, 크래시 로그가 SD 카드의{" "}
                    <code className="bg-green-100 px-1 rounded">
                      /.crosspoint/crash/
                    </code>{" "}
                    아래에 자동 저장됩니다. 이슈 제보 시 해당 로그를 첨부해
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
