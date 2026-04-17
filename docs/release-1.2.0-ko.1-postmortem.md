# 1.2.0-ko.1 릴리즈 회고 / 트러블슈팅 정리

날짜: 2026-04-17
영향 범위: 펌웨어 1.2.0-ko.0 사용자 + 한국어 docs 사이트 웹 플래셔

## 한 줄 요약

upstream 1.2.0 머지로 SD 카드 글꼴이 모두 글자 단위로 겹쳐 표시되는 회귀가 발생했고, docs 사이트 웹 플래셔는 GitHub 저장소 이전(개인 → org) 후의 옛 URL 때문에 새 펌웨어를 못 받아 옛 바이너리를 그대로 굽고 있었다. 두 문제 모두 1.2.0-ko.1과 docs 사이트 갱신으로 해결.

## 사건 타임라인

1. **1.2.0-ko.0 (upstream 머지)** — 펌웨어 자체는 빌드 / 배포 성공. 태그 푸시 → GitHub Actions가 펌웨어 바이너리 첨부.
2. **사용자 보고** — 플래시 후 재부팅까지는 잘 되는데 펌웨어 화면 버전이 옛 버전 그대로. 다른 폰트(SD 글꼴)들도 글자가 겹쳐서 나옴.
3. **원인 분리** — 두 가지 별개 버그가 동시에 표면화됨.

## 버그 1 — SD 카드 글꼴 글자 겹침 (펌웨어 회귀)

### 원인

