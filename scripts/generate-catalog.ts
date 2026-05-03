#!/usr/bin/env bun
/**
 * 빌드 타임에 정적 catalog JSON을 생성합니다 (SSG 환경 호환).
 *
 * 출력: public/catalog (확장자 없음 — 참조 catalog 파일과 동일)
 * 호스팅: https://<site>/catalog
 *
 * 스키마 (참조: CrossInk catalog):
 * {
 *   "schema_version": 1,
 *   "releases": [
 *     {
 *       "id": "stable-1.2.0-ko.15",
 *       "channel": "stable",
 *       "name": "1.2.0-ko.15",
 *       "version": "1.2.0-ko.15",
 *       "released_at": "2026-04-30T07:39:38Z",
 *       "notes": "...",
 *       "firmware_url": "https://github.com/.../firmware.bin",
 *       "firmware_sha256": "...",
 *       "size": 6711xxx,
 *       "supported_devices": ["x4", "x3"]
 *     }
 *   ]
 * }
 *
 * 입력:
 *   - public/firmware/korean-versions.json (download-firmware.ts가 생성)
 *   - public/firmware/crosspoint-{tag}.bin (실제 펌웨어 파일)
 */

import {
  readFileSync,
  writeFileSync,
  existsSync,
  statSync,
} from "fs";
import { createHash } from "crypto";
import { join } from "path";

const ROOT_DIR = join(import.meta.dirname, "..");
const PUBLIC_DIR = join(ROOT_DIR, "public");
const FIRMWARE_DIR = join(PUBLIC_DIR, "firmware");
const VERSIONS_PATH = join(FIRMWARE_DIR, "korean-versions.json");
const OUTPUT_PATH = join(PUBLIC_DIR, "catalog");

const REPO = "crosspoint-reader-ko/crosspoint-reader-ko";
const SUPPORTED_DEVICES = ["x4", "x3"];
const CHANNEL = "stable";
const MAX_RELEASES = 3;

interface KoreanVersionEntry {
  tag_name: string;
  name: string;
  published_at: string;
  filename: string;
}

interface CatalogRelease {
  id: string;
  channel: string;
  name: string;
  version: string;
  released_at: string;
  notes: string;
  firmware_url: string;
  firmware_sha256: string;
  size: number;
  supported_devices: string[];
}

function sha256(filePath: string): string {
  const buf = readFileSync(filePath);
  return createHash("sha256").update(buf).digest("hex");
}

async function main(): Promise<void> {
  if (!existsSync(VERSIONS_PATH)) {
    console.error(`[catalog] ${VERSIONS_PATH} not found. download-firmware.ts 먼저 실행하세요.`);
    process.exit(1);
  }

  const allVersions = JSON.parse(
    readFileSync(VERSIONS_PATH, "utf-8"),
  ) as KoreanVersionEntry[];
  // 최신 N개만 (korean-versions.json은 published_at 내림차순)
  const versions = allVersions.slice(0, MAX_RELEASES);

  console.log(
    `[catalog] 최신 ${versions.length}개 릴리즈로 catalog 생성 중 (전체 ${allVersions.length}개 중)...`,
  );

  const releases: CatalogRelease[] = [];
  for (const v of versions) {
    const binPath = join(FIRMWARE_DIR, v.filename);
    if (!existsSync(binPath)) {
      console.warn(`[catalog] ${v.filename} 없음 — ${v.tag_name} 스킵`);
      continue;
    }
    const size = statSync(binPath).size;
    const hash = sha256(binPath);
    const notes = `CrossPoint Reader KO v${v.tag_name} ${CHANNEL} firmware`;

    releases.push({
      id: `${CHANNEL}-${v.tag_name}`,
      channel: CHANNEL,
      name: v.tag_name,
      version: v.tag_name,
      released_at: v.published_at,
      notes,
      firmware_url: `https://github.com/${REPO}/releases/download/${v.tag_name}/firmware.bin`,
      firmware_sha256: hash,
      size,
      supported_devices: SUPPORTED_DEVICES,
    });

    console.log(
      `   ✅ ${v.tag_name} sha256=${hash.slice(0, 8)}… size=${(size / 1024).toFixed(1)} KB`,
    );
  }

  const catalog = {
    schema_version: 1,
    releases,
  };

  writeFileSync(OUTPUT_PATH, JSON.stringify(catalog, null, 2));
  console.log(
    `\n[catalog] ✅ public/catalog 생성 (${releases.length}개 릴리즈)`,
  );
}

main().catch((err) => {
  console.error("[catalog] 생성 실패:", err);
  process.exit(1);
});
