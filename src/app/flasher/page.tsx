"use client";

import React, { useRef, useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FileUpload, { FileUploadHandle } from "@/components/flasher/FileUpload";
import Steps from "@/components/flasher/Steps";
import { useEspOperations } from "@/lib/flasher/useEspOperations";
import {
  getFirmwareVersions,
  FirmwareVersions,
  getKoreanFirmwareReleases,
  KoreanFirmwareRelease,
  getOfficialFirmwareDownloadPath,
} from "@/lib/flasher/firmwareFetcher";

export default function FlasherPage() {
  const { actions, stepData, isRunning } = useEspOperations();
  const fullFlashFileInput = useRef<FileUploadHandle>(null);
  const appPartitionFileInput = useRef<FileUploadHandle>(null);
  const progressSectionRef = useRef<HTMLElement>(null);
  const [versions, setVersions] = useState<FirmwareVersions | null>(null);
  const [koreanReleases, setKoreanReleases] = useState<KoreanFirmwareRelease[]>([]);
  const [selectedKoreanFilename, setSelectedKoreanFilename] = useState<string>("");

  useEffect(() => {
    getFirmwareVersions().then(setVersions);
    getKoreanFirmwareReleases().then((releases) => {
      setKoreanReleases(releases);
      if (releases.length > 0) {
        setSelectedKoreanFilename(releases[0].filename);
      }
    });
  }, []);

  const isDeviceConnected = stepData.some(
    (step) =>
      (step.name === "장치 연결" || step.name.includes("장치 연결")) &&
      step.status === "success",
  );
  const isRestartNeeded = stepData.some(
    (step) => step.name === "장치 재시작" && step.status === "success",
  );
  const hasScrolledRef = useRef(false);
  const prevRunningRef = useRef(false);

  useEffect(() => {
    // 작업 시작(false→true) 시점에 스크롤 플래그를 리셋
    if (isRunning && !prevRunningRef.current) {
      hasScrolledRef.current = false;
    }
    prevRunningRef.current = isRunning;
  }, [isRunning]);

  useEffect(() => {
    if (
      isRunning &&
      isDeviceConnected &&
      !hasScrolledRef.current &&
      progressSectionRef.current
    ) {
      const element = progressSectionRef.current;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - 200;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      hasScrolledRef.current = true;
    }
  }, [isRunning, isDeviceConnected]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              웹 플래셔
            </h1>
            <p className="text-lg text-gray-600">
              CrossPoint Reader 장치에 펌웨어를 직접 플래싱 할 수 있습니다
            </p>
          </div>

          {/* Warning Alert */}
          <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  주의해서 진행하세요
                </h3>
                <div className="mt-2 text-sm text-yellow-700 space-y-2">
                  <p>
                    복구 불가능한 문제가 발생할 확률은 극히 낮지만, 0은 아닙니다.
                    플래싱 전에 <strong>전체 플래시 저장</strong>으로 백업을
                    먼저 받아두세요.
                  </p>
                  <p>
                    <strong>파일에서 전체 플래시 쓰기</strong> 또는{" "}
                    <strong>펌웨어 플래싱</strong>을 시작하면, 작업이 완료될
                    때까지 장치 연결을 해제하거나 탭을 닫지 마세요. 백업에서
                    전체 플래시를 쓰면 항상 이전 상태로 복원할 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Browser Support Info */}
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  브라우저 요구사항
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    이 기능은 WebSerial API를 사용합니다.{" "}
                    <strong>Chrome</strong> 또는 <strong>Edge</strong> 브라우저에서만
                    작동합니다. Safari, Firefox는 지원되지 않습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Full Flash Controls */}
          <section className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              전체 플래시 백업 및 복원
            </h2>
            <div className="text-sm text-gray-600 space-y-2 mb-6">
              <p>
                이 기능들은 Xteink 장치의 전체 백업을 만들어 문제가 발생했을 때
                복원할 수 있도록 합니다.
              </p>
              <p>
                <strong>전체 플래시 저장</strong>은 장치의 플래시를 읽어{" "}
                <em>flash.bin</em>으로 저장합니다. 약 25분 정도 소요됩니다.
                해당 파일(또는 다른 사람의 파일)을{" "}
                <strong>파일에서 전체 플래시 쓰기</strong>로 사용하여 장치의
                전체 플래시를 덮어쓸 수 있습니다.
              </p>
            </div>
            <div className="space-y-4">
              <button
                onClick={actions.saveFullFlash}
                disabled={isRunning}
                className="w-full px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                전체 플래시 저장
              </button>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <FileUpload ref={fullFlashFileInput} disabled={isRunning} />
                </div>
                <button
                  onClick={() =>
                    actions.writeFullFlash(() =>
                      fullFlashFileInput.current?.getFile(),
                    )
                  }
                  disabled={isRunning}
                  className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                >
                  파일에서 전체 플래시 쓰기
                </button>
              </div>
            </div>
          </section>

          {/* OTA Fast Flash Controls */}
          <section className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              OTA 빠른 플래시 제어
            </h2>
            <div className="text-sm text-gray-600 space-y-2 mb-6">
              <p>
                사용하기 전에 위의 <strong>전체 플래시 저장</strong>으로 백업을
                먼저 받아두는 것을 강력히 권장합니다.
              </p>
              <p>
                <strong>펌웨어 플래싱</strong>은 펌웨어를 다운로드하고, 백업
                파티션을 새 펌웨어로 덮어쓴 뒤, 이 파티션으로 전환합니다(기존
                펌웨어는 새 백업이 됩니다). 전체 플래시 쓰기보다 훨씬 빠르며
                모든 설정이 유지됩니다. 문제가 발생해도 다시 실행하면 됩니다.
              </p>
            </div>
            <div className="space-y-4">
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                    한국어 펌웨어 (커뮤니티)
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <select
                      value={selectedKoreanFilename}
                      onChange={(e) => setSelectedKoreanFilename(e.target.value)}
                      disabled={isRunning || koreanReleases.length === 0}
                      className="w-full appearance-none px-4 py-3 pr-10 text-sm font-medium text-gray-900 bg-white border border-blue-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {koreanReleases.length === 0 ? (
                        <option value="">버전 로딩 중...</option>
                      ) : (
                        koreanReleases.map((release, index) => (
                          <option key={release.tag_name} value={release.filename}>
                            {release.tag_name}{index === 0 ? " (최신)" : ""}
                          </option>
                        ))
                      )}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                      </svg>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (selectedKoreanFilename) {
                        const release = koreanReleases.find(r => r.filename === selectedKoreanFilename);
                        actions.flashKoreanFirmwareVersion(selectedKoreanFilename, release?.tag_name ?? "");
                      }
                    }}
                    disabled={isRunning || !selectedKoreanFilename}
                    className="px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                  >
                    플래싱
                  </button>
                </div>
              </div>
              <button
                onClick={actions.flashCrossPointFirmware}
                disabled={isRunning}
                className="w-full px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                CrossPoint 펌웨어 플래싱 (커뮤니티, X3/X4 호환){" "}
                {versions?.crosspoint && (
                  <span className="opacity-75">({versions.crosspoint})</span>
                )}
              </button>

              {/* X4 Store Firmware */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    X4 스토어 펌웨어 (OEM)
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={actions.flashX4ChineseFirmware}
                      disabled={isRunning}
                      className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      중국어 공식 (X4){" "}
                      {versions?.x4ChineseOfficial && (
                        <span className="opacity-75">({versions.x4ChineseOfficial})</span>
                      )}
                    </button>
                    {versions && getOfficialFirmwareDownloadPath("x4-ch", versions) && (
                      <a
                        href={getOfficialFirmwareDownloadPath("x4-ch", versions)!}
                        download
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-3 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap"
                        title={versions.x4ChineseOfficialFile}
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                        다운로드
                      </a>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={actions.flashEnglishFirmware}
                      disabled={isRunning}
                      className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      영어 공식 (X4){" "}
                      {versions?.englishOfficial && (
                        <span className="opacity-75">({versions.englishOfficial})</span>
                      )}
                    </button>
                    {versions && getOfficialFirmwareDownloadPath("x4-en", versions) && (
                      <a
                        href={getOfficialFirmwareDownloadPath("x4-en", versions)!}
                        download
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-3 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap"
                        title={versions.englishOfficialFile}
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                        다운로드
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* X3 Store Firmware */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    X3 스토어 펌웨어 (OEM)
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={actions.flashX3ChineseFirmware}
                    disabled={isRunning}
                    className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    중국어 공식 (X3){" "}
                    {versions?.x3ChineseOfficial && (
                      <span className="opacity-75">({versions.x3ChineseOfficial})</span>
                    )}
                  </button>
                  {versions && getOfficialFirmwareDownloadPath("x3-ch", versions) && (
                    <a
                      href={getOfficialFirmwareDownloadPath("x3-ch", versions)!}
                      download
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-3 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap"
                      title={versions.x3ChineseOfficialFile}
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                      다운로드
                    </a>
                  )}
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  시리얼 넘버가 붙은 X3 패키지는 USB 플래싱이 동작하지 않을 수 있습니다.
                  이 경우 다운로드 버튼으로 받은 펌웨어를 SD 카드에 복사 후
                  <strong> 설정 → 시스템 → SD카드 펌웨어 업데이트</strong>를 사용하세요.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <FileUpload
                    ref={appPartitionFileInput}
                    disabled={isRunning}
                  />
                </div>
                <button
                  onClick={() =>
                    actions.flashCustomFirmware(() =>
                      appPartitionFileInput.current?.getFile(),
                    )
                  }
                  disabled={isRunning}
                  className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                >
                  파일에서 펌웨어 플래싱
                </button>
              </div>
            </div>
          </section>

          {/* Steps Progress */}
          <section
            ref={progressSectionRef}
            className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              진행 상황
            </h2>
            {stepData.length > 0 ? (
              <Steps steps={stepData} />
            ) : (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-blue-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      작업을 시작하면 여기에 진행 상황이 표시됩니다
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Device Restart Instructions */}
          <div
            className={`p-4 rounded-lg transition-all duration-500 ${
              isRestartNeeded
                ? "bg-green-50 border-2 border-green-500 shadow-lg shadow-green-100 ring-2 ring-green-300 ring-offset-2"
                : "bg-blue-50 border border-blue-200"
            }`}
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className={`h-5 w-5 ${isRestartNeeded ? "text-green-500" : "text-blue-400"}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  {isRestartNeeded ? (
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  ) : (
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  )}
                </svg>
              </div>
              <div className="ml-3">
                <h3
                  className={`text-sm font-medium ${
                    isRestartNeeded ? "text-green-800" : "text-blue-800"
                  }`}
                >
                  {isRestartNeeded
                    ? "플래싱 완료!"
                    : "장치 재시작 안내"}
                </h3>
                <div
                  className={`mt-2 text-sm ${
                    isRestartNeeded ? "text-green-700" : "text-blue-700"
                  }`}
                >
                  <p className={isRestartNeeded ? "font-medium" : ""}>
                    {isRestartNeeded
                      ? "장치가 자동으로 재시작됩니다. 만약 재시작이 안 되면 오른쪽 하단의 리셋 버튼을 눌렀다 떼고, 전원 버튼을 1초 눌러 수동으로 재시작하세요."
                      : "플래싱이 완료되면 장치가 자동으로 재시작됩니다. 자동 재시작이 안 될 경우, 오른쪽 하단의 리셋 버튼을 눌렀다 떼고 메인 전원 버튼을 약 1초간 길게 눌러 수동으로 재시작하세요."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Powered by */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              <a
                href="https://xteink.dve.al/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
              >
                Official Xteink Flasher
              </a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
