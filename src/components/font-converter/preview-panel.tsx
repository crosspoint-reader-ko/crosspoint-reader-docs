"use client";

import { forwardRef } from "react";
import { PREVIEW_HEIGHT, PREVIEW_WIDTH } from "./constants";

interface PreviewPanelProps {
  fontData: Uint8Array | null;
  previewBgColor: string;
  previewFgColor: string;
  previewScale: number;
  antialiasing: boolean;
  onBgColorChange: (color: string) => void;
  onFgColorChange: (color: string) => void;
  onScaleChange: (updater: (s: number) => number) => void;
  onPresetColors: (bg: string, fg: string) => void;
}

export const PreviewPanel = forwardRef<HTMLCanvasElement, PreviewPanelProps>(
  function PreviewPanel(
    {
      fontData,
      previewBgColor,
      previewFgColor,
      previewScale,
      antialiasing,
      onBgColorChange,
      onFgColorChange,
      onScaleChange,
      onPresetColors,
    },
    ref,
  ) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            미리보기 ({PREVIEW_WIDTH}x{PREVIEW_HEIGHT})
          </h2>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-600 dark:text-gray-400">
                BG:
              </label>
              <input
                type="color"
                value={previewBgColor}
                onChange={(e) => onBgColorChange(e.target.value)}
                className="w-6 h-6 rounded cursor-pointer"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-600 dark:text-gray-400">
                FG:
              </label>
              <input
                type="color"
                value={previewFgColor}
                onChange={(e) => onFgColorChange(e.target.value)}
                className="w-6 h-6 rounded cursor-pointer"
              />
            </div>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => onPresetColors("#ffffff", "#000000")}
                className="text-xs px-2 py-1 bg-white text-black border rounded"
                title="White paper"
              >
                W
              </button>
              <button
                type="button"
                onClick={() => onPresetColors("#f5f5dc", "#000000")}
                className="text-xs px-2 py-1 bg-[#f5f5dc] text-black border rounded"
                title="Cream paper"
              >
                C
              </button>
              <button
                type="button"
                onClick={() => onPresetColors("#000000", "#ffffff")}
                className="text-xs px-2 py-1 bg-black text-white border rounded"
                title="Dark mode"
              >
                D
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onScaleChange((s) => Math.max(0.25, s - 0.25))}
                className="px-2 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                -
              </button>
              <span className="text-xs text-gray-600 dark:text-gray-400 min-w-[3rem] text-center">
                {Math.round(previewScale * 100)}%
              </span>
              <button
                type="button"
                onClick={() => onScaleChange((s) => Math.min(2, s + 0.25))}
                className="px-2 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-center bg-gray-100 dark:bg-gray-900 rounded-lg p-4">
          <div
            className="relative"
            style={{
              transform: `scale(${previewScale})`,
              transformOrigin: "top center",
            }}
          >
            <canvas
              ref={ref}
              width={PREVIEW_WIDTH}
              height={PREVIEW_HEIGHT}
              className="border border-gray-300 dark:border-gray-600 shadow-lg bg-white"
              style={{
                imageRendering: antialiasing ? "auto" : "pixelated",
              }}
            />
            {!fontData && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500 pointer-events-none">
                <p className="text-lg">
                  폰트를 로드하면 미리보기가 표시됩니다
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
          <span className="inline-flex items-center gap-1">
            <span
              className="w-3 h-3 rounded"
              style={{ backgroundColor: "rgb(200, 100, 100)" }}
            ></span>
            선택한 유니코드 범위에 포함되지 않은 문자 (변환되지 않음)
          </span>
        </div>
      </div>
    );
  },
);
