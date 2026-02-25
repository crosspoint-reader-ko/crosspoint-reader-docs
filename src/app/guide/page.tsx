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
                        업/다운) 버튼으로 이동
                      </li>
                      <li>
                        <strong>선택 열기:</strong> 확인 버튼으로 폴더 열기 또는
                        책 읽기
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
                      3.4 파일 업로드 화면
                    </SectionLink>
                    <p className="text-gray-600 mb-2">
                      새 전자책을 기기에 업로드할 수 있습니다. 화면에 들어가면
                      WiFi 선택 대화상자가 표시되고, X4가 웹 서버를 호스팅하기
                      시작합니다.
                    </p>
                    <p className="text-gray-600">
                      웹 브라우저 업로드 외에도 <strong>WebDAV</strong> 프로토콜을
                      지원하여 파일 관리자에서 직접 파일을 전송할 수 있습니다.
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
                          href="https://github.com/crosspoint-reader/calibre-plugins/releases"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          https://github.com/crosspoint-reader/calibre-plugins/releases
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

                    <h4 className="text-lg font-medium text-gray-700 mt-4 mb-2">
                      디스플레이
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                      <li>
                        <strong>절전 화면 이미지:</strong> 다크(기본값), 라이트,
                        사용자 정의, 커버, 없음, 커버 + 사용자 정의 중 선택
                      </li>
                      <li>
                        <strong>절전 화면 커버 모드:</strong> 맞춤, 자르기 중
                        선택
                      </li>
                      <li>
                        <strong>절전 화면 커버 필터:</strong> 없음, 대비, 반전 중
                        선택
                      </li>
                      <li>
                        <strong>상태 표시줄:</strong> 없음, 진행 없음, 전체 w/ %,
                        전체 w/ 책 진행바, 책 진행바만, 전체 w/ 챕터 바 중 선택
                      </li>
                      <li>
                        <strong>배터리 % 숨기기:</strong> 안 함, 리더에서, 항상
                        중 선택
                      </li>
                      <li>
                        <strong>새로고침 주기:</strong> 고스팅 감소를 위한 전체
                        새로고침 주기 설정 (1, 5, 10, 15, 30 페이지)
                      </li>
                      <li>
                        <strong>UI 테마:</strong> 클래식, Lyra, Lyra 확장 중 선택
                      </li>
                      <li>
                        <strong>햇빛 번짐 보정:</strong> 흰색 X4 모델의 직사광선
                        번짐 문제 소프트웨어 보정 OFF/ON 선택
                      </li>
                    </ul>

                    <h4 className="text-lg font-medium text-gray-700 mt-4 mb-2">
                      리더
                    </h4>
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
                        <strong>줄 간격:</strong> 좁게, 보통, 넓게 중 선택
                      </li>
                      <li>
                        <strong>화면 여백:</strong> 5, 10, 15,...,40 중 선택
                      </li>
                      <li>
                        <strong>문단 정렬:</strong> 양쪽 정렬(기본값), 왼쪽,
                        가운데, 오른쪽, 책 스타일 중 선택
                      </li>
                      <li>
                        <strong>내장 스타일:</strong> 책에 포함된 CSS 스타일
                        적용 ON/OFF 선택
                      </li>
                      <li>
                        <strong>하이픈 처리:</strong> 영어 등 단어 하이픈
                        분리 ON/OFF 선택
                      </li>
                      <li>
                        <strong>읽기 방향:</strong> 세로 (기본값), 가로
                        시계방향, 반전, 가로 반시계방향 중 선택
                      </li>
                      <li>
                        <strong>문단 간격 추가:</strong> 켜면 단락 사이에 공백
                        추가
                      </li>
                      <li>
                        <strong>첫 줄 들여쓰기:</strong> 문단 첫 줄 들여쓰기
                        ON/OFF 선택 (문단 간격과 독립적으로 설정 가능)
                      </li>
                      <li>
                        <strong>문자 단위 줄바꿈:</strong> 단어 단위가 아닌 글자
                        단위로 줄바꿈 (양쪽 정렬 시 단어 간격 균등 유지)
                      </li>
                      <li>
                        <strong>텍스트 안티앨리어싱:</strong> ON/OFF 선택
                      </li>
                    </ul>

                    <h4 className="text-lg font-medium text-gray-700 mt-4 mb-2">
                      컨트롤
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                      <li>
                        <strong>앞면 버튼 매핑:</strong> 앞면 4개 버튼의 기능을
                        자유롭게 재설정 (뒤로, 확인, 이전, 다음 중 선택)
                      </li>
                      <li>
                        <strong>측면 버튼 레이아웃 (리더기):</strong> 볼륨 버튼의
                        이전/다음 순서 변경 (읽기 시에만 적용)
                      </li>
                      <li>
                        <strong>길게 누르면 챕터 건너뛰기:</strong>{" "}
                        챕터 건너뛰기(기본값), 페이지 스크롤 중 선택
                      </li>
                      <li>
                        <strong>전원 버튼 짧게 누르기:</strong> 무시, 절전,
                        페이지 넘기기 선택
                      </li>
                    </ul>

                    <h4 className="text-lg font-medium text-gray-700 mt-4 mb-2">
                      시스템
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>
                        <strong>절전 시간:</strong> 비활성 상태 후 자동 슬립까지
                        시간 설정 (1분, 5분, 10분, 15분, 30분)
                      </li>
                      <li>
                        <strong>KOReader 동기화:</strong> KOReader 서버와의
                        읽기 위치 동기화 설정
                      </li>
                      <li>
                        <strong>WiFi 네트워크:</strong> WiFi 네트워크 선택 및
                        연결 관리
                      </li>
                      <li>
                        <strong>OPDS 브라우저:</strong> OPDS 카탈로그를 통한
                        전자책 다운로드 (HTTP Basic 인증 지원)
                      </li>
                      <li>
                        <strong>캐시 지우기:</strong> 렌더링 캐시 및 임시 파일
                        삭제
                      </li>
                      <li>
                        <strong>업데이트 확인:</strong> WiFi를 통해 펌웨어
                        업데이트 확인
                      </li>
                      <li>
                        <strong>언어:</strong> UI 언어 선택 (한국어 포함 12개
                        언어 지원)
                      </li>
                    </ul>
                  </div>

                  <div id="sleep-screen" className="scroll-mt-24">
                    <SectionLink
                      id="sleep-screen"
                      className="text-xl font-semibold text-gray-800 mb-2"
                    >
                      3.6 절전 화면 커스터마이징
                    </SectionLink>
                    <p className="text-gray-600 mb-2">
                      SD 카드에 커스텀 이미지를 배치하여 절전 화면을 변경할 수
                      있습니다:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>
                        <strong>단일 이미지:</strong> 루트 디렉토리에{" "}
                        <code className="bg-gray-100 px-1 rounded">
                          sleep.bmp
                        </code>{" "}
                        파일 배치
                      </li>
                      <li>
                        <strong>여러 이미지:</strong> 루트에{" "}
                        <code className="bg-gray-100 px-1 rounded">sleep</code>{" "}
                        폴더를 만들고{" "}
                        <code className="bg-gray-100 px-1 rounded">.bmp</code>{" "}
                        이미지 배치. 이 폴더에 이미지가 있으면{" "}
                        <code className="bg-gray-100 px-1 rounded">
                          sleep.bmp
                        </code>{" "}
                        파일보다 우선하며, 절전 시마다 무작위로 하나가
                        선택됩니다.
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
                    슬로베니아어, 터키어 등
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
                  이미지는 자동으로 화면 크기에 맞게 조정됩니다.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-sm">
                    <strong>참고:</strong> 커버 이미지 등 큰 이미지는 변환에
                    약 10초가 소요될 수 있습니다. GIF, SVG, WebP 등의 형식은
                    아직 지원되지 않습니다.
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
                      href="https://github.com/crosspoint-reader/crosspoint-reader/discussions/549"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      자동 페이지 넘김
                    </a>
                  </li>
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

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
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
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
