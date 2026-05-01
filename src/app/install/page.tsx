import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import type { Metadata } from "next";
import { getLatestRelease } from "@/lib/github";
import { CROSSPOINT_VERSION } from "@/constants/version";
import { getAssetPath } from "@/lib/basePath";
import { readFileSync } from "fs";
import { join } from "path";

export const metadata: Metadata = {
  title: "설치 가이드",
  description:
    "Xteink X3/X4에 CrossPoint Reader 한국어 펌웨어를 설치하는 방법을 안내합니다. 웹 플래셔, SD카드, esptool 등 여러 방법을 지원합니다.",
  openGraph: {
    title: "설치 가이드 | CrossPoint Reader",
    description:
      "Xteink X3/X4에 CrossPoint Reader 한국어 펌웨어를 설치하는 방법을 안내합니다.",
  },
};

interface StoreFirmwareInfo {
  x4File: string | null;
  x4Version: string | null;
  x3File: string | null;
  x3Version: string | null;
}

function loadStoreFirmwareInfo(): StoreFirmwareInfo {
  try {
    const data = JSON.parse(
      readFileSync(
        join(process.cwd(), "public", "firmware", "versions.json"),
        "utf-8",
      ),
    );
    return {
      x4File: data.x4ChineseOfficialFile || null,
      x4Version: data.x4ChineseOfficial || null,
      x3File: data.x3ChineseOfficialFile || null,
      x3Version: data.x3ChineseOfficial || null,
    };
  } catch {
    return { x4File: null, x4Version: null, x3File: null, x3Version: null };
  }
}

