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
  { id: "settings", title: "시스템 설정 (홈)" },
  { id: "epub-reader-menu", title: "EPUB 리더 설정" },
  { id: "txt-reader-menu", title: "TXT 리더 설정" },
];

export default function GuideSettingsPage() {
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
            <h1 className="text-4xl font-bold text-gray-900">설정</h1>
            <p className="mt-4 text-lg text-gray-600">
              시스템 설정(홈 화면), EPUB 리더 확인 메뉴, TXT 리더 확인 메뉴를
              구분해서 안내합니다.
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
                  <div id="settings" className="scroll-mt-36">
                    <SectionLink
                      id="settings"
                      className="text-xl font-semibold text-gray-800 mb-2"
                    >
                      3.5 시스템 설정 (홈 화면)
                    </SectionLink>
                    <p className="text-gray-500 text-sm mb-3">
                      홈 화면에서 <strong>Settings</strong> 항목을 선택하면
                      열리는 기기 전역 설정입니다.
                    </p>
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
                        <strong>시계 (X3 전용):</strong> 상태 바에 현재 시각을
                        표시합니다. X3에 내장된 DS3231 RTC로 시간을 유지하며,
                        Wi-Fi 연결 시 NTP로 자동 동기화(최대 ~5초)되어
                        RTC에 반영됩니다. DS3231이 없는 X4에서는 항목이 표시되지
                        않습니다. (v1.2.0-ko.12)
                      </li>
                      <li>
                        <strong>시계 UTC 오프셋 (X3 전용):</strong> 시계 표시에
                        사용할 UTC 오프셋을 설정합니다. 예: 한국은 UTC+9,
                        30분 단위도 지원(UTC+5:30 등). (v1.2.0-ko.12)
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
                          href="/guide/customize#custom-font"
                          className="text-blue-600 hover:text-blue-800"
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
                      <li>
                        <strong>기울여 페이지 넘기기 (X3 전용):</strong> 내장
                        자이로 센서(QMI8658)로 기기를 좌/우로 살짝 기울이면
                        다음/이전 페이지로 넘어갑니다. 방향 설정(<em>정방향</em>{" "}
                        / <em>역방향</em>)으로 기울임 방향과 페이지 넘김 방향을
                        반전시킬 수 있고, 세로/가로/반전 방향 모두 지원합니다.
                        QMI8658이 없는 X4에서는 항목이 표시되지 않습니다. (v1.2.0-ko.12)
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
                          href="/guide/customize#koreader-sync"
                          className="text-blue-600 hover:text-blue-800"
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

                  {/* EPUB Reader Menu (OK popup) */}
                  <div id="epub-reader-menu" className="scroll-mt-36">
                    <SectionLink
                      id="epub-reader-menu"
                      className="text-xl font-semibold text-gray-800 mb-2"
                    >
                      3.6 EPUB 리더 설정 (확인 버튼)
                    </SectionLink>
                    <p className="text-gray-600 mb-3">
                      EPUB을 읽는 도중 <strong>확인(OK) 버튼</strong>을 누르면
                      리더 전용 메뉴가 뜹니다. 책과 관련된 동작 위주로 구성되어
                      있으며, 진행률·방향·자동 넘김 등 시스템 설정과 별도로
                      관리되는 값도 포함됩니다.
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                      <li>
                        <strong>챕터 선택:</strong> 목차에서 원하는 챕터로 바로
                        이동
                      </li>
                      <li>
                        <strong>각주 (Footnotes):</strong> 현재 책이 각주를
                        포함할 때만 표시되며, 각주 목록을 한 번에 탐색
                        (v1.2.0)
                      </li>
                      <li>
                        <strong>화면 방향:</strong> 세로(기본) / 가로 시계 /
                        반전 / 가로 반시계 방향 — 선택 즉시 미리보기 되고,
                        메뉴를 빠져나갈 때 적용됩니다.
                      </li>
                      <li>
                        <strong>자동 페이지 넘김:</strong> 분당 넘김 속도 선택
                        (OFF / 1 / 3 / 6 / 12) (v1.2.0)
                      </li>
                      <li>
                        <strong>퍼센트로 이동:</strong> 책 전체 진행률을
                        직접 입력해 원하는 위치로 점프
                      </li>
                      <li>
                        <strong>스크린샷:</strong> 현재 페이지를 SD 카드의{" "}
                        <code className="bg-gray-100 px-1 rounded">
                          /screenshots
                        </code>{" "}
                        폴더에 BMP로 저장 (자세한 내용은{" "}
                        <Link
                          href="/guide/customize#screenshot"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          스크린샷 가이드
                        </Link>
                        )
                      </li>
                      <li>
                        <strong>QR 표시:</strong> 현재 웹서버/핫스팟 주소를
                        QR로 화면에 띄워 휴대폰에서 바로 접속
                      </li>
                      <li>
                        <strong>홈으로:</strong> 현재 읽기 위치를 저장하고
                        홈 화면으로 돌아감
                      </li>
                      <li>
                        <strong>진행률 동기화 (Sync):</strong> KOReader Sync
                        서버로 현재 읽기 위치를 업로드 (자세한 내용은{" "}
                        <Link
                          href="/guide/customize#koreader-sync"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          KOReader 동기화
                        </Link>
                        )
                      </li>
                      <li>
                        <strong>캐시 삭제:</strong> 현재 책의 렌더링 캐시
                        (.crosspoint 내) 만 삭제. 설정과 읽기 위치는 유지
                      </li>
                    </ul>
                    <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-sm text-blue-800 mb-2">
                      <strong>참고:</strong> 리더 확인 메뉴에서 바꾼 화면
                      방향과 자동 페이지 넘김 값은 책 단위로 저장되며 JSON
                      설정에도 반영됩니다.
                    </div>
                  </div>

                  {/* TXT Reader Menu (OK popup) */}
                  <div id="txt-reader-menu" className="scroll-mt-36">
                    <SectionLink
                      id="txt-reader-menu"
                      className="text-xl font-semibold text-gray-800 mb-2"
                    >
                      3.7 TXT 리더 설정 (확인 버튼)
                    </SectionLink>
                    <p className="text-gray-600 mb-3">
                      TXT 파일은 챕터 개념이 없는 평탄 구조라 EPUB보다 간소한
                      메뉴가 뜹니다. 바이트 오프셋 기반으로 이동합니다.
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                      <li>
                        <strong>화면 방향:</strong> 세로 / 가로 시계 / 반전 /
                        가로 반시계 중 선택
                      </li>
                      <li>
                        <strong>자동 페이지 넘김:</strong> 분당 넘김 속도
                        (OFF / 1 / 3 / 6 / 12) — EPUB과 동일 옵션
                      </li>
                      <li>
                        <strong>페이지 점프 크기 (Page Jump Step):</strong>{" "}
                        OFF / 10 / 20 / 50 / 100 — 이동 버튼을 1초 이상 길게
                        누르면 지정한 페이지 수만큼 건너뜁니다. OFF일 때는
                        길게 눌러도 한 페이지만 넘김 (v1.2.0-ko)
                      </li>
                      <li>
                        <strong>퍼센트로 이동:</strong> 전체 파일 대비 진행률
                        입력으로 점프
                      </li>
                      <li>
                        <strong>스크린샷:</strong> 현재 페이지를 BMP로 저장
                      </li>
                      <li>
                        <strong>홈으로:</strong> 현재 위치 저장 후 홈 화면 복귀
                      </li>
                    </ul>
                    <p className="text-gray-500 text-xs">
                      TXT 리더 메뉴에는 챕터 선택·각주·QR 표시·동기화·캐시
                      삭제가 없습니다 — 이 기능들은 EPUB 리더에서만 의미가
                      있어 TXT에서는 노출되지 않습니다.
                    </p>
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
