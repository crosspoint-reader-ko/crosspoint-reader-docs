"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { convertTTFToEPDFont, formatFileSize } from "@/lib/epdfont-converter";
import { loadFreeType } from "@/lib/freetype-loader";
import type { UnicodeInterval } from "@/types/epdfont";
import type { FreeTypeFace, FreeTypeInstance } from "@/types/freetype";
import { UNICODE_RANGES } from "../unicode-range";
import {
  DEFAULT_ENABLED_RANGES,
  DEFAULT_PREVIEW_TEXT,
  MAX_FONT_SIZE,
  QUICK_PRESETS,
} from "./constants";
import { ConversionProgress, ConversionResult } from "./conversion-result";
import { CustomIntervals } from "./custom-intervals";
import { FontSettings } from "./font-settings";
import { FontUploader } from "./font-uploader";
import { PreviewPanel } from "./preview-panel";
import { renderPreviewToCanvas } from "./preview-renderer";
import { QuickPresets } from "./quick-presets";
import { RenderingOptions } from "./rendering-options";
import type { ConversionState, FontInfo } from "./types";
import { UnicodeRangeSelector } from "./unicode-range-selector";

export default function FontConverter() {
  const [fontFile, setFontFile] = useState<File | null>(null);
  const [fontData, setFontData] = useState<Uint8Array | null>(null);
  const [fontInfo, setFontInfo] = useState<FontInfo | null>(null);
  const [fontName, setFontName] = useState("");
  const [fontSize, setFontSize] = useState(28);
  const [is2Bit, setIs2Bit] = useState(true);
  const [selectedRanges, setSelectedRanges] = useState<string[]>(
    DEFAULT_ENABLED_RANGES,
  );
  const [customInterval, setCustomInterval] = useState({ start: "", end: "" });
  const [customIntervals, setCustomIntervals] = useState<UnicodeInterval[]>([]);
  const [collapsedCategories, setCollapsedCategories] = useState<string[]>([]);
  const [isUnicodeRangesOpen, setIsUnicodeRangesOpen] = useState(false);
  const [conversionState, setConversionState] = useState<ConversionState>({
    status: "idle",
    progress: 0,
    message: "",
  });
  const [freetypeLoaded, setFreetypeLoaded] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const [charSpacing, setCharSpacing] = useState(0);
  const [lineSpacing, setLineSpacing] = useState(1.2);
  const [boldness, setBoldness] = useState(0);
  const [italicAngle, setItalicAngle] = useState(0);
  const [antialiasing, setAntialiasing] = useState(true);
  const [baselineShift, setBaselineShift] = useState(0);
  const [horizontalScale, setHorizontalScale] = useState(100);

  const [previewText, setPreviewText] = useState(DEFAULT_PREVIEW_TEXT);
  const [previewBgColor, setPreviewBgColor] = useState("#ffffff");
  const [previewFgColor, setPreviewFgColor] = useState("#000000");
  const [previewScale, setPreviewScale] = useState(1);

  const [isDragging, setIsDragging] = useState(false);

  const freetypeRef = useRef<FreeTypeInstance | null>(null);
  const activeFontRef = useRef<FreeTypeFace | null>(null);
  const downloadRef = useRef<HTMLAnchorElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadFreeType()
      .then((ft) => {
        freetypeRef.current = ft;
        setFreetypeLoaded(true);
      })
      .catch((err) => {
        console.error("Failed to load FreeType:", err);
        setConversionState({
          status: "error",
          progress: 0,
          message: "Failed to load FreeType WASM library",
        });
      });
  }, []);

  const validateFont = useCallback(async (file: File): Promise<FontInfo> => {
    if (Number.isFinite(MAX_FONT_SIZE) && file.size > MAX_FONT_SIZE) {
      return {
        familyName: "",
        styleName: "",
        numGlyphs: 0,
        fileSize: file.size,
        isValid: false,
        error: `Font file is too large (${formatFileSize(file.size)}).`,
      };
    }

    const ext = file.name.toLowerCase().split(".").pop();
    if (!["ttf", "otf", "woff", "woff2"].includes(ext || "")) {
      return {
        familyName: "",
        styleName: "",
        numGlyphs: 0,
        fileSize: file.size,
        isValid: false,
        error: "Unsupported font format. Please use TTF, OTF, WOFF, or WOFF2.",
      };
    }

    if (!freetypeRef.current) {
      return {
        familyName: "",
        styleName: "",
        numGlyphs: 0,
        fileSize: file.size,
        isValid: false,
        error: "FreeType library not loaded yet.",
      };
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);

      const faces = freetypeRef.current.LoadFontFromBytes(data);

      if (!faces || faces.length === 0) {
        return {
          familyName: "",
          styleName: "",
          numGlyphs: 0,
          fileSize: file.size,
          isValid: false,
          error: "Could not find any font faces in the file.",
        };
      }

      const face = faces[0];
      activeFontRef.current = face;

      setFontData(data);

      return {
        familyName: face.family_name || "Unknown",
        styleName: face.style_name || "Regular",
        numGlyphs: face.num_glyphs || 0,
        fileSize: file.size,
        isValid: true,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";

      if (errorMessage.includes("OOM") || errorMessage.includes("memory")) {
        return {
          familyName: "",
          styleName: "",
          numGlyphs: 0,
          fileSize: file.size,
          isValid: false,
          error: `Font file is too complex and caused a memory error. Try a simpler font or a smaller file size (current: ${formatFileSize(file.size)}).`,
        };
      }

      return {
        familyName: "",
        styleName: "",
        numGlyphs: 0,
        fileSize: file.size,
        isValid: false,
        error: `Failed to parse font: ${errorMessage}`,
      };
    }
  }, []);

  const processFile = useCallback(
    async (file: File) => {
      setFontFile(file);
      setFontInfo(null);
      setFontData(null);
      activeFontRef.current = null;
      setConversionState({ status: "idle", progress: 0, message: "" });

      const name = file.name.replace(/\.(ttf|otf|woff|woff2)$/i, "");
      setFontName(name);

      setIsValidating(true);
      const info = await validateFont(file);
      setFontInfo(info);
      setIsValidating(false);

      if (info.isValid && info.familyName) {
        setFontName(info.familyName);
      }
    },
    [validateFont],
  );

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      await processFile(file);
    },
    [processFile],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      dropZoneRef.current &&
      !dropZoneRef.current.contains(e.relatedTarget as Node)
    ) {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (!freetypeLoaded) return;

      const file = e.dataTransfer.files?.[0];
      if (!file) return;

      const ext = file.name.toLowerCase().split(".").pop();
      if (!["ttf", "otf", "woff", "woff2"].includes(ext || "")) {
        setConversionState({
          status: "error",
          progress: 0,
          message:
            "지원하지 않는 파일 형식입니다. TTF, OTF, WOFF, WOFF2 파일만 사용 가능합니다.",
        });
        return;
      }

      await processFile(file);
    },
    [freetypeLoaded, processFile],
  );

  const handleRangeToggle = useCallback((rangeId: string) => {
    setSelectedRanges((prev) =>
      prev.includes(rangeId)
        ? prev.filter((id) => id !== rangeId)
        : [...prev, rangeId],
    );
  }, []);

  const handleCategoryToggle = useCallback((category: string) => {
    const categoryRangeIds = UNICODE_RANGES.filter(
      (r) => r.category === category,
    ).map((r) => r.id);

    setSelectedRanges((prev) => {
      const allSelected = categoryRangeIds.every((id) => prev.includes(id));
      if (allSelected) {
        return prev.filter((id) => !categoryRangeIds.includes(id));
      } else {
        return [...new Set([...prev, ...categoryRangeIds])];
      }
    });
  }, []);

  const handleCategoryCollapse = useCallback((category: string) => {
    setCollapsedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedRanges(UNICODE_RANGES.map((r) => r.id));
  }, []);

  const handleDeselectAll = useCallback(() => {
    setSelectedRanges([]);
  }, []);

  const handleResetToDefaults = useCallback(() => {
    setSelectedRanges(DEFAULT_ENABLED_RANGES);
  }, []);

  const isPresetEnabled = useCallback(
    (presetId: string): boolean => {
      const preset = QUICK_PRESETS.find((p) => p.id === presetId);
      if (!preset) return false;
      return preset.rangeIds.every((id) => selectedRanges.includes(id));
    },
    [selectedRanges],
  );

  const isPresetPartial = useCallback(
    (presetId: string): boolean => {
      const preset = QUICK_PRESETS.find((p) => p.id === presetId);
      if (!preset) return false;
      const selectedCount = preset.rangeIds.filter((id) =>
        selectedRanges.includes(id),
      ).length;
      return selectedCount > 0 && selectedCount < preset.rangeIds.length;
    },
    [selectedRanges],
  );

  const handleTogglePreset = useCallback(
    (presetId: string) => {
      const preset = QUICK_PRESETS.find((p) => p.id === presetId);
      if (!preset) return;

      const isEnabled = preset.rangeIds.every((id) =>
        selectedRanges.includes(id),
      );

      if (isEnabled) {
        setSelectedRanges((prev) =>
          prev.filter(
            (id) =>
              !preset.rangeIds.includes(id) ||
              DEFAULT_ENABLED_RANGES.includes(id),
          ),
        );
      } else {
        setSelectedRanges((prev) => [
          ...new Set([...prev, ...preset.rangeIds]),
        ]);
      }
    },
    [selectedRanges],
  );

  const getPresetCharCount = useCallback((presetId: string): number => {
    const preset = QUICK_PRESETS.find((p) => p.id === presetId);
    if (!preset) return 0;
    return preset.rangeIds.reduce((sum, id) => {
      const range = UNICODE_RANGES.find((r) => r.id === id);
      return sum + (range?.charCount || 0);
    }, 0);
  }, []);

  const handleAddCustomInterval = useCallback(() => {
    const start = parseInt(customInterval.start, 16);
    const end = parseInt(customInterval.end, 16);

    if (!isNaN(start) && !isNaN(end) && start <= end) {
      setCustomIntervals((prev) => [...prev, { start, end }]);
      setCustomInterval({ start: "", end: "" });
    }
  }, [customInterval]);

  const handleRemoveCustomInterval = useCallback((index: number) => {
    setCustomIntervals((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const totalSelectedChars =
    selectedRanges.reduce((sum, id) => {
      const range = UNICODE_RANGES.find((r) => r.id === id);
      return sum + (range?.charCount || 0);
    }, 0) + customIntervals.reduce((sum, i) => sum + (i.end - i.start + 1), 0);

  const isCodePointInSelectedRanges = useCallback(
    (codePoint: number): boolean => {
      for (const rangeId of selectedRanges) {
        const range = UNICODE_RANGES.find((r) => r.id === rangeId);
        if (range) {
          for (const interval of range.intervals) {
            if (codePoint >= interval.start && codePoint <= interval.end) {
              return true;
            }
          }
        }
      }
      for (const interval of customIntervals) {
        if (codePoint >= interval.start && codePoint <= interval.end) {
          return true;
        }
      }
      return false;
    },
    [selectedRanges, customIntervals],
  );

  const renderPreview = useCallback(async () => {
    const canvas = previewCanvasRef.current;
    const ft = freetypeRef.current;
    if (!canvas || !ft || !fontInfo?.isValid || !fontData) return;

    await renderPreviewToCanvas({
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
    });
  }, [
    fontData,
    fontInfo,
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
  ]);

  useEffect(() => {
    if (fontData && fontInfo?.isValid && freetypeLoaded) {
      renderPreview();
    }
  }, [fontData, fontInfo, freetypeLoaded, renderPreview]);

  const handleConvert = useCallback(async () => {
    if (!fontFile || !freetypeRef.current || !fontData || !fontInfo?.isValid)
      return;

    setConversionState({
      status: "converting",
      progress: 0,
      message: "Starting conversion...",
    });

    try {
      const allIntervals: UnicodeInterval[] = [...customIntervals];
      for (const rangeId of selectedRanges) {
        const range = UNICODE_RANGES.find((r) => r.id === rangeId);
        if (range) {
          allIntervals.push(...range.intervals);
        }
      }

      const result = await convertTTFToEPDFont(fontData, {
        fontName,
        fontSize,
        is2Bit,
        charSpacing,
        lineSpacing,
        boldness,
        italicAngle,
        horizontalScale,
        baselineShift,
        antialiasing,
        includeKorean: false,
        additionalIntervals: allIntervals.length > 0 ? allIntervals : undefined,
        onProgress: (progress, message) => {
          setConversionState((prev) => ({
            ...prev,
            progress,
            message,
          }));
        },
      });

      if (result.success) {
        setConversionState({
          status: "success",
          progress: 100,
          message: "Conversion complete!",
          result,
        });
      } else {
        setConversionState({
          status: "error",
          progress: 0,
          message: result.error || "Conversion failed",
        });
      }
    } catch (error) {
      setConversionState({
        status: "error",
        progress: 0,
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }, [
    fontFile,
    fontData,
    fontInfo,
    fontName,
    fontSize,
    is2Bit,
    selectedRanges,
    customIntervals,
    charSpacing,
    lineSpacing,
    boldness,
    italicAngle,
    horizontalScale,
    baselineShift,
    antialiasing,
  ]);

  const handleDownload = useCallback(() => {
    if (!conversionState.result?.data) return;

    const data = conversionState.result.data;
    const blob = new Blob([new Uint8Array(data)], {
      type: "application/octet-stream",
    });
    const url = URL.createObjectURL(blob);

    if (downloadRef.current) {
      downloadRef.current.href = url;
      downloadRef.current.download = `${fontName}_${fontSize}${is2Bit ? "_2bit" : ""}.epdfont`;
      downloadRef.current.click();
      URL.revokeObjectURL(url);
    }
  }, [conversionState.result, fontName, fontSize, is2Bit]);

  const handleResetRendering = useCallback(() => {
    setCharSpacing(0);
    setLineSpacing(1.2);
    setBoldness(0);
    setItalicAngle(0);
    setHorizontalScale(100);
    setBaselineShift(0);
    setAntialiasing(true);
  }, []);

  const handlePresetColors = useCallback((bg: string, fg: string) => {
    setPreviewBgColor(bg);
    setPreviewFgColor(fg);
  }, []);

  const canConvert =
    fontFile &&
    fontName &&
    freetypeLoaded &&
    fontInfo?.isValid &&
    conversionState.status !== "converting";

  return (
    <div className="bg-gray-100 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {!freetypeLoaded && conversionState.status !== "error" && (
          <div className="mb-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                <span className="text-blue-700 dark:text-blue-300">
                  FreeType 라이브러리 로드 중...
                </span>
              </div>
            </div>
          </div>
        )}

        {conversionState.status === "error" && (
          <div className="mb-4">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-700 dark:text-red-300">
                {conversionState.message}
              </p>
            </div>
          </div>
        )}

        {/* <div className="mb-4">
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-emerald-600 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                  파일 크기 / 폰트 크기 제한 없음
                </h4>
                <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-300">
                  FreeType WASM을 Web Worker에서 실행합니다. 변환 중 UI가 멈추지 않고,
                  대용량 폰트와 4–1024px 범위의 모든 크기를 지원합니다.
                </p>
              </div>
            </div>
          </div>
        </div> */}

        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="w-full lg:flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="p-4 space-y-4">
              <FontUploader
                ref={dropZoneRef}
                fontFile={fontFile}
                fontInfo={fontInfo}
                isValidating={isValidating}
                isDragging={isDragging}
                freetypeLoaded={freetypeLoaded}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onFileChange={handleFileChange}
              />

              <FontSettings
                fontName={fontName}
                fontSize={fontSize}
                is2Bit={is2Bit}
                onFontNameChange={setFontName}
                onFontSizeChange={setFontSize}
                onIs2BitChange={setIs2Bit}
              />

              <RenderingOptions
                charSpacing={charSpacing}
                lineSpacing={lineSpacing}
                boldness={boldness}
                italicAngle={italicAngle}
                horizontalScale={horizontalScale}
                baselineShift={baselineShift}
                antialiasing={antialiasing}
                onCharSpacingChange={setCharSpacing}
                onLineSpacingChange={setLineSpacing}
                onBoldnessChange={setBoldness}
                onItalicAngleChange={setItalicAngle}
                onHorizontalScaleChange={setHorizontalScale}
                onBaselineShiftChange={setBaselineShift}
                onAntialiasingChange={setAntialiasing}
                onReset={handleResetRendering}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  미리보기 텍스트
                </label>
                <textarea
                  value={previewText}
                  onChange={(e) => setPreviewText(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                  placeholder="미리보기할 텍스트를 입력하세요..."
                />
              </div>

              <QuickPresets
                isPresetEnabled={isPresetEnabled}
                isPresetPartial={isPresetPartial}
                getPresetCharCount={getPresetCharCount}
                onTogglePreset={handleTogglePreset}
              />

              <UnicodeRangeSelector
                isOpen={isUnicodeRangesOpen}
                selectedRanges={selectedRanges}
                totalSelectedChars={totalSelectedChars}
                collapsedCategories={collapsedCategories}
                onToggleOpen={() => setIsUnicodeRangesOpen((v) => !v)}
                onSelectAll={handleSelectAll}
                onDeselectAll={handleDeselectAll}
                onResetToDefaults={handleResetToDefaults}
                onRangeToggle={handleRangeToggle}
                onCategoryToggle={handleCategoryToggle}
                onCategoryCollapse={handleCategoryCollapse}
              />

              <CustomIntervals
                customInterval={customInterval}
                customIntervals={customIntervals}
                onCustomIntervalChange={setCustomInterval}
                onAddCustomInterval={handleAddCustomInterval}
                onRemoveCustomInterval={handleRemoveCustomInterval}
              />

              <div className="pt-4">
                <button
                  onClick={handleConvert}
                  disabled={!canConvert}
                  className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg
                    hover:bg-blue-700 focus:ring-4 focus:ring-blue-300
                    disabled:bg-gray-400 disabled:cursor-not-allowed
                    transition-colors duration-200"
                >
                  {conversionState.status === "converting"
                    ? "변환 중..."
                    : "EPDFont로 변환"}
                </button>
              </div>
            </div>
          </aside>

          <div className="w-full lg:w-130 lg:shrink-0 space-y-4">
            <PreviewPanel
              ref={previewCanvasRef}
              fontData={fontData}
              previewBgColor={previewBgColor}
              previewFgColor={previewFgColor}
              previewScale={previewScale}
              antialiasing={antialiasing}
              onBgColorChange={setPreviewBgColor}
              onFgColorChange={setPreviewFgColor}
              onScaleChange={setPreviewScale}
              onPresetColors={handlePresetColors}
            />

            <ConversionProgress conversionState={conversionState} />

            <ConversionResult
              ref={downloadRef}
              conversionState={conversionState}
              onDownload={handleDownload}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
