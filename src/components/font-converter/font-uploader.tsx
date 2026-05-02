"use client";

import { forwardRef } from "react";
import { useTranslations } from "next-intl";
import { formatFileSize } from "@/lib/epdfont-converter";
import type { FontInfo } from "./types";

interface FontUploaderProps {
  fontFile: File | null;
  fontInfo: FontInfo | null;
  isValidating: boolean;
  isDragging: boolean;
  freetypeLoaded: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FontUploader = forwardRef<HTMLDivElement, FontUploaderProps>(
  function FontUploader(
    {
      fontFile,
      fontInfo,
      isValidating,
      isDragging,
      freetypeLoaded,
      onDragOver,
      onDragLeave,
      onDrop,
      onFileChange,
    },
    ref,
  ) {
    const t = useTranslations("fontConverter");
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t("uploader.label")}
        </label>
        <div
          ref={ref}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-colors
            ${
              isDragging
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
            }
            ${!freetypeLoaded ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          <input
            type="file"
            accept=".ttf,.otf,.woff,.woff2"
            onChange={onFileChange}
            disabled={!freetypeLoaded}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <div className="space-y-2">
            <svg
              className={`mx-auto h-10 w-10 ${isDragging ? "text-blue-500" : "text-gray-400"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {isDragging ? (
                <span className="text-blue-600 dark:text-blue-400 font-medium">
                  {t("uploader.drop")}
                </span>
              ) : (
                <>
                  <span className="text-blue-600 dark:text-blue-400 font-medium">
                    {t("uploader.select")}
                  </span>
                  {t("uploader.orDrag")}
                </>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {t("uploader.formats")}
            </p>
            {fontFile && (
              <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mt-2">
                {t("uploader.selected", { name: fontFile.name })}
              </p>
            )}
          </div>
        </div>

        {isValidating && (
          <div className="mt-2 flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            <span>{t("uploader.validating")}</span>
          </div>
        )}

        {fontInfo && !isValidating && (
          <div
            className={`mt-3 p-3 rounded-lg ${
              fontInfo.isValid
                ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
            }`}
          >
            {fontInfo.isValid ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">
                    {t("uploader.loadSuccess")}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mt-2">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">
                      {t("uploader.family")}
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {fontInfo.familyName}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">
                      {t("uploader.style")}
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {fontInfo.styleName}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">
                      {t("uploader.glyphs")}
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {fontInfo.numGlyphs.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">
                      {t("uploader.size")}
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {formatFileSize(fontInfo.fileSize)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2 text-red-700 dark:text-red-300">
                <svg
                  className="w-5 h-5 shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="font-medium">{t("uploader.loadFailed")}</p>
                  <p className="text-sm mt-1">{fontInfo.error}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
);
