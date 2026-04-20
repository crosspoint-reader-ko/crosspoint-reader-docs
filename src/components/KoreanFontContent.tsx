"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface Section {
  id: string;
  title: string;
}

const sections: Section[] = [
  { id: "overview", title: "개요" },
  { id: "applied-fonts", title: "적용된 폰트" },
  { id: "unicode-ranges", title: "지원 유니코드 범위" },
  { id: "font-conversion", title: "커스텀 폰트 변환" },
  { id: "python-conversion", title: "Python으로 변환하기" },
  { id: "license", title: "라이선스" },
];

export default function KoreanFontContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const element = document.getElementById(hash);
      if (element) {
        setTimeout(() => {
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - 100;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }, 100);
      }
    }
  }, [searchParams]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - 100;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      window.history.pushState(null, "", `#${id}`);
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-linear-to-b from-blue-50 to-white py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900">한글 폰트 정보</h1>
          <p className="mt-4 text-lg text-gray-600">
            CrossPoint Reader 한국어 버전에 적용된 폰트 정보와 기술적 세부
            사항을 안내합니다.
          </p>
          {/* Quick Navigation */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {sections.map((section) => (
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
          <div className="prose prose-lg prose-blue max-w-none">
            {/* Overview */}
            <div id="overview" className="rounded-2xl border border-gray-200 bg-white p-8 mb-8 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">개요</h2>
              <p className="text-gray-600 mb-4">
                한글 지원을 위해 다음 폰트들을 적용했습니다:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>
                  <strong>EPUB 리더:</strong> KoPub 바탕 (KoPub Batang) -
                  한글/영문/한자 지원
                </li>
                <li>
                  <strong>UI/시스템:</strong> Pretendard - 한글/영문 지원
                </li>
              </ul>
            </div>

            {/* Applied Fonts */}
            <div id="applied-fonts" className="rounded-2xl border border-gray-200 bg-white p-8 mb-8 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                적용된 폰트
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">
                        용도
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">
                        폰트
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">
                        스타일
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">
                        사이즈
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">
                        헤더 파일
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-700 border-b">
                        EPUB 리더
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 border-b">
                        KoPub Batang
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 border-b">
                        Regular
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 border-b">
                        14
                      </td>
                      <td className="px-4 py-3 text-sm border-b">
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                          kopub_14_regular.h
                        </code>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-700 border-b">
                        UI
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 border-b">
                        Pretendard
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 border-b">
                        Regular
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 border-b">
                        8
                      </td>
                      <td className="px-4 py-3 text-sm border-b">
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                          pretendard_8.h
                        </code>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        Small
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        Pretendard
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        Regular
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">8</td>
                      <td className="px-4 py-3 text-sm">
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                          pretendard_8.h
                        </code>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Unicode Ranges */}
            <div id="unicode-ranges" className="rounded-2xl border border-gray-200 bg-white p-8 mb-8 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                지원 유니코드 범위
              </h2>
              <p className="text-gray-600 mb-4">
                KoPub 바탕 폰트는 다음 유니코드 범위를 지원합니다:
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 rounded-lg text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900 border-b">
                        범위
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900 border-b">
                        설명
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <tr>
                      <td className="px-4 py-2 border-b">
                        <code className="bg-gray-100 px-1 rounded">
                          0xAC00-0xD7AF
                        </code>
                      </td>
                      <td className="px-4 py-2 border-b">
                        한글 음절 (Hangul Syllables) - 11,172자
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border-b">
                        <code className="bg-gray-100 px-1 rounded">
                          0x3130-0x318F
                        </code>
                      </td>
                      <td className="px-4 py-2 border-b">
                        한글 호환 자모 (Hangul Compatibility Jamo)
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border-b">
                        <code className="bg-gray-100 px-1 rounded">
                          0x4E00-0x9FFF
                        </code>
                      </td>
                      <td className="px-4 py-2 border-b">
                        CJK 통합 한자 (CJK Unified Ideographs) - 20,992자
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border-b">
                        <code className="bg-gray-100 px-1 rounded">
                          0x3000-0x303F
                        </code>
                      </td>
                      <td className="px-4 py-2 border-b">
                        CJK 기호 및 문장부호 (『』「」《》〈〉【】 등)
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border-b">
                        <code className="bg-gray-100 px-1 rounded">
                          0x2000-0x206F
                        </code>
                      </td>
                      <td className="px-4 py-2 border-b">
                        General Punctuation (—–…&apos;&apos;&quot;&quot;†)
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border-b">
                        <code className="bg-gray-100 px-1 rounded">
                          0x2100-0x214F
                        </code>
                      </td>
                      <td className="px-4 py-2 border-b">
                        Letterlike Symbols (℃℉№™℡)
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border-b">
                        <code className="bg-gray-100 px-1 rounded">
                          0x2150-0x218F
                        </code>
                      </td>
                      <td className="px-4 py-2 border-b">
                        Number Forms (⅓⅔¼½¾)
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border-b">
                        <code className="bg-gray-100 px-1 rounded">
                          0x2190-0x21FF
                        </code>
                      </td>
                      <td className="px-4 py-2 border-b">Arrows (←↑→↓↔↕)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border-b">
                        <code className="bg-gray-100 px-1 rounded">
                          0x2200-0x22FF
                        </code>
                      </td>
                      <td className="px-4 py-2 border-b">
                        Mathematical Operators (±×÷≠≤≥∞)
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border-b">
                        <code className="bg-gray-100 px-1 rounded">
                          0x2460-0x24FF
                        </code>
                      </td>
                      <td className="px-4 py-2 border-b">
                        Enclosed Alphanumerics (①②③ⓐⓑⓒ)
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border-b">
                        <code className="bg-gray-100 px-1 rounded">
                          0x2500-0x257F
                        </code>
                      </td>
                      <td className="px-4 py-2 border-b">
                        Box Drawings (─│┌┐└┘├┤┬┴┼)
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border-b">
                        <code className="bg-gray-100 px-1 rounded">
                          0x25A0-0x25FF
                        </code>
                      </td>
                      <td className="px-4 py-2 border-b">
                        Geometric Shapes (○●◎□■△▲)
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border-b">
                        <code className="bg-gray-100 px-1 rounded">
                          0x2600-0x26FF
                        </code>
                      </td>
                      <td className="px-4 py-2 border-b">
                        Miscellaneous Symbols (☀☁☂★☆♠♣♥♦)
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border-b">
                        <code className="bg-gray-100 px-1 rounded">
                          0x2700-0x27BF
                        </code>
                      </td>
                      <td className="px-4 py-2 border-b">
                        Dingbats (✓✔✕✖✗✘)
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2">
                        <code className="bg-gray-100 px-1 rounded">
                          0x3200-0x32FF
                        </code>
                      </td>
                      <td className="px-4 py-2">Enclosed CJK (㈜㈀㉠㉡)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Font Conversion */}
            <div id="font-conversion" className="rounded-2xl border border-gray-200 bg-white p-8 mb-8 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                커스텀 폰트 변환
              </h2>
              <p className="text-gray-600 mb-4">
                TTF/OTF 폰트를 CrossPoint Reader에서 사용할 수 있는{" "}
                <code className="bg-gray-100 px-1 rounded">.epdfont</code>{" "}
                형식으로 변환할 수 있습니다.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  웹 폰트 변환기
                </h3>
                <p className="text-blue-700 mb-4">
                  브라우저에서 바로 폰트를 변환할 수 있습니다. 다양한 유니코드 범위를 선택하고 실시간 미리보기를 확인하세요.
                </p>
                <a
                  href="/font-converter"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  폰트 변환기 열기
                </a>
              </div>

              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                변환된 폰트 사용 방법
              </h3>
              <ol className="list-decimal list-inside text-gray-600 space-y-2 mb-6">
                <li>
                  <a href="/font-converter" className="text-blue-600 hover:underline">폰트 변환기</a>에서 TTF/OTF 파일을 업로드합니다.
                </li>
                <li>원하는 유니코드 범위(한국어, 중국어, 일본어 등)를 선택합니다.</li>
                <li>폰트 크기와 비트 깊이를 설정하고 변환합니다.</li>
                <li>
                  변환된 <code className="bg-gray-100 px-1 rounded">.epdfont</code> 파일을 SD 카드의{" "}
                  <code className="bg-gray-100 px-1 rounded">/.crosspoint/fonts/</code> 또는 루트의{" "}
                  <code className="bg-gray-100 px-1 rounded">/fonts/</code> 폴더에 복사합니다.
                </li>
                <li>기기의 설정 &gt; 글꼴 설정에서 폰트를 선택합니다.</li>
              </ol>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-yellow-800 mb-2">
                  지원되는 폰트 형식 및 제한 사항
                </h4>
                <div className="text-sm text-yellow-700 space-y-2">
                  <p><strong>지원 형식:</strong> TTF, OTF, WOFF, WOFF2</p>
                  <p><strong>지원되지 않는 폰트:</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li><strong>가변 폰트 (Variable Fonts)</strong> - 현재 FreeType WASM에서 가변 폰트 인터페이스가 구현되지 않았습니다.</li>
                    <li><strong>컬러 폰트 (Color Fonts/Emoji)</strong> - 컬러 레이어 폰트는 흑백으로만 렌더링됩니다.</li>
                    <li><strong>비트맵 전용 폰트</strong> - 스케일러블 아웃라인이 없는 순수 비트맵 폰트는 변환되지 않습니다.</li>
                  </ul>
                  <p className="mt-2 text-yellow-600">
                    일반적인 한글 폰트(나눔고딕, 맑은 고딕, 본고딕 등)는 대부분 정상적으로 변환됩니다.
                  </p>
                </div>
              </div>

            </div>

            {/* Python Advanced Conversion */}
            <div id="python-conversion" className="rounded-2xl border border-gray-200 bg-white p-8 mb-8 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                고급: Python으로 변환하기
              </h2>
              <p className="text-gray-600 mb-4">
                더 많은 유니코드 범위와 세밀한 옵션이 필요하다면 Python 스크립트를 사용할 수 있습니다.
                {/* 웹 변환기와 달리 <strong>파일 크기 제한이 없고</strong>, CJK 확장 한자 등 대용량 폰트 변환에 적합합니다.
                또한 위의 웹 변환기 제약사항(가변 폰트, 컬러 폰트 등)이 거의 적용되지 않습니다. */}
              </p>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-800 mb-2">필요 사항</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Python 3.8 이상</li>
                    <li>freetype-py 라이브러리</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-800 mb-2">설치</h4>
                  <div className="bg-gray-900 rounded-lg p-3 overflow-x-auto">
                    <code className="text-sm text-green-400">pip install freetype-py</code>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-800 mb-2">스크립트 다운로드</h4>
                  <a
                    href="/ttf_to_epdfont.py"
                    download="ttf_to_epdfont.py"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-900 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    ttf_to_epdfont.py 다운로드
                  </a>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-800 mb-2">사용법</h4>
                  <div className="bg-gray-900 rounded-lg p-3 overflow-x-auto">
                    <code className="text-sm text-green-400 whitespace-pre">python ttf_to_epdfont.py &lt;폰트이름&gt; &lt;크기&gt; &lt;폰트파일.ttf&gt; [옵션]</code>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-800 mb-2">옵션</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left py-2 px-3 font-medium text-gray-900 border-b">옵션</th>
                          <th className="text-left py-2 px-3 font-medium text-gray-900 border-b">설명</th>
                          <th className="text-left py-2 px-3 font-medium text-gray-900 border-b">기본값</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-700">
                        <tr className="border-b">
                          <td className="py-2 px-3 font-mono text-xs">--2bit</td>
                          <td className="py-2 px-3">2비트 그레이스케일 (안티앨리어싱)</td>
                          <td className="py-2 px-3">1비트</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 px-3 font-mono text-xs">--line-height</td>
                          <td className="py-2 px-3">줄 높이 배율</td>
                          <td className="py-2 px-3">1.2</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 px-3 font-mono text-xs">--letter-spacing</td>
                          <td className="py-2 px-3">자간 (픽셀)</td>
                          <td className="py-2 px-3">0</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 px-3 font-mono text-xs">--width-scale</td>
                          <td className="py-2 px-3">장평 (가로 비율)</td>
                          <td className="py-2 px-3">1.0</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 px-3 font-mono text-xs">--baseline-offset</td>
                          <td className="py-2 px-3">베이스라인 오프셋 (픽셀)</td>
                          <td className="py-2 px-3">0</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 font-mono text-xs">-o, --output</td>
                          <td className="py-2 px-3">출력 파일 경로</td>
                          <td className="py-2 px-3">&lt;이름&gt;_&lt;크기&gt;.epdfont</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-800 mb-2">예시</h4>
                  <div className="bg-gray-900 rounded-lg p-3 overflow-x-auto">
                    <code className="text-sm text-green-400 whitespace-pre">{`python ttf_to_epdfont.py kopub-batang 28 "KoPub Batang Light.ttf" \\
    --2bit \\
    --line-height 1.2 \\
    --letter-spacing 0 \\
    --width-scale 1.0 \\
    -o kopub_batang_28.epdfont`}</code>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div className="text-sm text-blue-700">
                      <p className="font-medium mb-1">유니코드 범위</p>
                      <p>
                        Python 스크립트는 기본적으로 한글(가-힣), CJK 한자, 일본어(히라가나/가타카나),
                        라틴 확장, 수학 기호 등 광범위한 유니코드 범위를 포함합니다.
                        폰트에 해당 글리프가 없는 문자는 자동으로 건너뜁니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* License */}
            <div id="license" className="rounded-2xl border border-blue-200 bg-blue-50 p-8 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                라이선스
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800">KoPub 바탕</h3>
                  <p className="text-gray-600 mb-2">
                    <a
                      href="https://www.kopus.org/biz-electronic-font2/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      한국출판인회의
                    </a>
                    에서 제공하는 서체입니다. 지적재산권은 문화체육관광부와 한국출판인회의에 있습니다.
                  </p>
                  <ul className="text-sm text-gray-600 list-disc list-inside space-y-1 ml-2">
                    <li>출판업계, 기업, 개인 모두 별도 허가 절차 없이 무료 사용 가능</li>
                    <li>종이책, 전자책, 인쇄물, 광고물, 온라인 상업적 이용 허용</li>
                    <li>사전승인 없이 폰트 수정/변형 불가</li>
                    <li>폰트 자체의 유료 판매, 양도 등 상업적 행위 금지</li>
                  </ul>
                  <p className="text-xs text-gray-500 mt-2">
                    정확한 사용조건은{" "}
                    <a
                      href="https://www.kopus.org/wp-content/uploads/2021/04/%EC%84%9C%EC%B2%B4_%EB%9D%BC%EC%9D%B4%EC%84%A0%EC%8A%A4.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      서체 라이선스 약관
                    </a>
                    을 참고하세요.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Pretendard</h3>
                  <p className="text-gray-600">
                    <a
                      href="https://github.com/orioncactus/pretendard"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      GitHub
                    </a>
                    에서 제공하는 오픈소스 서체입니다 (SIL Open Font License).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