upstream PR [#1168 — Use fixed-point fractional x-advance and kerning](https://github.com/crosspoint-reader/crosspoint-reader/pull/1168)에서 런타임 `EpdGlyph::advanceX`가 다음과 같이 변경됨:

| 시점 | 타입 | 단위 |
|---|---|---|
| ~1.1.1 | `uint8_t` | 정수 픽셀 |
| 1.2.0~ | `uint16_t` | 12.4 fixed-point 픽셀 (`fp4`, 픽셀 × 16) |

렌더러는 `fp4::toPixel(prevAdvance + kern)`로 픽셀 단위로 스냅하도록 바뀌었지만, SD 카드 글꼴 로더(`lib/EpdFont/SdFont.cpp::loadGlyphFromSD`)는 `.epdfont` v1 파일이 여전히 정수 픽셀(`uint8`)로 저장하던 advanceX를 그대로 대입하고 있었음:

```cpp
// 회귀 버전 (1.2.0-ko.0)
outGlyph->advanceX = fileGlyph.advanceX;  // 14를 14 << 4 = 224 대신 14로 대입
```

→ 렌더러가 14를 fp4로 해석해서 (14+8) >> 4 = 1px만 진행 → 모든 글자가 첫 글자 위에 1px씩 겹쳐 그려짐.

KoPub Batang을 비롯한 빌드 내장 글꼴은 영향 없음(컴파일 시 `lib/EpdFont/scripts/fontconvert.py`가 fp4 값으로 변환해 둠). **SD에서 로드되는 사용자 커스텀 글꼴만** 깨짐.

### 수정 (1.2.0-ko.1)

[crosspoint-reader-ko `cdf9514`](https://github.com/crosspoint-reader-ko/crosspoint-reader-ko/commit/cdf9514):

```cpp
// lib/EpdFont/SdFont.cpp::loadGlyphFromSD
outGlyph->advanceX = static_cast<uint16_t>(fileGlyph.advanceX) << fp4::FRAC_BITS;

// lib/EpdFont/SdFont.cpp::getTextDimensions
cursorX += fp4::toPixel(glyph->advanceX);
```

기존 `.epdfont` 파일은 그대로 호환. 사용자가 폰트 재변환할 필요 없음.

### 왜 머지 시점에 못 잡았나

- 머지 충돌 해결은 컴파일 통과만 확인했을 뿐 SD 글꼴 런타임 동작은 검증하지 못함.
- KoPub Batang(빌드 내장)으로 부팅 / 메뉴 / 책 읽기 모두 멀쩡해 보였기 때문에 SD 폰트 경로는 누락됨.
- 향후 머지 후 회귀 체크리스트에 **SD 카드 커스텀 폰트로 책 한 페이지 렌더링** 항목을 추가해야 함.

## 버그 2 — 웹 플래셔가 새 펌웨어를 못 받음

### 원인 A — 옛 GitHub 저장소 URL

저장소가 `eunchurn/crosspoint-reader-ko` → `crosspoint-reader-ko/crosspoint-reader-ko` (org)로 이전됐는데 docs 사이트의 다음 4곳에 옛 경로가 남아있었음:

| 파일 | 라인 |
|------|------|
| `scripts/download-firmware.ts` | 32, 181 |
| `src/lib/github.ts` | 30, 86 |

GitHub API는 redirect를 따르지만 cache/Rate-limit 동작이 다르고, asset의 `browser_download_url`도 옛 경로로 응답될 수 있어 안정적이지 않음.

### 원인 B — 빌드 타이밍

웹 플래셔 펌웨어는 docs 사이트 `prebuild` 단계 (`scripts/download-firmware.ts`)에서 GitHub Releases API로부터 받아 `public/firmware/korean-firmware.bin`에 저장됨. **1.2.0-ko.0 릴리즈 후 docs 사이트를 다시 빌드/배포하지 않았기 때문에 옛 바이너리가 그대로 서빙되고 있었음.**

웹 플래셔는 시리얼로 새 바이너리(라고 생각하지만 실제로는 옛 바이너리)를 정상적으로 굽고 ESP32-C3는 그걸 부팅하므로 "플래싱 잘 되고 재부팅까지 되는데 버전은 그대로"라는 증상이 됨.

### 원인 C — 다운로드 URL의 `v` 접두사

`scripts/update-version.ts`가 생성하던 `getFirmwareDownloadUrl()`이 `releases/download/v${VERSION}/...` 경로를 만들었는데 실제 태그는 `v` 접두사 없는 `1.2.0-ko.0`. 직접 다운로드 링크가 404. (웹 플래셔는 prebuild로 받은 로컬 바이너리를 쓰므로 영향 없었지만, 가이드 페이지의 직접 다운로드 버튼은 깨졌을 것.)

### 수정

| 파일 | 변경 |
|------|------|
| `scripts/download-firmware.ts` | API URL: `eunchurn/...` → `crosspoint-reader-ko/...` |
| `src/lib/github.ts` | 동일 (releases 목록 / latest 조회) |
| `scripts/update-version.ts` | `releases/download/v${VERSION}` → `releases/download/${VERSION}` |
| `font-converter/ttf_to_epdfont.py` | docstring에 fp4 컨벤션 설명 추가 (코드 변경 없음) |
| 서브모듈 `crosspoint-reader-ko` | `1.2.0-ko.1` 커밋으로 업데이트 |

### 배포 절차

1. `bun run scripts/update-version.ts` — `src/constants/version.ts`에 1.2.0-ko.1 반영
2. `bun run scripts/download-firmware.ts` — GitHub Actions가 새 태그용 펌웨어를 첨부 완료한 뒤 실행
3. `bun run build` — Next.js 정적 빌드
4. 배포 (Vercel / GitHub Pages / 호스팅 환경에 맞게)

## 잔여 정리 항목

- **펌웨어 저장소 한국어 fork의 submodule origin URL**: 호스트의 `crosspoint-reader-ko/.git/config`에는 여전히 옛 `git@github.com:eunchurn/crosspoint-reader-ko.git`이 origin으로 잡혀 있음. GitHub redirect로 동작은 하지만 다음 명령으로 정정 권장:
  ```bash
  cd crosspoint-reader-ko
  git remote set-url origin git@github.com:crosspoint-reader-ko/crosspoint-reader-ko.git
  ```
- **머지 회귀 체크리스트**에 SD 글꼴 렌더링 항목 추가 (펌웨어 repo `CLAUDE.md` Mandatory Post-Merge Checks 섹션).

## 참고 자료

- 펌웨어 fp4 정의: [`lib/EpdFont/EpdFontData.h`](https://github.com/crosspoint-reader-ko/crosspoint-reader-ko/blob/release/korean/lib/EpdFont/EpdFontData.h) (namespace `fp4`)
- SD 폰트 포맷 사양: [`docs/sd-font-format.md`](https://github.com/crosspoint-reader-ko/crosspoint-reader-ko/blob/release/korean/docs/sd-font-format.md)
- upstream PR: https://github.com/crosspoint-reader/crosspoint-reader/pull/1168
- 1.2.0-ko.1 릴리즈: https://github.com/crosspoint-reader-ko/crosspoint-reader-ko/releases/tag/1.2.0-ko.1
