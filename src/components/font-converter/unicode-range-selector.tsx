"use client";

import { UNICODE_RANGES } from "../unicode-range";
import { RANGE_CATEGORIES } from "./constants";

interface UnicodeRangeSelectorProps {
  isOpen: boolean;
  selectedRanges: string[];
  totalSelectedChars: number;
  collapsedCategories: string[];
  onToggleOpen: () => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onResetToDefaults: () => void;
  onRangeToggle: (rangeId: string) => void;
  onCategoryToggle: (category: string) => void;
  onCategoryCollapse: (category: string) => void;
}

export function UnicodeRangeSelector({
  isOpen,
  selectedRanges,
  totalSelectedChars,
  collapsedCategories,
  onToggleOpen,
  onSelectAll,
  onDeselectAll,
  onResetToDefaults,
  onRangeToggle,
  onCategoryToggle,
  onCategoryCollapse,
}: UnicodeRangeSelectorProps) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
        onClick={onToggleOpen}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="text-gray-500 dark:text-gray-400"
          >
            {isOpen ? (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
          </button>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              유니코드 범위 (세부 선택)
            </label>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {selectedRanges.length}개 범위,{" "}
              {totalSelectedChars.toLocaleString()}자
              {totalSelectedChars > 10000 && (
                <span className="ml-1 text-yellow-600 dark:text-yellow-400">
                  (대용량)
                </span>
              )}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleOpen();
          }}
          className="text-sm px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          {isOpen ? "닫기" : "열기"}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-4">
          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={onSelectAll}
              className="text-xs px-2 py-1 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              전체 선택
            </button>
            <button
              type="button"
              onClick={onDeselectAll}
              className="text-xs px-2 py-1 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              전체 해제
            </button>
            <button
              type="button"
              onClick={onResetToDefaults}
              className="text-xs px-2 py-1 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              기본값 복원
            </button>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
            {RANGE_CATEGORIES.map((category) => {
              const categoryRanges = UNICODE_RANGES.filter(
                (r) => r.category === category,
              );
              const selectedInCategory = categoryRanges.filter((r) =>
                selectedRanges.includes(r.id),
              ).length;
              const isCollapsed = collapsedCategories.includes(category);
              const allSelected =
                selectedInCategory === categoryRanges.length;
              const someSelected =
                selectedInCategory > 0 && !allSelected;

              return (
                <div
                  key={category}
                  className="border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                >
                  <div
                    className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-800 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                    onClick={() => onCategoryCollapse(category)}
                  >
                    <button
                      type="button"
                      className="text-gray-500 dark:text-gray-400"
                    >
                      {isCollapsed ? (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      )}
                    </button>
                    <input
                      type="checkbox"
                      checked={allSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = someSelected;
                      }}
                      onChange={(e) => {
                        e.stopPropagation();
                        onCategoryToggle(category);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="font-medium text-gray-900 dark:text-white flex-1">
                      {category}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {selectedInCategory}/{categoryRanges.length}
                    </span>
                  </div>

                  {!isCollapsed && (
                    <div className="p-2 space-y-1">
                      {categoryRanges.map((range) => (
                        <label
                          key={range.id}
                          className={`flex items-start gap-2 p-2 rounded cursor-pointer transition-colors
                            ${
                              selectedRanges.includes(range.id)
                                ? "bg-blue-50 dark:bg-blue-900/20"
                                : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                            }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedRanges.includes(range.id)}
                            onChange={() => onRangeToggle(range.id)}
                            className="w-4 h-4 mt-0.5 text-blue-600 rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {range.name}
                              </span>
                              {range.charCount > 5000 && (
                                <span className="text-xs px-1.5 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded">
                                  Large
                                </span>
                              )}
                              {range.defaultEnabled && (
                                <span className="text-xs px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {range.description}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                              {range.charCount.toLocaleString()} chars
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
