"use client";

import { useTranslations } from "next-intl";
import type { UnicodeInterval } from "@/types/epdfont";

interface CustomIntervalsProps {
  customInterval: { start: string; end: string };
  customIntervals: UnicodeInterval[];
  onCustomIntervalChange: (value: { start: string; end: string }) => void;
  onAddCustomInterval: () => void;
  onRemoveCustomInterval: (index: number) => void;
}

export function CustomIntervals({
  customInterval,
  customIntervals,
  onCustomIntervalChange,
  onAddCustomInterval,
  onRemoveCustomInterval,
}: CustomIntervalsProps) {
  const t = useTranslations("fontConverter");
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {t("custom.label")}
      </label>
      <div className="flex gap-2 items-center">
        <input
          type="text"
          value={customInterval.start}
          onChange={(e) =>
            onCustomIntervalChange({ ...customInterval, start: e.target.value })
          }
          placeholder={t("custom.startPlaceholder")}
          className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
            bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
        />
        <span className="text-gray-500">-</span>
        <input
          type="text"
          value={customInterval.end}
          onChange={(e) =>
            onCustomIntervalChange({ ...customInterval, end: e.target.value })
          }
          placeholder={t("custom.endPlaceholder")}
          className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
            bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
        />
        <button
          type="button"
          onClick={onAddCustomInterval}
          className="px-3 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500"
        >
          {t("custom.add")}
        </button>
      </div>
      {customIntervals.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {customIntervals.map((interval, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm"
            >
              {interval.start.toString(16).toUpperCase()}-
              {interval.end.toString(16).toUpperCase()}
              <button
                type="button"
                onClick={() => onRemoveCustomInterval(index)}
                className="text-red-500 hover:text-red-700"
              >
                x
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