export default async function InstallPage() {
  const latestRelease = await getLatestRelease();
  const storeFirmware = loadStoreFirmwareInfo();

  // API에서 가져온 정보 사용, 실패 시 fallback
  const version = latestRelease?.tag_name || CROSSPOINT_VERSION;

  // 웹 플래시용 펌웨어 (firmware.bin)
  const webFirmwareFilename =
    latestRelease?.web_firmware_name || "firmware.bin";
  const webFirmwareDownloadUrl =
    latestRelease?.web_firmware_url ||
    `https://github.com/crosspoint-reader-ko/crosspoint-reader-ko/releases/download/${CROSSPOINT_VERSION}/firmware.bin`;

  // esptool용 머지된 펌웨어 (CrossPoint-*.bin)
  const mergedFirmwareFilename =
    latestRelease?.merged_firmware_name ||
    `CrossPoint-${CROSSPOINT_VERSION}.bin`;
  const mergedFirmwareDownloadUrl =
    latestRelease?.merged_firmware_url ||
    `https://github.com/crosspoint-reader-ko/crosspoint-reader-ko/releases/download/${CROSSPOINT_VERSION}/CrossPoint-${CROSSPOINT_VERSION}.bin`;
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700 mb-4">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
              </span>
              현재 버전: v{version}
            </div>
            <h1 className="text-4xl font-bold text-gray-900">설치 가이드</h1>
            <p className="mt-4 text-lg text-gray-600">
              CrossPoint Reader 한국어 펌웨어를 Xteink X3/X4에 설치하는 방법을
              안내합니다. 단일 펌웨어로 두 모델 모두 지원하며, 웹 플래셔·SD카드·OTA
              등 다양한 설치 방법을 제공합니다.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg prose-blue max-w-none">
              {/* Method 1: Web Flash */}
              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-8 mb-12">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex h-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-sm px-3">
                    추천
                  </span>
                  <h2 className="text-2xl font-bold text-gray-900 m-0">
                    방법 1: 웹 플래셔 사용 (권장)
                  </h2>
                </div>
                <p className="text-gray-600 mb-6">
                  가장 쉽고 빠른 방법입니다. 이 사이트의 웹 플래셔에서 바로
                  펌웨어를 설치할 수 있습니다.
                </p>

                <div className="not-prose space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-sm">
                      1
                    </div>
                    <h3 className="font-semibold text-gray-900">USB 연결</h3>
                  </div>
                  <p className="text-gray-600 ml-12">
                    <strong>X4:</strong> USB-C 케이블로 컴퓨터에 연결합니다.
                    <br />
                    <strong>X3:</strong> 동봉된 마그네틱 충전/데이터 케이블로
                    컴퓨터에 연결합니다.
                    <br />
                    <span className="text-sm text-gray-500">
                      ※ 시리얼 넘버가 붙은 X3 패키지의 경우 USB가 인식되지 않을 수 있습니다.
                      이 경우 아래 <strong>방법 2: SD카드 업데이트</strong>를 사용하세요.
                    </span>
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-sm">
                      2
                    </div>
                    <h3 className="font-semibold text-gray-900">
                      웹 플래셔로 이동
                    </h3>
                  </div>
                  <div className="ml-12">
                    <p className="text-gray-600">
                      웹 플래셔 페이지로 이동합니다. Chrome 또는 Edge 브라우저를
                      사용해주세요.
                    </p>
                    <Link
                      href="/flasher"
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors mt-3"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                        />
                      </svg>
                      웹 플래셔 열기
                    </Link>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-sm">
                      3
                    </div>
                    <h3 className="font-semibold text-gray-900">펌웨어 플래싱</h3>
                  </div>
                  <div className="ml-12">
                    <p className="text-gray-600">
                      <strong>한국어 펌웨어 플래싱 (커뮤니티)</strong> 버튼을
                      클릭합니다.
                    </p>
                    <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                      <li>장치 선택 팝업에서 USB 시리얼 장치를 선택합니다</li>
                      <li>플래싱이 자동으로 진행됩니다</li>
                    </ul>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-sm">
                      4
                    </div>
                    <h3 className="font-semibold text-gray-900">펌웨어 적용</h3>
                  </div>
                  <div className="ml-12">
                    <p className="text-gray-600">플래시가 완료되면 자동으로 재부팅됩니다. 만약 멈춰있다면:</p>
                    <ol className="list-decimal list-inside text-gray-600 mt-2 space-y-1">
                      <li>
                        기기의 <strong>Reset</strong> 버튼을 한 번 누릅니다
                      </li>
                      <li>
                        <strong>전원 버튼</strong>을 1초 이상 눌러 부팅합니다
                      </li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Method 2: SD Card Update */}
              <div className="rounded-2xl border border-green-200 bg-green-50 p-8 mb-12">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex h-8 shrink-0 items-center justify-center rounded-full bg-green-600 text-white font-bold text-sm px-3">
                    NEW
                  </span>
                  <h2 className="text-2xl font-bold text-gray-900 m-0">
                    방법 2: SD카드 펌웨어 업데이트
                  </h2>
                </div>
                <p className="text-gray-600 mb-6">
                  USB 연결이 어렵거나 무선으로 업데이트하기 어려운 환경에서
                  사용할 수 있는 방법입니다. v1.2.0-ko.15부터 지원되며, X3
                  스토어 펌웨어로의 롤백에도 사용할 수 있습니다.
                </p>

                <div className="not-prose space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      A. 처음 사용자 (USB가 안 되는 X3 OEM 펌웨어 상태)
                    </h3>
                    <ol className="list-decimal list-inside text-gray-600 space-y-2 ml-2">
                      <li>
                        GitHub 릴리즈에서{" "}
                        <code className="bg-gray-200 px-2 py-0.5 rounded text-sm">
                          {webFirmwareFilename}
                        </code>
                        을 다운로드합니다.
                      </li>
                      <li>
                        SD카드 <strong>루트 폴더</strong>에 복사하면서
                        파일명을{" "}
                        <code className="bg-gray-200 px-2 py-0.5 rounded text-sm">
                          update.bin
                        </code>
                        으로 변경합니다.
                      </li>
                      <li>SD카드를 디바이스에 삽입합니다.</li>
                      <li>
                        <strong>왼쪽 사이드 버튼을 누른 상태에서</strong> 전원
                        버튼을 길게 눌러 부팅합니다.
                      </li>
                      <li>OEM 부트로더가 자동으로 펌웨어를 인식해 플래싱합니다.</li>
                    </ol>
                  </div>

                  <div className="border-t border-green-200 pt-6">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      B. 기존 사용자 (이미 CrossPoint Reader-KO 사용 중)
                    </h3>
                    <ol className="list-decimal list-inside text-gray-600 space-y-2 ml-2">
                      <li>
                        GitHub 릴리즈에서{" "}
                        <code className="bg-gray-200 px-2 py-0.5 rounded text-sm">
                          {webFirmwareFilename}
                        </code>
                        을 다운로드해 SD카드에 복사합니다.
                      </li>
                      <li>SD카드를 디바이스에 삽입합니다.</li>
                      <li>
                        <strong>설정 → 시스템 → SD카드 펌웨어 업데이트</strong>로 이동합니다.
                      </li>
                      <li>SD카드의 펌웨어 파일을 선택하면 자동으로 플래싱이 진행됩니다.</li>
                      <li>플래싱이 완료되면 자동으로 재부팅됩니다.</li>
                    </ol>
                    <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
                      <p className="text-sm text-blue-800">
                        💡 같은 메뉴에서 다운로드 받은{" "}
                        <strong>스토어 펌웨어</strong>(X3/X4 OEM)도 선택해
                        롤백할 수 있습니다.
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-green-200 pt-6">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      참고: OTA(WiFi) 업데이트도 같은 메뉴에서 가능
                    </h3>
                    <p className="text-gray-600">
                      WiFi가 연결되어 있다면{" "}
                      <strong>설정 → 시스템 → 업데이트</strong>로 이동해 별도
                      파일 없이 OTA 업데이트할 수 있습니다. SD/OTA 모두 X4
                      실리콘에서 동작하도록 raw 파티션 쓰기 + 직접 otadata
                      갱신 방식으로 동작합니다.
                    </p>
                  </div>
                </div>
              </div>

              {/* Method 3: External Web Flasher */}
              <div className="rounded-2xl border border-gray-200 bg-white p-8 mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  방법 3: 펌웨어 다운로드 후 플래셔 사용
                </h2>
                <p className="text-gray-600 mb-6">
                  펌웨어 파일을 직접 다운로드하여 웹 플래셔에서 설치하는
                  방법입니다.
                </p>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      1. 펌웨어 다운로드
                    </h3>
                    <p className="text-gray-600 mt-1">
                      GitHub 릴리즈 페이지에서{" "}
                      <code className="bg-gray-200 px-2 py-1 rounded text-sm">
                        {webFirmwareFilename}
                      </code>{" "}
                      파일을 다운로드합니다.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 mt-3">
                      <a
                        href={webFirmwareDownloadUrl}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-900 transition-colors"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                          />
                        </svg>
                        펌웨어 다운로드
                      </a>
                      <a
                        href="https://github.com/crosspoint-reader-ko/crosspoint-reader-ko/releases"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        릴리즈 페이지 열기
                      </a>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      2. 웹 플래셔 접속
                    </h3>
                    <p className="text-gray-600 mt-1">
                      웹 플래셔에 접속합니다.
                    </p>
                    <a
                      href="https://xteink.dve.al/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-2 text-blue-600 hover:text-blue-700"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                        />
                      </svg>
                      xteink.dve.al 열기
                    </a>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      3. OTA 플래시
                    </h3>
                    <p className="text-gray-600 mt-1">
                      <strong>OTA fast flash controls</strong> 섹션에서:
                    </p>
                    <ol className="list-decimal list-inside text-gray-600 mt-2 space-y-1">
                      <li>
                        <strong>Select File</strong> 버튼을 클릭하여 다운로드한
                        .bin 파일을 선택
                      </li>
                      <li>
                        <strong>Flash firmware from file</strong> 버튼을
                        클릭하여 플래시 시작
                      </li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Method 4: esptool */}
              <div className="rounded-2xl border border-gray-200 bg-white p-8 mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  방법 4: esptool 사용 (고급)
                </h2>
                <p className="text-gray-600 mb-6">
                  명령줄 도구를 사용하여 직접 펌웨어를 플래시하는 방법입니다.
                  머지된 바이너리 파일을 사용합니다.
                </p>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      1. 펌웨어 다운로드
                    </h3>
                    <p className="text-gray-600 mt-1">
                      GitHub 릴리즈 페이지에서{" "}
                      <code className="bg-gray-200 px-2 py-1 rounded text-sm">
                        {mergedFirmwareFilename}
                      </code>{" "}
                      파일을 다운로드합니다. (esptool 전용 머지된 바이너리)
                    </p>
                    <a
                      href={mergedFirmwareDownloadUrl}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-900 transition-colors mt-3"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                        />
                      </svg>
                      머지된 펌웨어 다운로드
                    </a>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      2. esptool 설치
                    </h3>
                    <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 mt-2 overflow-x-auto">
                      <code>pip install esptool</code>
                    </pre>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      3. 펌웨어 플래시
                    </h3>
                    <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 mt-2 overflow-x-auto">
                      <code>
                        esptool.py --chip esp32c3 write_flash 0x0{" "}
                        {mergedFirmwareFilename}
                      </code>
                    </pre>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <svg
                        className="h-6 w-6 text-yellow-600 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                        />
                      </svg>
                      <div>
                        <h4 className="font-semibold text-yellow-800">
                          주의사항
                        </h4>
                        <p className="text-yellow-700 text-sm mt-1">
                          플래시 중 USB 케이블을 분리하지 마세요. 기기가 손상될
                          수 있습니다.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reverting */}
              <div className="rounded-2xl border border-gray-200 bg-white p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  원래 펌웨어로 복원 (스토어 펌웨어)
                </h2>
                <p className="text-gray-600 mb-6">
                  원래 Xteink 공식 펌웨어로 되돌리려면 다음 방법 중 하나를
                  사용하세요. 아래에서 X3/X4용 최신 스토어 펌웨어를 직접
                  다운로드 받을 수 있습니다.
                </p>

                <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <div className="flex gap-2">
                    <svg className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                    </svg>
                    <p className="text-sm text-blue-800">
                      CrossPoint 펌웨어와 스토어 펌웨어 간 전환 시 모든 설정(WiFi, 읽기 설정 등)은 변경되지 않고 그대로 유지됩니다.
                    </p>
                  </div>
                </div>

                {/* Store Firmware Downloads */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    스토어 펌웨어 다운로드
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {storeFirmware.x4File && (
                      <a
                        href={getAssetPath(`/firmware/${storeFirmware.x4File}`)}
                        download
                        className="flex items-center justify-between gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900">
                            X4 중국어 공식{" "}
                            {storeFirmware.x4Version && (
                              <span className="text-sm font-normal text-gray-500">
                                v{storeFirmware.x4Version}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {storeFirmware.x4File}
                          </div>
                        </div>
                        <svg className="h-5 w-5 text-gray-600 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                      </a>
                    )}
                    {storeFirmware.x3File && (
                      <a
                        href={getAssetPath(`/firmware/${storeFirmware.x3File}`)}
                        download
                        className="flex items-center justify-between gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900">
                            X3 중국어 공식{" "}
                            {storeFirmware.x3Version && (
                              <span className="text-sm font-normal text-gray-500">
                                v{storeFirmware.x3Version}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {storeFirmware.x3File}
                          </div>
                        </div>
                        <svg className="h-5 w-5 text-gray-600 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                      </a>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    파일명은 OEM 원본 파일명을 그대로 유지합니다. 다운로드 후
                    아래 방법 중 하나로 플래싱하세요.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900">방법 1: 웹 플래셔</h3>
                    <p className="text-gray-600 mt-1">
                      <Link
                        href="/flasher"
                        className="text-blue-600 hover:underline"
                      >
                        웹 플래셔
                      </Link>
                      에서 X3 또는 X4 스토어 펌웨어를 직접 플래시할 수 있습니다.
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900">방법 2: SD카드 업데이트</h3>
                    <p className="text-gray-600 mt-1">
                      위에서 다운로드 받은 스토어 펌웨어 파일을 SD카드에
                      복사한 뒤,{" "}
                      <strong>설정 → 시스템 → SD카드 펌웨어 업데이트</strong>
                      에서 해당 파일을 선택하면 자동으로 플래싱됩니다.
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900">방법 3: 외부 웹 플래셔</h3>
                    <p className="text-gray-600 mt-1">
                      <a
                        href="https://xteink.dve.al/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        xteink.dve.al
                      </a>
                      에서 공식 펌웨어를 플래시합니다.
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
