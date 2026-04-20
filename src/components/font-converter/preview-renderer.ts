import type { FreeTypeInstance } from "@/types/freetype";
import { PREVIEW_HEIGHT, PREVIEW_WIDTH } from "./constants";

export interface RenderPreviewOptions {
  canvas: HTMLCanvasElement;
  ft: FreeTypeInstance;
  fontData: Uint8Array;
  fontSize: number;
  previewText: string;
  previewBgColor: string;
  previewFgColor: string;
  charSpacing: number;
  lineSpacing: number;
  boldness: number;
  italicAngle: number;
  antialiasing: boolean;
  baselineShift: number;
  horizontalScale: number;
  isCodePointInSelectedRanges: (codePoint: number) => boolean;
}

export async function renderPreviewToCanvas(
  opts: RenderPreviewOptions,
): Promise<void> {
  const {
    canvas,
    ft,
    fontData,
    fontSize,
    previewText,
    previewBgColor,
    previewFgColor,
    charSpacing,
    lineSpacing,
    boldness,
    italicAngle,
    antialiasing,
    baselineShift,
    horizontalScale,
    isCodePointInSelectedRanges,
  } = opts;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = previewBgColor;
  ctx.fillRect(0, 0, PREVIEW_WIDTH, PREVIEW_HEIGHT);

  try {
    const faces = ft.LoadFontFromBytes(fontData);
    if (!faces || faces.length === 0) {
      throw new Error("Failed to load font for preview");
    }

    ft.SetFont(faces[0].family_name, faces[0].style_name);
    ft.SetPixelSize(0, fontSize);

    const lineHeight = Math.round(fontSize * lineSpacing);
    let cursorX = 10;
    let cursorY = fontSize + 10;

    const lines = previewText.split("\n");

    const loadFlags = ft.FT_LOAD_RENDER | ft.FT_LOAD_TARGET_NORMAL;

    for (const line of lines) {
      cursorX = 10;
      const chars = Array.from(line);

      for (const char of chars) {
        const codePoint = char.codePointAt(0);
        if (codePoint === undefined) continue;

        const isInRange = isCodePointInSelectedRanges(codePoint);

        const glyphsMap = ft.LoadGlyphs([codePoint], loadFlags);
        const glyph = glyphsMap.get(codePoint);
        if (!glyph) {
          cursorX += fontSize / 2 + charSpacing;
          continue;
        }

        if (glyph.bitmap && glyph.bitmap.imagedata) {
          const imgData = glyph.bitmap.imagedata;
          const width = glyph.bitmap.width;
          const height = glyph.bitmap.rows;

          if (width > 0 && height > 0) {
            const glyphCanvas = document.createElement("canvas");
            glyphCanvas.width = width;
            glyphCanvas.height = height;
            const glyphCtx = glyphCanvas.getContext("2d");

            if (glyphCtx) {
              const imageData = glyphCtx.createImageData(width, height);

              let fgR: number, fgG: number, fgB: number;
              if (isInRange) {
                fgR = parseInt(previewFgColor.slice(1, 3), 16);
                fgG = parseInt(previewFgColor.slice(3, 5), 16);
                fgB = parseInt(previewFgColor.slice(5, 7), 16);
              } else {
                fgR = 200;
                fgG = 100;
                fgB = 100;
              }

              const srcData = imgData.data;
              for (let i = 0; i < srcData.length; i += 4) {
                const alpha = srcData[i + 3];
                const adjustedAlpha = Math.min(255, alpha + boldness * 30);
                const finalAlpha = isInRange
                  ? adjustedAlpha
                  : Math.floor(adjustedAlpha * 0.5);

                imageData.data[i] = fgR;
                imageData.data[i + 1] = fgG;
                imageData.data[i + 2] = fgB;
                imageData.data[i + 3] = antialiasing
                  ? finalAlpha
                  : finalAlpha > 127
                    ? 255
                    : 0;
              }

              glyphCtx.putImageData(imageData, 0, 0);

              const scaledWidth = (width * horizontalScale) / 100;

              ctx.save();

              if (italicAngle !== 0) {
                ctx.transform(
                  1,
                  0,
                  Math.tan((-italicAngle * Math.PI) / 180),
                  1,
                  0,
                  0,
                );
              }

              ctx.drawImage(
                glyphCanvas,
                cursorX + glyph.bitmap_left,
                cursorY - glyph.bitmap_top + baselineShift,
                scaledWidth,
                height,
              );

              ctx.restore();
            }
          }

          const advance = (glyph.advance?.x || fontSize) / 64;
          cursorX += (advance * horizontalScale) / 100 + charSpacing;
        } else {
          cursorX += fontSize / 2 + charSpacing;
        }

        if (cursorX > PREVIEW_WIDTH - 20) {
          cursorX = 10;
          cursorY += lineHeight;
        }
      }

      cursorY += lineHeight;

      if (cursorY > PREVIEW_HEIGHT - 20) break;
    }
  } catch (err) {
    console.error("Preview render error:", err);
    ctx.fillStyle = "#ff0000";
    ctx.font = "14px sans-serif";
    ctx.fillText(
      "Preview error: " + (err instanceof Error ? err.message : "Unknown"),
      10,
      30,
    );
  }
}
