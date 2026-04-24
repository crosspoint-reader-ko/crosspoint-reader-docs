"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { GuideNav } from "@/components/guide-nav";
import Image from "next/image";
import { getAssetPath } from "@/lib/basePath";
import { useEffect, useState } from "react";
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
  { id: "whats-new", title: "v1.2.0 변경사항" },
  { id: "hardware", title: "하드웨어" },
  { id: "power", title: "전원·시작" },
  { id: "screens", title: "화면 구성" },
  { id: "reading", title: "읽기 모드" },
  { id: "chapter", title: "챕터 탐색" },
];

export default function GuidePage() {
  const [deviceTab, setDeviceTab] = useState<"x3" | "x4">("x4");

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
            <h1 className="text-4xl font-bold text-gray-900">사용자 가이드 — 기본 사용</h1>
            <p className="mt-4 text-lg text-gray-600">
              CrossPoint Reader 한국어 버전의 기본 사용 방법입니다.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              현재 문서 버전: <strong>v1.2.0-ko.0</strong>
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

        {/* What's New */}
        <section className="py-10 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div
              id="whats-new"
              className="rounded-2xl border border-blue-200 bg-blue-50 p-6 scroll-mt-36"
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
                <div className="sm:col-span-2">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    X3 전용 (v1.2.0-ko.12)
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      <strong>기울여 페이지 넘기기:</strong> QMI8658 자이로
                      센서로 좌/우 기울임을 감지해 페이지 이동 (방향 반전 가능)
                    </li>
                    <li>
                      <strong>상태 바 시계:</strong> DS3231 RTC + NTP 자동
                      동기화, UTC 오프셋 지정 가능
                    </li>
                    <li>
                      X3/X4 공용 펌웨어로, 하드웨어 유무에 따라 해당 설정
                      항목이 자동으로 노출/숨김
                    </li>
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
                className="rounded-2xl border border-gray-200 bg-white p-8 mb-8 scroll-mt-36"
              >
                <SectionLink
                  id="hardware"
                  className="text-2xl font-bold text-gray-900 mb-4"
                >
                  1. 하드웨어 개요
                </SectionLink>
                <p className="text-gray-600 mb-6">
                  한국어 펌웨어는 <strong>Xteink X3</strong>와{" "}
                  <strong>Xteink X4</strong> 두 모델을 지원합니다. 아래 탭에서
                  사용 중인 모델을 선택해 폼팩터와 버튼 배치를 확인하세요.
                </p>

                {/* Device tab switcher */}
                <div
                  role="tablist"
                  aria-label="기기 선택"
                  className="mb-6 inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1"
                >
                  {(
                    [
                      { id: "x4", label: "Xteink X4" },
                      { id: "x3", label: "Xteink X3" },
                    ] as const
                  ).map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      role="tab"
                      aria-selected={deviceTab === t.id}
                      onClick={() => setDeviceTab(t.id)}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        deviceTab === t.id
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                <div className="mb-8">
                  <Image
                    src={getAssetPath(
                      deviceTab === "x3"
                        ? "/x3-device-overview.svg"
                        : "/x4-device-overview.svg",
                    )}
                    alt={
                      deviceTab === "x3"
                        ? "Xteink X3 폼팩터 및 버튼 배치"
                        : "Xteink X4 폼팩터 및 버튼 배치"
                    }
                    width={800}
                    height={deviceTab === "x3" ? 422 : 422}
                    className="w-full h-auto rounded-lg bg-white"
                    unoptimized
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    이미지 출처: Xteink {deviceTab === "x3" ? "X3" : "X4"} 공식
                    사용 설명서
                  </p>
                </div>

                {deviceTab === "x3" ? (
                  <div className="grid sm:grid-cols-2 gap-4 mb-8 text-sm">
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        제품 사양
                      </h4>
                      <ul className="text-gray-700 space-y-1">
                        <li>화면: 3.7&quot; E-Ink (250+ PPI)</li>
                        <li>크기: 98 × 64 × 5 mm (약 3.85&quot; × 2.52&quot; × 0.20&quot;)</li>
                        <li>무게: 56 g</li>
                        <li>배터리: 650 mAh</li>
                        <li>저장 공간: 16 GB (MicroSD, 최대 512 GB 확장)</li>
                        <li>NFC: 지원</li>
                        <li>충전: 마그네틱 포고 핀 (전용 케이블 동봉)</li>
                      </ul>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        X3 전용 센서
                      </h4>
                      <ul className="text-gray-700 space-y-1">
                        <li>QMI8658 6축 IMU (자이로/가속도 — 기울여 페이지 넘기기)</li>
                        <li>DS3231 RTC + NTP 동기화 (상태 바 시계)</li>
                        <li>뒷면 자성 부착부 + NFC 감지 영역</li>
                      </ul>
                      <p className="text-xs text-gray-500 mt-3">
                        X3 전용 설정 항목은 하드웨어가 감지되면 자동으로
                        노출됩니다. 자세한 내용은{" "}
                        <Link
                          href="/guide/settings#settings"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          설정 섹션
                        </Link>
                        을 참고하세요.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4 mb-8 text-sm">
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        제품 사양
                      </h4>
                      <ul className="text-gray-700 space-y-1">
                        <li>화면: 4.3&quot; E-Ink (220 PPI)</li>
                        <li>크기: 112 × 69 × 6 mm (약 4.4&quot; × 2.72&quot; × 0.23&quot;)</li>
                        <li>무게: 74 g</li>
                        <li>배터리: 450 mAh</li>
                        <li>저장 공간: 32 GB (MicroSD)</li>
                        <li>RAM: 128 MB</li>
                        <li>충전: USB Type-C</li>
                      </ul>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        X4 전용 기능
                      </h4>
                      <ul className="text-gray-700 space-y-1">
                        <li>1% 단위 배터리 잔량 표시 (Smooth Battery)</li>
                        <li>흰색 모델 햇빛 번짐 소프트웨어 보정</li>
                        <li>뒷면 마그네틱 부착 포인트 (케이스/스탠드 결합)</li>
                      </ul>
                      <p className="text-xs text-gray-500 mt-3">
                        X4에는 자이로/RTC가 없어 기울여 페이지 넘기기·상태 바
                        시계는 자동으로 숨겨집니다.
                      </p>
                    </div>
                  </div>
                )}

                <h3
                  id="buttons"
                  className="text-xl font-semibold text-gray-800 mb-4 scroll-mt-36"
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
                          버튼 / 포트
                        </th>
                      </tr>
                    </thead>
                    {deviceTab === "x3" ? (
                      <tbody>
                        <tr>
                          <td className="px-4 py-3 text-sm text-gray-700 border-b">
                            <strong>하단</strong>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700 border-b">
                            뒤로, 확인(OK), 다음 페이지, 이전 페이지
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm text-gray-700 border-b">
                            <strong>좌측면</strong>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700 border-b">
                            이전 페이지 버튼
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm text-gray-700 border-b">
                            <strong>우측면</strong>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700 border-b">
                            다음 페이지 버튼
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm text-gray-700 border-b">
                            <strong>상단</strong>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700 border-b">
                            리셋, MicroSD 카드 슬롯, 전원
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            <strong>뒷면</strong>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            충전 LED, NFC 감지 영역, 자성 포인트, 마그네틱 충전 포트, 스트랩 홀
                          </td>
                        </tr>
                      </tbody>
                    ) : (
                      <tbody>
                        <tr>
                          <td className="px-4 py-3 text-sm text-gray-700 border-b">
                            <strong>하단</strong>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700 border-b">
                            뒤로, 확인(OK), 다음 페이지, 이전 페이지
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm text-gray-700 border-b">
                            <strong>좌측면</strong>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700 border-b">
                            리셋, MicroSD 카드 슬롯
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm text-gray-700 border-b">
                            <strong>우측면</strong>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700 border-b">
                            전원, 이전 페이지, 다음 페이지, USB-C 충전 포트, 스트랩 홀
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            <strong>뒷면</strong>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            마그네틱 부착 포인트
                          </td>
                        </tr>
                      </tbody>
                    )}
                  </table>
                </div>
                <p className="text-gray-600 mt-4 text-sm">
                  버튼 기능은{" "}
                  <Link
                    href="/guide/settings#settings"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    설정
                  </Link>
                  에서 커스터마이징할 수 있습니다.
                </p>
              </div>

              {/* Power */}
              <div
                id="power"
                className="rounded-2xl border border-gray-200 bg-white p-8 mb-8 scroll-mt-36"
              >
                <SectionLink
                  id="power"
                  className="text-2xl font-bold text-gray-900 mb-6"
                >
                  2. 전원 및 시작
                </SectionLink>

                <h3
                  id="power-on-off"
                  className="text-xl font-semibold text-gray-800 mb-4 scroll-mt-36"
                >
                  전원 켜기/끄기
                </h3>
                <p className="text-gray-600 mb-4">
                  기기를 켜거나 끄려면 <strong>전원 버튼을 0.5초 이상</strong>{" "}
                  누르세요.
                </p>
                <p className="text-gray-600 mb-4">
                  <Link
                    href="/guide/settings#settings"
                    className="text-blue-600 hover:text-blue-800"
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
                  className="text-xl font-semibold text-gray-800 mb-4 scroll-mt-36"
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
                    <strong>참고:</strong> 종료 직전에 <em>책을 읽는 중</em>이었을
                    경우에만 다음 재시작 시 마지막으로 읽던 책이 자동으로
                    열립니다. 파일 탐색기나 설정 메뉴 상태에서 종료했다면 홈
                    화면으로 돌아옵니다.
                  </p>
                </div>
              </div>

              {/* Screens */}
              <div
                id="screens"
                className="rounded-2xl border border-gray-200 bg-white p-8 mb-8 scroll-mt-36"
              >
                <SectionLink
                  id="screens"
                  className="text-2xl font-bold text-gray-900 mb-6"
                >
                  3. 화면 구성
                </SectionLink>

                <div className="space-y-6">
                  <div id="home" className="scroll-mt-36">
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

                  <div id="file-explorer" className="scroll-mt-36">
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

                  <div id="reading-screen" className="scroll-mt-36">
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
                </div>
              </div>

              {/* Reading Mode */}
              <div
                id="reading"
                className="rounded-2xl border border-gray-200 bg-white p-8 mb-8 scroll-mt-36"
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
                  className="text-xl font-semibold text-gray-800 mb-4 scroll-mt-36"
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
                    href="/guide/settings#settings"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    설정
                  </Link>
                  에서 바꿀 수 있습니다.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <p className="text-blue-800 text-sm">
                    <strong>팁:</strong>{" "}
                    <Link
                      href="/guide/settings#settings"
                      className="text-blue-600 hover:text-blue-800"
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
                  className="text-xl font-semibold text-gray-800 mb-4 mt-6 scroll-mt-36"
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
                  className="text-xl font-semibold text-gray-800 mb-4 scroll-mt-36"
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
                  className="text-xl font-semibold text-gray-800 mb-4 mt-6 scroll-mt-36"
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
                  className="text-xl font-semibold text-gray-800 mb-4 mt-6 scroll-mt-36"
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
                className="rounded-2xl border border-gray-200 bg-white p-8 mb-8 scroll-mt-36"
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
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
