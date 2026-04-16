// 이 파일은 빌드 시 scripts/update-version.ts에 의해 자동 생성됩니다.
// crosspoint-reader-ko/platformio.ini에서 버전 정보를 가져옵니다.
export const CROSSPOINT_VERSION = "1.2.0-ko.0";

// 펌웨어 파일명 생성 헬퍼
export const getFirmwareFilename = () => `CrossPoint-${CROSSPOINT_VERSION}.bin`;

// GitHub 릴리즈 직접 다운로드 URL
export const getFirmwareDownloadUrl = () =>
  `https://github.com/crosspoint-reader-ko/crosspoint-reader-ko/releases/download/v${CROSSPOINT_VERSION}/${getFirmwareFilename()}`;
