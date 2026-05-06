"use client";

import { useTranslations } from "next-intl";
import { ConnectionState } from "@/lib/usb/useBridge";
import { formatBytes } from "@/lib/usb/protocol";

interface Props {
  state: ConnectionState;
}

export function ConnectionBadge({ state }: Props) {
  const t = useTranslations("usb.status");

  let dotClass = "bg-gray-400";
  let pulseClass = "";
  let label = t("disconnected");
  let labelClass = "text-gray-600";

  if (state.kind === "connecting") {
    dotClass = "bg-amber-400";
    pulseClass = "animate-ping";
    label = t("connecting");
    labelClass = "text-amber-700";
  } else if (state.kind === "connected") {
    dotClass = "bg-emerald-500";
    pulseClass = "animate-pulse";
    label = t("connected");
    labelClass = "text-emerald-700";
  } else if (state.kind === "error") {
    dotClass = "bg-rose-500";
    label = t("error");
    labelClass = "text-rose-700";
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur px-3 py-1.5 ring-1 ring-gray-200 shadow-sm">
      <span className="relative flex h-2.5 w-2.5">
        {pulseClass && (
          <span
            className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${dotClass} ${pulseClass}`}
          />
        )}
        <span
          className={`relative inline-flex h-2.5 w-2.5 rounded-full ${dotClass}`}
        />
      </span>
      <span className={`text-sm font-medium ${labelClass}`}>{label}</span>
      {state.kind === "connected" && (
        <span className="text-xs text-gray-400 ml-1 tabular-nums">
          {formatBytes(state.info.freeHeap)} {t("freeHeap")}
        </span>
      )}
    </div>
  );
}
