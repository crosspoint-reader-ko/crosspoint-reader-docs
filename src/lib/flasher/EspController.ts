"use client";

import { ESPLoader, Transport } from "esptool-js";
import OtaPartition from "./OtaPartition";
import { leBytesToU32 } from "./bytes";

export interface AppPartitionLayout {
  app0Offset: number;
  app1Offset: number;
  appSize: number;
}

// Fallback layout when partition table cannot be read from device or file.
// Matches v1.2.0-ko.0 partitions.csv.
const DEFAULT_APP_LAYOUT: AppPartitionLayout = {
  app0Offset: 0x10000,
  app1Offset: 0x6a0000,
  appSize: 0x690000,
};

// Parse an ESP partition table binary (0x8000..0x9000, 4KiB max).
// Each entry is 32 bytes: magic(2) type(1) subtype(1) offset(4) size(4) label(16) flags(4)
// ota_0 subtype = 0x10, ota_1 subtype = 0x11, app type = 0x00
export function parseAppLayoutFromPartitions(
  data: Uint8Array,
): AppPartitionLayout | null {
  let app0: { offset: number; size: number } | null = null;
  let app1: { offset: number; size: number } | null = null;

  for (let i = 0; i + 32 <= data.length; i += 32) {
    const magic = (data[i] << 8) | data[i + 1];
    if (magic !== 0x50aa && magic !== 0xaa50) continue;
    // esp partition magic is 0xAA50 little-endian, but bytes are [0xAA, 0x50]
    // so data[i]=0xAA data[i+1]=0x50 → (0xAA<<8)|0x50 = 0xAA50
    if (data[i] !== 0xaa || data[i + 1] !== 0x50) continue;

    const type = data[i + 2];
    const subtype = data[i + 3];
    if (type !== 0x00) continue; // not an app partition

    const offset = leBytesToU32(data.slice(i + 4, i + 8));
    const size = leBytesToU32(data.slice(i + 8, i + 12));
    if (subtype === 0x10) app0 = { offset, size };
    else if (subtype === 0x11) app1 = { offset, size };
  }

  if (!app0 || !app1) return null;
  // Use the smaller of the two sizes as a guard.
  const appSize = Math.min(app0.size, app1.size);
  return { app0Offset: app0.offset, app1Offset: app1.offset, appSize };
}

export default class EspController {
  static async requestDevice() {
    if (!("serial" in navigator && navigator.serial)) {
      throw new Error(
        "WebSerial is not supported in this browser. Please use Chrome or Edge.",
      );
    }

    return navigator.serial.requestPort({
      filters: [{ usbVendorId: 12346, usbProductId: 4097 }],
    });
  }

  static async fromRequestedDevice() {
    const device = await this.requestDevice();
    return new EspController(device);
  }

  private espLoader;
  private device: SerialPort;

  constructor(device: SerialPort) {
    this.device = device;
    const transport = new Transport(device, false);
    this.espLoader = new ESPLoader({
      transport,
      baudrate: 115200,
      romBaudrate: 115200,
      enableTracing: false,
    });
  }

  async connect() {
    // Close existing connection if port is already open
    if (this.device.readable || this.device.writable) {
      try {
        await this.espLoader.transport.disconnect();
      } catch {
        // Ignore disconnect errors
      }
      // Wait a bit for the port to fully close
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    await this.espLoader.main();
  }

  async disconnect({ skipReset = false }: { skipReset?: boolean } = {}) {
    if (!skipReset) {
      try {
        // RTS 핀을 수동으로 토글해서 하드 리셋 시도
        const port = this.device as unknown as {
          setSignals: (signals: { dataTerminalReady: boolean; requestToSend: boolean }) => Promise<void>;
        };
        await port.setSignals({ dataTerminalReady: false, requestToSend: true });
        await new Promise((resolve) => setTimeout(resolve, 100));
        await port.setSignals({ dataTerminalReady: false, requestToSend: false });
      } catch {
        // 시그널 제어 실패 시 기존 방식으로 폴백
        try {
          await this.espLoader.after("hard_reset");
        } catch {
          // Ignore reset errors
        }
      }
    }
    try {
      await this.espLoader.transport.disconnect();
    } catch {
      // Ignore disconnect errors
    }
  }

  async readFullFlash(
    onPacketReceived?: (
      packet: Uint8Array,
      progress: number,
      totalSize: number,
    ) => void,
  ) {
    return this.espLoader.readFlash(0, 0x1000000, onPacketReceived);
  }

  async writeFullFlash(
    data: Uint8Array,
    reportProgress?: (
      fileIndex: number,
      written: number,
      total: number,
    ) => void,
  ) {
    if (data.length !== 0x1000000) {
      throw new Error(
        `Data length must be 0x1000000, but got 0x${data.length.toString().padStart(7, "0")}`,
      );
    }

    await this.writeData(data, 0, reportProgress);
  }

  async readOtadataPartition(
    onPacketReceived?: (
      packet: Uint8Array,
      progress: number,
      totalSize: number,
    ) => void,
  ) {
    return new OtaPartition(
      await this.espLoader.readFlash(0xe000, 0x2000, onPacketReceived),
    );
  }

  async writeOtadataPartition(
    partition: OtaPartition,
    reportProgress?: (
      fileIndex: number,
      written: number,
      total: number,
    ) => void,
  ) {
    await this.writeData(partition.data, 0xe000, reportProgress);
  }

  async writePartitionTable(
    data: Uint8Array,
    reportProgress?: (
      fileIndex: number,
      written: number,
      total: number,
    ) => void,
  ) {
    await this.writeData(data, 0x8000, reportProgress);
  }

  async readPartitionTable(
    onPacketReceived?: (
      packet: Uint8Array,
      progress: number,
      totalSize: number,
    ) => void,
  ) {
    return this.espLoader.readFlash(0x8000, 0x1000, onPacketReceived);
  }

  async readAppPartition(
    partitionLabel: "app0" | "app1",
    layout: AppPartitionLayout = DEFAULT_APP_LAYOUT,
    onPacketReceived?: (
      packet: Uint8Array,
      progress: number,
      totalSize: number,
    ) => void,
  ) {
    const offset =
      partitionLabel === "app0" ? layout.app0Offset : layout.app1Offset;
    return this.espLoader.readFlash(offset, layout.appSize, onPacketReceived);
  }

  async writeAppPartition(
    partitionLabel: "app0" | "app1",
    data: Uint8Array,
    layout: AppPartitionLayout = DEFAULT_APP_LAYOUT,
    reportProgress?: (
      fileIndex: number,
      written: number,
      total: number,
    ) => void,
  ) {
    if (data.length > layout.appSize) {
      throw new Error(
        `Firmware is ${data.length} bytes but app partition is only 0x${layout.appSize.toString(16)} bytes`,
      );
    }
    if (data.length < 0xf0000) {
      throw new Error(
        `Data seems too small, are you sure this is the right file?`,
      );
    }

    const offset =
      partitionLabel === "app0" ? layout.app0Offset : layout.app1Offset;

    await this.writeData(data, offset, reportProgress);
  }

  private async writeData(
    data: Uint8Array,
    address: number,
    reportProgress?: (
      fileIndex: number,
      written: number,
      total: number,
    ) => void,
  ) {
    await this.espLoader.writeFlash({
      fileArray: [
        {
          data: this.espLoader.ui8ToBstr(data),
          address,
        },
      ],
      flashSize: "keep",
      flashMode: "keep",
      flashFreq: "keep",

      eraseAll: false,
      compress: true,
      reportProgress,
    });
  }
}
