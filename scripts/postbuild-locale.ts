#!/usr/bin/env bun
/**
 * 정적 export 후 한국어(기본 로케일)를 root에 노출시키기 위한 후처리.
 *
 * Before:
 *   out/ko/install/index.html
 *   out/en/install/index.html
 *
 * After:
 *   out/install/index.html       (Korean, default)
 *   out/en/install/index.html    (English)
 *
 * 모든 HTML 내 href/src 등에서 "/ko/" prefix를 "/"로 치환합니다.
 * basePath가 설정되어 있으면 "{basePath}/ko/" 도 함께 치환합니다.
 */

import {
  cpSync,
  rmSync,
  existsSync,
  readFileSync,
  writeFileSync,
  readdirSync,
  statSync,
} from "fs";
import { join } from "path";

const OUT_DIR = join(process.cwd(), "out");
const KO_DIR = join(OUT_DIR, "ko");
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

if (!existsSync(KO_DIR)) {
  console.warn(`[postbuild-locale] ${KO_DIR} 가 없어 스킵합니다.`);
  process.exit(0);
}

console.log("[postbuild-locale] Korean(ko)를 root로 이동...");
cpSync(KO_DIR, OUT_DIR, { recursive: true, force: true });
rmSync(KO_DIR, { recursive: true, force: true });

const koPrefixWithBase = `${BASE_PATH}/ko/`;
const koPrefixPlain = "/ko/";

function rewrite(html: string): string {
  // 1) basePath 포함된 prefix 우선 치환 (있을 경우)
  let out = html;
  if (BASE_PATH) {
    out = out.split(koPrefixWithBase).join(`${BASE_PATH}/`);
  }
  // 2) plain "/ko/" 경로 치환
  out = out.split(koPrefixPlain).join("/");
  // 3) 끝이 "/ko" (e.g. <link rel="alternate" hreflang="ko" href="/ko" />) 처리
  //    "/ko\""만 정확히 매칭
  out = out.replace(/(\/ko)(?=["?#&\s/])/g, "/");
  return out;
}

function walk(dir: string): string[] {
  const entries: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      entries.push(...walk(full));
    } else if (entry.endsWith(".html") || entry.endsWith(".txt")) {
      entries.push(full);
    }
  }
  return entries;
}

const files = walk(OUT_DIR);
let touched = 0;
for (const file of files) {
  const original = readFileSync(file, "utf-8");
  const updated = rewrite(original);
  if (updated !== original) {
    writeFileSync(file, updated);
    touched += 1;
  }
}

console.log(
  `[postbuild-locale] 완료: ${files.length}개 파일 검사, ${touched}개 수정`,
);
