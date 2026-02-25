import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const ROOT_DIR = join(import.meta.dirname, "..");
const PLATFORMIO_PATH = join(ROOT_DIR, "crosspoint-reader-ko", "platformio.ini");
const VERSION_TS_PATH = join(ROOT_DIR, "src", "constants", "version.ts");

function extractVersion(): string {
  try {
    const content = readFileSync(PLATFORMIO_PATH, "utf-8");
    // [crosspoint] 섹션의 version 키에서 버전 추출
    const match = content.match(/\[crosspoint\]\s*\n\s*version\s*=\s*(.+)/);
    if (match && match[1]) {
      return match[1].trim();
    }
    throw new Error("Version not found in platformio.ini [crosspoint] section");
  } catch (error) {
    console.error("Error reading platformio.ini:", error);
    process.exit(1);
  }
}

function updateVersionFile(version: string): void {
  const content = `// 이 파일은 빌드 시 scripts/update-version.ts에 의해 자동 생성됩니다.
// crosspoint-reader-ko/platformio.ini에서 버전 정보를 가져옵니다.
export const CROSSPOINT_VERSION = "${version}";

// 펌웨어 파일명 생성 헬퍼
export const getFirmwareFilename = () => \`CrossPoint-\${CROSSPOINT_VERSION}.bin\`;

// GitHub 릴리즈 직접 다운로드 URL
export const getFirmwareDownloadUrl = () =>
  \`https://github.com/crosspoint-reader-ko/crosspoint-reader-ko/releases/download/v\${CROSSPOINT_VERSION}/\${getFirmwareFilename()}\`;
`;

  writeFileSync(VERSION_TS_PATH, content, "utf-8");
  console.log(`✅ Version updated to: ${version}`);
}

const version = extractVersion();
updateVersionFile(version);
