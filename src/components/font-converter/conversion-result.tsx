"use client";

import { forwardRef } from "react";
import { formatFileSize } from "@/lib/epdfont-converter";
import type { ConversionState } from "./types";

interface ConversionProgressProps {
  conversionState: ConversionState;
}

export function ConversionProgress({
  conversionState,
}: ConversionProgressProps) {
  if (conversionState.status !== "converting") return null;
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-2">
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>{conversionState.message}</span>
        <span>{Math.round(conversionState.progress)}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${conversionState.progress}%` }}
        ></div>
      </div>
    </div>
  );
}

interface ConversionResultProps {
  conversionState: ConversionState;
  onDownload: () => void;
}

export const ConversionResult = forwardRef<
  HTMLAnchorElement,
  ConversionResultProps
>(function ConversionResult({ conversionState, onDownload }, ref) {
  if (conversionState.status !== "success" || !conversionState.result) {
    return null;
  }
  const { result } = conversionState;
  return (
    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 space-y-4">
      <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        <span className="font-medium">변환 완료!</span>
      </div>
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-gray-500 dark:text-gray-400">글리프</p>
          <p className="font-medium text-gray-900 dark:text-white">
            {result.glyphCount?.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400">범위</p>
          <p className="font-medium text-gray-900 dark:text-white">
            {result.intervalCount}
          </p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400">파일 크기</p>
          <p className="font-medium text-gray-900 dark:text-white">
            {formatFileSize(result.totalSize || 0)}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 text-sm mt-2">
        <div>
          <p className="text-gray-500 dark:text-gray-400">줄 높이</p>
          <p className="font-medium text-gray-900 dark:text-white">
            {result.advanceY}px
          </p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400">어센더</p>
          <p className="font-medium text-gray-900 dark:text-white">
            {result.ascender}px
          </p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400">디센더</p>
          <p className="font-medium text-gray-900 dark:text-white">
            {result.descender}px
          </p>
        </div>
      </div>
      <button
        onClick={onDownload}
        className="w-full py-2 px-4 bg-green-600 text-white font-medium rounded-lg
          hover:bg-green-700 focus:ring-4 focus:ring-green-300
          transition-colors duration-200"
      >
        .epdfont 파일 다운로드
      </button>
      <a ref={ref} className="hidden" />
    </div>
  );
});
