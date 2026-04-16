"use client";

import { useState } from "react";
import {
  getCommunityFirmware,
  getOfficialFirmware,
  getKoreanCommunityFirmware,
  getKoreanFirmwareByTag,
  getKoreanPartitions,
  getKoreanPartitionsByTag,
} from "./firmwareFetcher";
import { downloadData } from "./download";
import { wrapWithWakeLock } from "./wakelock";
import OtaPartition, { OtaPartitionDetails } from "./OtaPartition";
import useStepRunner from "./useStepRunner";
import EspController from "./EspController";

export function useEspOperations() {
  const { stepData, initializeSteps, updateStepData, runStep } =
    useStepRunner();
  const [isRunning, setIsRunning] = useState(false);

  const wrapWithRunning =
    <Args extends unknown[], T>(fn: (...a: Args) => Promise<T>) =>
    async (...a: Args) => {
      setIsRunning(true);
      return fn(...a).finally(() => setIsRunning(false));
    };

  const flashRemoteFirmware = async (
    getFirmware: () => Promise<Uint8Array>,
    getPartitions?: () => Promise<Uint8Array | null>,
  ) => {
    const steps = [
      "장치 연결",
      "펌웨어 다운로드",
      ...(getPartitions ? ["파티션 테이블 업데이트"] : []),
      "otadata 파티션 읽기",
      "앱 파티션 플래싱",
      "otadata 파티션 플래싱",
      "장치 재시작",
    ];
    initializeSteps(steps);

    const espController = await runStep("장치 연결", async () => {
      const c = await EspController.fromRequestedDevice();
      await c.connect();
      return c;
    });

    const firmwareFile = await runStep("펌웨어 다운로드", getFirmware);

    // Flash partition table if provided (needed for partition layout migration)
    if (getPartitions) {
      await runStep("파티션 테이블 업데이트", async () => {
        const partitionsFile = await getPartitions();
        if (partitionsFile) {
          await espController.writePartitionTable(partitionsFile, (_, p, t) =>
            updateStepData("파티션 테이블 업데이트", {
              progress: { current: p, total: t },
            }),
          );
        }
        // If partitions.bin not available (older release), skip silently
      });
    }

    const [otaPartition, backupPartitionLabel] = await runStep(
      "otadata 파티션 읽기",
      async (): Promise<
        [OtaPartition, OtaPartitionDetails["partitionLabel"]]
      > => {
        const partition = await espController.readOtadataPartition((_, p, t) =>
          updateStepData("otadata 파티션 읽기", {
            progress: { current: p, total: t },
          }),
        );

        return [partition, partition.getCurrentBackupPartitionLabel()];
      },
    );

    const flashAppPartitionStepName = `앱 파티션 플래싱 (${backupPartitionLabel})`;
    updateStepData("앱 파티션 플래싱", { name: flashAppPartitionStepName });
    await runStep(flashAppPartitionStepName, () =>
      espController.writeAppPartition(
        backupPartitionLabel,
        firmwareFile,
        (_, p, t) =>
          updateStepData(flashAppPartitionStepName, {
            progress: { current: p, total: t },
          }),
      ),
    );

    await runStep("otadata 파티션 플래싱", async () => {
      otaPartition.setBootPartition(backupPartitionLabel);

      await espController.writeOtadataPartition(otaPartition, (_, p, t) =>
        updateStepData("otadata 파티션 플래싱", {
          progress: { current: p, total: t },
        }),
      );
    });

    await runStep("장치 재시작", () => espController.disconnect());
  };

  const flashEnglishFirmware = async () =>
    flashRemoteFirmware(() => getOfficialFirmware("5.1.6-EN"));
  const flashChineseFirmware = async () =>
    flashRemoteFirmware(() => getOfficialFirmware("5.3.9-CH"));
  const flashCrossPointFirmware = async () =>
    flashRemoteFirmware(() => getCommunityFirmware("CrossPoint"));
  const flashKoreanFirmware = async () =>
    flashRemoteFirmware(
      () => getKoreanCommunityFirmware(),
      () => getKoreanPartitions(),
    );

  const flashKoreanFirmwareVersion = async (filename: string, tag: string) =>
    flashRemoteFirmware(
      () => getKoreanFirmwareByTag(filename),
      () => getKoreanPartitionsByTag(tag),
    );

  const flashCustomFirmware = async (getFile: () => File | undefined) => {
    initializeSteps([
      "파일 읽기",
      "장치 연결",
      "otadata 파티션 읽기",
      "앱 파티션 플래싱",
      "otadata 파티션 플래싱",
      "장치 재시작",
    ]);

    const fileData = await runStep("파일 읽기", async () => {
      const file = getFile();
      if (!file) {
        throw new Error("파일을 찾을 수 없습니다");
      }
      return new Uint8Array(await file.arrayBuffer());
    });

    const espController = await runStep("장치 연결", async () => {
      const c = await EspController.fromRequestedDevice();
      await c.connect();
      return c;
    });

    const [otaPartition, backupPartitionLabel] = await runStep(
      "otadata 파티션 읽기",
      async (): Promise<
        [OtaPartition, OtaPartitionDetails["partitionLabel"]]
      > => {
        const partition = await espController.readOtadataPartition((_, p, t) =>
          updateStepData("otadata 파티션 읽기", {
            progress: { current: p, total: t },
          }),
        );

        return [partition, partition.getCurrentBackupPartitionLabel()];
      },
    );

    const flashAppPartitionStepName = `앱 파티션 플래싱 (${backupPartitionLabel})`;
    updateStepData("앱 파티션 플래싱", { name: flashAppPartitionStepName });
    await runStep(flashAppPartitionStepName, () =>
      espController.writeAppPartition(
        backupPartitionLabel,
        fileData,
        (_, p, t) =>
          updateStepData(flashAppPartitionStepName, {
            progress: { current: p, total: t },
          }),
      ),
    );

    await runStep("otadata 파티션 플래싱", async () => {
      otaPartition.setBootPartition(backupPartitionLabel);

      await espController.writeOtadataPartition(otaPartition, (_, p, t) =>
        updateStepData("otadata 파티션 플래싱", {
          progress: { current: p, total: t },
        }),
      );
    });

    await runStep("장치 재시작", () => espController.disconnect());
  };

  const saveFullFlash = async () => {
    initializeSteps(["장치 연결", "플래시 읽기", "장치 연결 해제"]);

    const espController = await runStep("장치 연결", async () => {
      const c = await EspController.fromRequestedDevice();
      await c.connect();
      return c;
    });

    const firmwareFile = await runStep(
      "플래시 읽기",
      wrapWithWakeLock(() =>
        espController.readFullFlash((_, p, t) =>
          updateStepData("플래시 읽기", { progress: { current: p, total: t } }),
        ),
      ),
    );

    await runStep("장치 연결 해제", () =>
      espController.disconnect({ skipReset: true }),
    );

    downloadData(firmwareFile, "flash.bin", "application/octet-stream");
  };

  const writeFullFlash = async (getFile: () => File | undefined) => {
    initializeSteps(["파일 읽기", "장치 연결", "플래시 쓰기", "장치 재시작"]);

    const fileData = await runStep("파일 읽기", async () => {
      const file = getFile();
      if (!file) {
        throw new Error("파일을 찾을 수 없습니다");
      }
      return new Uint8Array(await file.arrayBuffer());
    });

    const espController = await runStep("장치 연결", async () => {
      const c = await EspController.fromRequestedDevice();
      await c.connect();
      return c;
    });

    await runStep("플래시 쓰기", () =>
      espController.writeFullFlash(fileData, (_, p, t) =>
        updateStepData("플래시 쓰기", { progress: { current: p, total: t } }),
      ),
    );

    await runStep("장치 재시작", () => espController.disconnect());
  };

  return {
    stepData,
    isRunning,
    actions: {
      flashEnglishFirmware: wrapWithRunning(flashEnglishFirmware),
      flashChineseFirmware: wrapWithRunning(flashChineseFirmware),
      flashCrossPointFirmware: wrapWithRunning(flashCrossPointFirmware),
      flashKoreanFirmware: wrapWithRunning(flashKoreanFirmware),
      flashKoreanFirmwareVersion: wrapWithRunning(flashKoreanFirmwareVersion),
      flashCustomFirmware: wrapWithRunning(flashCustomFirmware),
      saveFullFlash: wrapWithRunning(saveFullFlash),
      writeFullFlash: wrapWithRunning(writeFullFlash),
    },
  };
}
