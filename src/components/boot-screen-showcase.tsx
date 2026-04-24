import Image from "next/image";
import { CROSSPOINT_VERSION } from "@/constants/version";
import { getAssetPath } from "@/lib/basePath";

// 실제 본체 외형 치수 (공식 사용 설명서 1.3 Specifications)
// X4: 112 × 69 mm (4.4″ × 2.72″)
// X3:  98 × 64 mm (3.85″ × 2.52″) → X4 대비 세로 ~87.5 %
// 두 기기 모두 공식 사용 설명서 표지(p.1)의 벡터를 그대로 사용.
// 동일 Illustrator 템플릿이라 시계방향 약 11.5° 틸트 공유.
const DEVICES = [
  {
    id: "x4",
    label: "Xteink X4",
    hint: "4.3″ · 800×480",
    src: "/x4-device-cover.svg",
    scale: 1,
    // Page 1 표지 기반 — 시계방향 11.5° 틸트
    tilt: 11.5,
    // viewBox 297.638 × 420.945 기준 스크린 영역 (틸트 해제 치수)
    screen: { cx: 48.9, cy: 51.3, w: 47.8, h: 57.2 },
  },
  {
    id: "x3",
    label: "Xteink X3",
    hint: "3.7″ · 792×528",
    src: "/x3-device-cover.svg",
    scale: 0.875,
    // Page 1 표지 — X4 와 동일하게 시계방향 틸트
    tilt: 11.5,
    screen: { cx: 48.9, cy: 50.0, w: 43.5, h: 46.9 },
  },
] as const;

function DeviceMockup({ device }: { device: (typeof DEVICES)[number] }) {
  const width = 240 * device.scale;
  const height = 340 * device.scale;
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative overflow-hidden drop-shadow-2xl"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <Image
          src={getAssetPath(device.src)}
          alt={`${device.label} 폼팩터`}
          fill
          className="object-contain"
          unoptimized
          priority
        />
        {/* 기울어진 스크린 영역 — 본체 회전각과 동일하게 rotate */}
        <div
          className="absolute flex flex-col items-center justify-center gap-1 text-gray-900"
          style={{
            left: `${device.screen.cx - device.screen.w / 2}%`,
            top: `${device.screen.cy - device.screen.h / 2}%`,
            width: `${device.screen.w}%`,
            height: `${device.screen.h}%`,
            transform: `rotate(${device.tilt}deg)`,
            transformOrigin: "center",
          }}
        >
          <Image
            src={getAssetPath("/logo.svg")}
            alt="CrossPoint 로고"
            width={64}
            height={72}
            className="h-auto"
            style={{ width: `${44 * device.scale}px` }}
            unoptimized
          />
          <span
            className="font-bold tracking-tight leading-none mt-2"
            style={{ fontSize: `${13 * device.scale}px` }}
          >
            CrossPoint
          </span>
          <span
            className="absolute bottom-1 tabular-nums text-gray-400"
            style={{ fontSize: `${7 * device.scale}px` }}
          >
            v{CROSSPOINT_VERSION}
          </span>
        </div>
      </div>
      <div className="text-center">
        <div className="text-sm font-semibold text-gray-900">
          {device.label}
        </div>
        <div className="text-xs text-gray-500 tabular-nums">{device.hint}</div>
      </div>
    </div>
  );
}

export function BootScreenShowcase() {
  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-end sm:justify-center sm:gap-10">
      {DEVICES.map((device) => (
        <DeviceMockup key={device.id} device={device} />
      ))}
    </div>
  );
}
