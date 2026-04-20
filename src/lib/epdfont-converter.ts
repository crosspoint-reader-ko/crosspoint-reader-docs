import type {
  ConversionOptions,
  ConversionResult,
  GlyphProps,
  UnicodeInterval,
} from "@/types/epdfont";
import { convertInWorker, type WorkerProgress } from "./freetype-worker-client";

const EPDFONT_MAGIC = 0x46445045;
const EPDFONT_VERSION = 1;

const DEFAULT_INTERVALS: UnicodeInterval[] = [
  { start: 0x0021, end: 0x007e },
  { start: 0x00a1, end: 0x00ff },
  { start: 0x0100, end: 0x017f },
  { start: 0x2010, end: 0x2027 },
  { start: 0x20a0, end: 0x20cf },
  { start: 0x0400, end: 0x04ff },
  { start: 0x2200, end: 0x22ff },
  { start: 0x2190, end: 0x21ff },
];

const KOREAN_INTERVALS: UnicodeInterval[] = [
  { start: 0xac00, end: 0xd7af },
  { start: 0x1100, end: 0x11ff },
  { start: 0x3130, end: 0x318f },
];

function isInvisibleCharacter(cp: number): boolean {
  if (cp === 0x0009) return true;
  if (cp === 0x000a) return true;
  if (cp === 0x000b) return true;
  if (cp === 0x000c) return true;
  if (cp === 0x000d) return true;
  if (cp >= 0x0000 && cp <= 0x001f) return true;
  if (cp >= 0x007f && cp <= 0x009f) return true;
  if (cp === 0x1680) return true;
  if (cp >= 0x2000 && cp <= 0x200a) return true;
  if (cp === 0x2028) return true;
  if (cp === 0x2029) return true;
  if (cp === 0x202f) return true;
  if (cp === 0x205f) return true;
  if (cp === 0x200b) return true;
  if (cp === 0x200c) return true;
  if (cp === 0x200d) return true;
  if (cp === 0x2060) return true;
  if (cp === 0xfeff) return true;
  if (cp === 0x00ad) return true;
  return false;
}

function mergeIntervals(intervals: UnicodeInterval[]): UnicodeInterval[] {
  if (intervals.length === 0) return [];
  const sorted = [...intervals].sort((a, b) => a.start - b.start);
  const merged: UnicodeInterval[] = [{ ...sorted[0] }];
  for (let i = 1; i < sorted.length; i++) {
    const cur = sorted[i];
    const last = merged[merged.length - 1];
    if (cur.start <= last.end + 1) {
      last.end = Math.max(last.end, cur.end);
    } else {
      merged.push({ ...cur });
    }
  }
  return merged;
}

function writeEPDFontBinary(
  intervals: Array<{ start: number; end: number }>,
  glyphs: Array<{ glyph: GlyphProps; data: Uint8Array }>,
  advanceY: number,
  ascender: number,
  descender: number,
  is2Bit: boolean,
): Uint8Array {
  const headerSize = 32;
  const intervalsSize = intervals.length * 12;
  const glyphsSize = glyphs.length * 16;
  const intervalsOffset = headerSize;
  const glyphsOffset = intervalsOffset + intervalsSize;
  const bitmapOffset = glyphsOffset + glyphsSize;

  let totalBitmapSize = 0;
  for (const { data } of glyphs) totalBitmapSize += data.length;

  const totalSize = bitmapOffset + totalBitmapSize;
  const buffer = new ArrayBuffer(totalSize);
  const view = new DataView(buffer);
  const u8 = new Uint8Array(buffer);

  let offset = 0;
  view.setUint32(offset, EPDFONT_MAGIC, true);
  offset += 4;
  view.setUint16(offset, EPDFONT_VERSION, true);
  offset += 2;
  view.setUint8(offset++, is2Bit ? 1 : 0);
  view.setUint8(offset++, 0);
  view.setUint8(offset++, advanceY & 0xff);
  view.setInt8(offset++, ascender & 0xff);
  view.setInt8(offset++, descender & 0xff);
  view.setUint8(offset++, 0);
  view.setUint32(offset, intervals.length, true);
  offset += 4;
  view.setUint32(offset, glyphs.length, true);
  offset += 4;
  view.setUint32(offset, intervalsOffset, true);
  offset += 4;
  view.setUint32(offset, glyphsOffset, true);
  offset += 4;
  view.setUint32(offset, bitmapOffset, true);
  offset += 4;

  let glyphOffset = 0;
  for (const interval of intervals) {
    view.setUint32(offset, interval.start, true);
    offset += 4;
    view.setUint32(offset, interval.end, true);
    offset += 4;
    view.setUint32(offset, glyphOffset, true);
    offset += 4;
    glyphOffset += interval.end - interval.start + 1;
  }

  for (const { glyph } of glyphs) {
    view.setUint8(offset++, glyph.width);
    view.setUint8(offset++, glyph.height);
    view.setUint8(offset++, glyph.advanceX);
    view.setUint8(offset++, 0);
    view.setInt16(offset, glyph.left, true);
    offset += 2;
    view.setInt16(offset, glyph.top, true);
    offset += 2;
    view.setUint32(offset, glyph.dataLength, true);
    offset += 4;
    view.setUint32(offset, glyph.dataOffset, true);
    offset += 4;
  }

  let bitmapPos = bitmapOffset;
  for (const { data } of glyphs) {
    u8.set(data, bitmapPos);
    bitmapPos += data.length;
  }

  return new Uint8Array(buffer);
}

