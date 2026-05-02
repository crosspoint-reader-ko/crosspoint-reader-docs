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

// Preset structure (id + rangeIds). Visible name/description come from i18n
// (fontConverter.presets.items.<id>.name/description).
export const QUICK_PRESETS: QuickPreset[] = [
  {
    id: "all",
    rangeIds: UNICODE_RANGES.map((r) => r.id),
  },
  {
    id: "korean",
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
    rangeIds: ["cjkUnified", "cjkSymbols", "kangxiRadicals"],
  },
  {
    id: "hanjaExtended",
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
    rangeIds: [
      "cjkUnified",
      "cjkSymbols",
      "cjkCompatIdeographs",
      "halfwidthFullwidth",
    ],
  },
  {
    id: "fullwidth",
    rangeIds: ["halfwidthFullwidth", "cjkSymbols", "cjkCompatibility"],
  },
  {
    id: "publishing",
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
    rangeIds: [
      "arabic",
      "hebrew",
      "thai",
      "latinExtendedAdditional",
    ],
  },
  {
    id: "phonetics",
    rangeIds: [
      "ipaExtensions",
      "phoneticExtensions",
      "phoneticExtensionsSupplement",
      "spacingModifierLetters",
    ],
  },
  {
    id: "emoji",
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
