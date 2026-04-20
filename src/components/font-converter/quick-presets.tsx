"use client";

import { QUICK_PRESETS } from "./constants";
import { PresetIcon } from "./preset-icon";

interface QuickPresetsProps {
  isPresetEnabled: (presetId: string) => boolean;
  isPresetPartial: (presetId: string) => boolean;
  getPresetCharCount: (presetId: string) => number;
  onTogglePreset: (presetId: string) => void;
}

export function QuickPresets({
  isPresetEnabled,
  isPresetPartial,
  getPresetCharCount: _getPresetCharCount,
  onTogglePreset,
}: QuickPresetsProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        유니코드 범위
      </label>
      <div className="grid grid-cols-2 gap-2">
        {QUICK_PRESETS.map((preset) => {
          const isEnabled = isPresetEnabled(preset.id);
          const isPartial = isPresetPartial(preset.id);
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onTogglePreset(preset.id)}
              className={`flex items-center gap-1.5 p-2 rounded border transition-all text-left text-xs
                ${
                  isEnabled
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                    : isPartial
                      ? "border-blue-300 bg-blue-50/50 dark:bg-blue-900/15 border-dashed"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              title={preset.description}
            >
              <div
                className={`shrink-0 w-4 h-4 rounded border flex items-center justify-center
                  ${
                    isEnabled
                      ? "bg-blue-500 border-blue-500"
                      : isPartial
                        ? "bg-blue-200 border-blue-400 dark:bg-blue-700 dark:border-blue-500"
                        : "border-gray-300 dark:border-gray-600"
                  }`}
              >
                {isEnabled && (
                  <svg
                    className="w-2.5 h-2.5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {isPartial && !isEnabled && (
                  <svg
                    className="w-2.5 h-2.5 text-blue-600 dark:text-blue-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <span
                className={`shrink-0 inline-flex items-center justify-center min-w-5 h-5 whitespace-nowrap ${
                  isEnabled
                    ? "text-blue-700 dark:text-blue-300"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                <PresetIcon id={preset.id} />
              </span>
              <span
                className={`font-medium truncate ${isEnabled ? "text-blue-700 dark:text-blue-300" : "text-gray-900 dark:text-white"}`}
              >
                {preset.name}
              </span>
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        프리셋을 클릭하여 켜고 끌 수 있습니다. 여러 프리셋을 동시에 선택할 수
        있습니다.
      </p>
    </div>
  );
}