export async function convertTTFToEPDFont(
  fontData: Uint8Array,
  options: ConversionOptions,
): Promise<ConversionResult> {
  const {
    fontSize,
    is2Bit,
    charSpacing = 0,
    lineSpacing = 1.0,
    horizontalScale = 100,
    baselineShift = 0,
    antialiasing = true,
    additionalIntervals,
    includeKorean,
    onProgress,
  } = options;

  try {
    let intervals = [...DEFAULT_INTERVALS];
    if (includeKorean) intervals = [...intervals, ...KOREAN_INTERVALS];
    if (additionalIntervals)
      intervals = [...intervals, ...additionalIntervals];
    const mergedIntervals = mergeIntervals(intervals);

    const codePoints: number[] = [];
    for (const { start, end } of mergedIntervals) {
      for (let cp = start; cp <= end; cp++) {
        if (!isInvisibleCharacter(cp)) codePoints.push(cp);
      }
    }

    const handler = (p: WorkerProgress) => {
      onProgress?.(p.progress, p.message);
    };

    const workerResult = await convertInWorker(
      {
        fontData,
        fontSize,
        is2Bit,
        antialiasing,
        codePoints,
        charSpacing,
        horizontalScale,
        baselineShift,
      },
      handler,
    );

    const validGlyphs = new Map<
      number,
      { glyph: GlyphProps; data: Uint8Array }
    >();
    let totalDataSize = 0;
    for (const g of workerResult.glyphs) {
      validGlyphs.set(g.codePoint, {
        glyph: {
          width: g.width,
          height: g.height,
          advanceX: g.advanceX,
          left: g.left,
          top: g.top,
          dataLength: g.data.length,
          dataOffset: totalDataSize,
          codePoint: g.codePoint,
        },
        data: g.data,
      });
      totalDataSize += g.data.length;
    }

    onProgress?.(85, "Building intervals...");

    const sortedCodes = Array.from(validGlyphs.keys()).sort((a, b) => a - b);
    const validatedIntervals: Array<{ start: number; end: number }> = [];
    if (sortedCodes.length > 0) {
      let rs = sortedCodes[0];
      let re = sortedCodes[0];
      for (let i = 1; i < sortedCodes.length; i++) {
        const c = sortedCodes[i];
        if (c === re + 1) re = c;
        else {
          validatedIntervals.push({ start: rs, end: re });
          rs = c;
          re = c;
        }
      }
      validatedIntervals.push({ start: rs, end: re });
    }

    const orderedGlyphs: Array<{ glyph: GlyphProps; data: Uint8Array }> = [];
    let currentOffset = 0;
    for (const { start, end } of validatedIntervals) {
      for (let cp = start; cp <= end; cp++) {
        const gd = validGlyphs.get(cp);
        if (gd) {
          gd.glyph.dataOffset = currentOffset;
          currentOffset += gd.data.length;
          orderedGlyphs.push(gd);
        } else {
          orderedGlyphs.push({
            glyph: {
              width: 0,
              height: 0,
              advanceX: 0,
              left: 0,
              top: 0,
              dataLength: 0,
              dataOffset: currentOffset,
              codePoint: cp,
            },
            data: new Uint8Array(0),
          });
        }
      }
    }

    onProgress?.(92, "Building binary...");

    const baseAdvanceY = workerResult.metrics.height || fontSize;
    const advanceY = Math.ceil(baseAdvanceY * lineSpacing);
    const ascender =
      workerResult.metrics.ascender || Math.ceil(fontSize * 0.8);
    const descender =
      workerResult.metrics.descender || Math.floor(-fontSize * 0.2);

    const binaryData = writeEPDFontBinary(
      validatedIntervals,
      orderedGlyphs,
      advanceY,
      ascender,
      descender,
      is2Bit,
    );

    onProgress?.(100, "Complete!");

    return {
      success: true,
      data: binaryData,
      glyphCount: orderedGlyphs.length,
      intervalCount: validatedIntervals.length,
      totalSize: binaryData.length,
      advanceY,
      ascender,
      descender,
    };
  } catch (err) {
    console.error("Conversion error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error occurred",
    };
  }
}

export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes)) return "∞";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}
