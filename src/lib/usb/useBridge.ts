"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BridgeError,
  ESP32_FILTERS,
  PingInfo,
  SerialBridge,
} from "./protocol";

export type ConnectionState =
  | { kind: "disconnected" }
  | { kind: "connecting" }
  | { kind: "connected"; info: PingInfo; lastPingAt: number }
  | { kind: "error"; message: string };

export interface UseBridgeResult {
  bridge: SerialBridge | null;
  state: ConnectionState;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  supported: boolean;
}

// Module-level singleton state. Survives Next.js HMR remounts so the WebSerial
// port doesn't get torn down whenever a TSX file changes during development.
type Listener = (s: ConnectionState) => void;

let bridgeInstance: SerialBridge | null = null;
let currentState: ConnectionState = { kind: "disconnected" };
const listeners = new Set<Listener>();

function setState(next: ConnectionState): void {
  currentState = next;
  for (const l of listeners) l(next);
}

function ensureBridge(): SerialBridge {
  if (!bridgeInstance) {
    bridgeInstance = new SerialBridge({
      onDisconnect: (reason) =>
        setState({ kind: "error", message: reason || "disconnected" }),
    });
  }
  return bridgeInstance;
}

async function doConnect(): Promise<void> {
  if (!SerialBridge.isSupported()) {
    setState({ kind: "error", message: "WebSerial not supported" });
    return;
  }
  setState({ kind: "connecting" });
  try {
    const port = await navigator.serial.requestPort({ filters: ESP32_FILTERS });
    const bridge = ensureBridge();
    await bridge.connect(port);
    const info = await bridge.ping();
    setState({ kind: "connected", info, lastPingAt: Date.now() });
  } catch (err) {
    const message =
      err instanceof BridgeError
        ? `[${err.code}] ${err.message}`
        : err instanceof Error
          ? err.message
          : String(err);
    setState({ kind: "error", message });
  }
}

async function doDisconnect(): Promise<void> {
  if (!bridgeInstance) {
    setState({ kind: "disconnected" });
    return;
  }
  await bridgeInstance.disconnect("user");
  setState({ kind: "disconnected" });
}

// No periodic heartbeat. Sending a PING while a chunk upload is mid-flight
// queues behind the chunk on the device side and frequently times out under
// SD-write latency, which would false-alarm the UI to "disconnected".
// Connection loss is detected naturally via the read stream closing, which
// triggers the bridge's onDisconnect callback and flips state to "error".
function ensurePingTimer(): void {
  // intentionally a no-op — kept for API stability with previous versions.
}

export function useBridge(): UseBridgeResult {
  const [state, setLocalState] = useState<ConnectionState>(currentState);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(SerialBridge.isSupported());
    ensurePingTimer();
    listeners.add(setLocalState);
    setLocalState(currentState);
    return () => {
      listeners.delete(setLocalState);
      // Intentionally do NOT disconnect on unmount: Next HMR remounts the
      // page on every TSX edit and we'd lose the open serial port. The user
      // disconnects explicitly via the Disconnect button.
    };
  }, []);

  const connect = useCallback(() => doConnect(), []);
  const disconnect = useCallback(() => doDisconnect(), []);

  return useMemo(
    () => ({
      bridge: bridgeInstance,
      state,
      connect,
      disconnect,
      supported,
    }),
    [state, connect, disconnect, supported],
  );
}
