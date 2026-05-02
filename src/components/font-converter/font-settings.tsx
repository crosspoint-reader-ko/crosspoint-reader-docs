"use client";

import { useTranslations } from "next-intl";

interface FontSettingsProps {
  fontName: string;
  fontSize: number;
  is2Bit: boolean;
  onFontNameChange: (name: string) => void;
  onFontSizeChange: (size: number) => void;
  onIs2BitChange: (is2Bit: boolean) => void;
}

export function FontSettings({
  fontName,
  fontSize,
  is2Bit,
  onFontNameChange,
  onFontSizeChange,
  onIs2BitChange,
}: FontSettingsProps) {
  const t = useTranslations("fontConverter");
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t("settings.fontName")}
          </label>
          <input
            type="text"
            value={fontName}
            onChange={(e) => onFontNameChange(e.target.value)}
            placeholder={t("settings.fontNamePlaceholder")}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
              bg-white dark:bg-gray-700 text-gray-900 dark:text-white
              focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t("settings.fontSize")}
          </label>
          <input
            type="number"
            value={fontSize}
            onChange={(e) => onFontSizeChange(parseInt(e.target.value) || 14)}
            min={4}
            max={1024}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
              bg-white dark:bg-gray-700 text-gray-900 dark:text-white
              focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {t("settings.fontSizeHint")}
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t("settings.bitDepth")}
        </label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={!is2Bit}
              onChange={() => onIs2BitChange(false)}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-gray-700 dark:text-gray-300">
              {t("settings.bit1")}
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={is2Bit}
              onChange={() => onIs2BitChange(true)}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-gray-700 dark:text-gray-300">
              {t("settings.bit2")}
            </span>
          </label>
        </div>
      </div>
    </>
  );
}
