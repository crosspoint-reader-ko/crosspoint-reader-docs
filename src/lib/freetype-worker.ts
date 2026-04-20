/// <reference lib="webworker" />

import type { FreeTypeInstance, FreeTypeInit, GlyphInfo } from "@/types/freetype";
import type {
  WorkerConvertRequest,
  WorkerGlyph,
  WorkerResult,
} from "./freetype-worker-client";

declare const self: DedicatedWorkerGlobalScope;

let ft: FreeTypeInstance | null = null;
let wasmBase = "/wasm/";

const BATCH_SIZE = 256;

async function ensureFreeType(): Promise<FreeTypeInstance> {
  if (ft) return ft;
  const jsUrl = `${self.location.origin}${wasmBase}freetype.js`;
  const mod = (await import(/* webpackIgnore: true */ jsUrl)) as {
    default: FreeTypeInit;
  };
  // Start the WASM heap at 128MB. Emscripten's emscripten_resize_heap is
  // compiled in, so it'll grow up to ~2GB on demand — but pre-sizing avoids
  // the re-allocation pauses during large font conversions.
  const init = mod.default as unknown as (
    opts: Record<string, unknown>,
  ) => Promise<FreeTypeInstance>;
  ft = await init({
    locateFile: (p: string) => `${self.location.origin}${wasmBase}${p}`,
    INITIAL_MEMORY: 256 * 1024 * 1024,
  });
  return ft;
}

function shouldRenderPixel(
  data: Uint8ClampedArray,
  idx: number,
  threshold: number,
): boolean {
  const r = data[idx];
  const g = data[idx + 1];
  const b = data[idx + 2];
  const a = data[idx + 3];
  if (a > threshold) return true;
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  if (a > threshold / 4 && lum < 255 - threshold) return true;
  return false;
}

function extractGrayscale(
  imagedata: ImageData,
  width: number,
  height: number,
  threshold: number,
): number[] {
  const out: number[] = [];
  const data = imagedata.data;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      if (shouldRenderPixel(data, idx, threshold)) {
        out.push(Math.min(255, data[idx + 3]));
      } else {
        out.push(0);
      }
    }
  }
  return out;
}

function convertTo2bit(gray: number[], width: number, height: number): Uint8Array {
  const total = width * height;
  const out = new Uint8Array(Math.ceil(total / 4));
  for (let i = 0; i < total; i++) {
    const v = gray[i];
    const level = v >= 192 ? 3 : v >= 128 ? 2 : v >= 64 ? 1 : 0;
    const byte = Math.floor(i / 4);
    const pos = (3 - (i % 4)) * 2;
    out[byte] |= level << pos;
  }
  return out;
}

function convertTo1bit(gray: number[], width: number, height: number): Uint8Array {
  const total = width * height;
  const out = new Uint8Array(Math.ceil(total / 8));
  for (let i = 0; i < total; i++) {
    if (gray[i] >= 128) {
      const byte = Math.floor(i / 8);
      const pos = 7 - (i % 8);
      out[byte] |= 1 << pos;
    }
  }
  return out;
}

async function convert(req: WorkerConvertRequest): Promise<WorkerResult> {
  const inst = await ensureFreeType();
  const {
    fontData,
    fontSize,
    is2Bit,
    antialiasing,
    codePoints,
    charSpacing,
    horizontalScale,
    baselineShift,
  } = req;

  const threshold = antialiasing ? 127 : 1;

  self.postMessage({ type: "progress", progress: 1, message: "Loading font..." });
  const faces = inst.LoadFontFromBytes(fontData);
  if (!faces || faces.length === 0) throw new Error("No font faces found");
  const active = faces[0];

  inst.SetFont(active.family_name, active.style_name);
  inst.SetPixelSize(0, fontSize);

  self.postMessage({
    type: "progress",
    progress: 5,
    message: `Preparing ${codePoints.length.toLocaleString()} code points...`,
  });

  const calcAdvance = (base: number) =>
    Math.round((base + charSpacing) * (horizontalScale / 100));

  const collected: WorkerGlyph[] = [];
  let processed = 0;

  function processOne(cp: number, gi: GlyphInfo) {
    const bm = gi.bitmap;
    if (!bm || bm.width <= 0 || bm.rows <= 0) {
      collected.push({
        codePoint: cp,
        width: 0,
        height: 0,
        advanceX: calcAdvance(Math.round(gi.advance?.x / 64) || 0),
        left: 0,
        top: 0,
        data: new Uint8Array(0),
      });
      return;
    }

    let gray: number[];
    if (bm.imagedata) {
      gray = extractGrayscale(bm.imagedata, bm.width, bm.rows, threshold);
    } else if (bm.buffer) {
      gray = Array.from(bm.buffer);
    } else {
      return;
    }

    const packed = is2Bit
      ? convertTo2bit(gray, bm.width, bm.rows)
      : convertTo1bit(gray, bm.width, bm.rows);

    const baseAdvance = Math.round(gi.advance?.x / 64) || bm.width;
    collected.push({
      codePoint: cp,
      width: bm.width,
      height: bm.rows,
      advanceX: calcAdvance(baseAdvance),
      left: gi.bitmap_left || 0,
      top: (gi.bitmap_top || 0) + baselineShift,
      data: packed,
    });
  }

  const loadFlags = inst.FT_LOAD_RENDER | inst.FT_LOAD_TARGET_NORMAL;

  for (let i = 0; i < codePoints.length; i += BATCH_SIZE) {
    const batch = codePoints.slice(i, i + BATCH_SIZE);
    try {
      const map = inst.LoadGlyphs(batch, loadFlags);
      for (const [cp, gi] of map.entries()) processOne(cp, gi);
    } catch {
      for (const cp of batch) {
        try {
          const map = inst.LoadGlyphs([cp], loadFlags);
          const gi = map.get(cp);
          if (gi) processOne(cp, gi);
        } catch {
          // skip
        }
      }
    }
    processed += batch.length;
    const pct = 5 + (processed / codePoints.length) * 75;
    self.postMessage({
      type: "progress",
      progress: pct,
      message: `Processing glyphs ${processed.toLocaleString()}/${codePoints.length.toLocaleString()}`,
    });
  }

  const sm = active.size;
  const metrics = {
    ascender: sm?.ascender ? Math.ceil(sm.ascender / 64) : 0,
    descender: sm?.descender ? Math.floor(sm.descender / 64) : 0,
    height: sm?.height ? Math.ceil(sm.height / 64) : 0,
  };

  return { glyphs: collected, metrics };
}

self.onmessage = async (ev: MessageEvent) => {
  const msg = ev.data;
  if (msg?.type === "init") {
    wasmBase = msg.wasmBase || wasmBase;
    return;
  }
  if (msg?.type === "convert") {
    try {
      const result = await convert(msg.req as WorkerConvertRequest);
      const transfers = result.glyphs.map((g) => g.data.buffer);
      self.postMessage({ type: "done", result }, transfers);
    } catch (err) {
      self.postMessage({
        type: "error",
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }
};
