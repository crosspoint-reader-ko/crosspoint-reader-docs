"use client";

interface RenderingOptionsProps {
  charSpacing: number;
  lineSpacing: number;
  boldness: number;
  italicAngle: number;
  horizontalScale: number;
  baselineShift: number;
  antialiasing: boolean;
  onCharSpacingChange: (v: number) => void;
  onLineSpacingChange: (v: number) => void;
  onBoldnessChange: (v: number) => void;
  onItalicAngleChange: (v: number) => void;
  onHorizontalScaleChange: (v: number) => void;
  onBaselineShiftChange: (v: number) => void;
  onAntialiasingChange: (v: boolean) => void;
  onReset: () => void;
}

export function RenderingOptions({
  charSpacing,
  lineSpacing,
  boldness,
  italicAngle,
  horizontalScale,
  baselineShift,
  antialiasing,
  onCharSpacingChange,
  onLineSpacingChange,
  onBoldnessChange,
  onItalicAngleChange,
  onHorizontalScaleChange,
  onBaselineShiftChange,
  onAntialiasingChange,
  onReset,
}: RenderingOptionsProps) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
        렌더링 옵션
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
            자간 (px)
          </label>
          <input
            type="number"
            value={charSpacing}
            onChange={(e) => onCharSpacingChange(parseInt(e.target.value) || 0)}
            min={-10}
            max={50}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded
              bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
            행간 (배수)
          </label>
          <input
            type="number"
            value={lineSpacing}
            onChange={(e) =>
              onLineSpacingChange(parseFloat(e.target.value) || 1)
            }
            min={0.5}
            max={3}
            step={0.1}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded
              bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
            굵기
          </label>
          <input
            type="range"
            value={boldness}
            onChange={(e) => onBoldnessChange(parseInt(e.target.value))}
            min={0}
            max={5}
            className="w-full"
          />
          <div className="text-xs text-center text-gray-500">{boldness}</div>
        </div>

        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
            이텔릭체 기울기
          </label>
          <input
            type="range"
            value={italicAngle}
            onChange={(e) => onItalicAngleChange(parseInt(e.target.value))}
            min={-20}
            max={20}
            className="w-full"
          />
          <div className="text-xs text-center text-gray-500">
            {italicAngle}°
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
            장평 (%)
          </label>
          <input
            type="number"
            value={horizontalScale}
            onChange={(e) =>
              onHorizontalScaleChange(parseInt(e.target.value) || 100)
            }
            min={50}
            max={200}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded
              bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
            베이스라인 (px)
          </label>
          <input
            type="number"
            value={baselineShift}
            onChange={(e) =>
              onBaselineShiftChange(parseInt(e.target.value) || 0)
            }
            min={-20}
            max={20}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded
              bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="antialiasing"
            checked={antialiasing}
            onChange={(e) => onAntialiasingChange(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded"
          />
          <label
            htmlFor="antialiasing"
            className="text-xs text-gray-600 dark:text-gray-400"
          >
            안티앨리어싱
          </label>
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={onReset}
            className="text-xs px-2 py-1.5 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            초기화
          </button>
        </div>
      </div>
    </div>
  );
}
