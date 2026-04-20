import { UNICODE_RANGES } from "../unicode-range";
import type { QuickPreset } from "./types";

// No upper bound on input file size — WASM heap grows on demand, conversion
// runs off-thread in a Web Worker, and the browser's own memory is the only ceiling.
export const MAX_FONT_SIZE = Number.POSITIVE_INFINITY;

export const RANGE_CATEGORIES = Array.from(
  new Set(UNICODE_RANGES.map((r) => r.category)),
);

export const DEFAULT_ENABLED_RANGES = UNICODE_RANGES.filter(
  (r) => r.defaultEnabled,
).map((r) => r.id);

export const QUICK_PRESETS: QuickPreset[] = [
  {
    id: "all",
    name: "전체",
    description: "모든 유니코드 범위 - 매우 큼 (10만자 이상)",
    rangeIds: UNICODE_RANGES.map((r) => r.id),
  },
  {
    id: "korean",
    name: "한국어",
    description: "한글 음절, 자모, 호환 자모, CJK 기호, 원문자",
    rangeIds: [
      "hangulSyllables",
      "hangulJamo",
      "hangulCompatJamo",
      "cjkSymbols",
      "enclosedCjkLetters",
    ],
  },
  {
    id: "hanja",
    name: "한자 (기본)",
    description: "CJK 통합 한자 (20,992자)",
    rangeIds: ["cjkUnified", "cjkSymbols", "kangxiRadicals"],
  },
  {
    id: "hanjaExtended",
    name: "한자 (확장)",
    description: "CJK 한자 + 확장 A~H (약 9만자) - Very Large!",
    rangeIds: [
      "cjkUnified",
      "cjkExtensionA",
      "cjkExtensionB",
      "cjkExtensionC",
      "cjkExtensionD",
      "cjkExtensionE",
      "cjkExtensionF",
      "cjkExtensionG",
      "cjkExtensionH",
      "cjkCompatIdeographs",
      "cjkCompatIdeographsSupplement",
      "cjkSymbols",
      "kangxiRadicals",
      "cjkRadicalsSupplement",
    ],
  },
  {
    id: "japanese",
    name: "日本語",
    description: "히라가나, 가타카나, CJK 기호",
    rangeIds: [
      "hiragana",
      "katakana",
      "katakanaPhonetic",
      "cjkSymbols",
      "halfwidthFullwidth",
    ],
  },
  {
    id: "chinese",
    name: "中文",
    description: "CJK 통합 한자, 기호, 병음",
    rangeIds: [
      "cjkUnified",
      "cjkSymbols",
      "cjkCompatIdeographs",
      "halfwidthFullwidth",
    ],
  },
  {
    id: "fullwidth",
    name: "전각 문자",
    description: "전각/반각 폼, CJK 기호",
    rangeIds: ["halfwidthFullwidth", "cjkSymbols", "cjkCompatibility"],
  },
  {
    id: "publishing",
    name: "출판/문서",
    description: "원문자, 위/아래첨자, 단위기호, 세로쓰기",
    rangeIds: [
      "superscriptsSubscripts",
      "enclosedAlphanumerics",
      "enclosedCjkLetters",
      "cjkCompatibility",
      "smallFormVariants",
      "verticalForms",
      "numberForms",
      "letterlikeSymbols",
    ],
  },
  {
    id: "math",
    name: "수학 기호",
    description: "수학 연산자, 그리스어, 수학 알파벳",
    rangeIds: [
      "greek",
      "greekExtended",
      "numberForms",
      "letterlikeSymbols",
      "miscTechnical",
      "mathAlphanumericSymbols",
      "supplementalMathOperators",
      "miscMathSymbolsA",
      "miscMathSymbolsB",
      "supplementalArrows",
    ],
  },
  {
    id: "symbols",
    name: "특수 문자",
    description: "기호, 딩뱃, 도형, 박스 그리기",
    rangeIds: [
      "miscSymbols",
      "dingbats",
      "geometricShapes",
      "boxDrawing",
      "blockElements",
    ],
  },
  {
    id: "european",
    name: "유럽어 확장",
    description: "라틴 확장, 그리스어, 키릴 확장",
    rangeIds: [
      "latinExtendedB",
      "latinExtendedC",
      "latinExtendedD",
      "latinExtendedE",
      "latinExtendedAdditional",
      "greek",
      "greekExtended",
      "cyrillicSupplement",
      "cyrillicExtendedA",
      "cyrillicExtendedB",
      "cyrillicExtendedC",
    ],
  },
  {
    id: "multilingual",
    name: "다국어",
    description: "아랍어, 히브리어, 태국어, 베트남어",
    rangeIds: [
      "arabic",
      "hebrew",
      "thai",
      "latinExtendedAdditional",
    ],
  },
  {
    id: "phonetics",
    name: "음성 기호",
    description: "IPA, 음성 확장, 간격 수정자",
    rangeIds: [
      "ipaExtensions",
      "phoneticExtensions",
      "phoneticExtensionsSupplement",
      "spacingModifierLetters",
    ],
  },
  {
    id: "emoji",
    name: "이모지",
    description: "이모티콘, 픽토그램, 기호",
    rangeIds: [
      "miscSymbolsPictographs",
      "emoticons",
      "transportMapSymbols",
      "supplementalSymbolsPictographs",
      "symbolsExtendedA",
    ],
  },
];

export const PREVIEW_WIDTH = 480;
export const PREVIEW_HEIGHT = 800;

export const DEFAULT_PREVIEW_TEXT = `ABCDEFGabcdefg 0123456789
The quick brown fox jumps over the lazy dog.
한글 테스트: 가나다라마바사아자차카타파하
日本語テスト: あいうえお カキクケコ
中文测试: 你好世界
수학 기호: ∑∫∂√∞±×÷=≠≈
특수 문자: ★☆♠♣♥♦►◄●○■□
화살표: ←→↑↓↔↕⇐⇒⇑⇓`;
