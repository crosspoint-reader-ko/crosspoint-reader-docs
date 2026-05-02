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
import EspController, {
  AppPartitionLayout,
  parseAppLayoutFromPartitions,
} from "./EspController";

// Translator function for step labels. Provided by the caller (page) so that
// the hook stays decoupled from next-intl while still supporting i18n.
//   - tStep("connectDevice") -> "장치 연결" / "Connect device"
//   - tStep("flashAppPartitionWithLabel", { label: "app1" }) -> "앱 파티션 플래싱 (app1)"
export type StepTranslator = (
  key: string,
  values?: Record<string, string | number>,
) => string;

const defaultTStep: StepTranslator = (key) => key;

export function useEspOperations(tStep: StepTranslator = defaultTStep) {
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
      tStep("connectDevice"),
      tStep("downloadFirmware"),
      ...(getPartitions ? [tStep("updatePartitionTable")] : []),
      tStep("checkPartitionLayout"),
      tStep("readOtadataPartition"),
      tStep("flashAppPartition"),
      tStep("flashOtadataPartition"),
      tStep("restartDevice"),
    ];
    initializeSteps(steps);

    const espController = await runStep(tStep("connectDevice"), async () => {
      const c = await EspController.fromRequestedDevice();
      await c.connect();
      return c;
    });

    const firmwareFile = await runStep(tStep("downloadFirmware"), getFirmware);

    // Flash partition table if provided (needed for partition layout migration)
    let writtenPartitions: Uint8Array | null = null;
    if (getPartitions) {
      const updatePartitionTableLabel = tStep("updatePartitionTable");
      writtenPartitions = await runStep(updatePartitionTableLabel, async () => {
        const partitionsFile = await getPartitions();
        if (partitionsFile) {
          await espController.writePartitionTable(partitionsFile, (_, p, t) =>
            updateStepData(updatePartitionTableLabel, {
              progress: { current: p, total: t },
            }),
          );
          return partitionsFile;
        }
        return null;
      });
    }

    // Determine actual app0/app1 offsets. Prefer the just-written partition
    // table, otherwise read it back from the device. Fall back to defaults
    // if parsing fails.
    const layout = await runStep(tStep("checkPartitionLayout"), async () => {
      if (writtenPartitions) {
        const parsed = parseAppLayoutFromPartitions(writtenPartitions);
        if (parsed) return parsed;
      }
      const table = await espController.readPartitionTable();
      return parseAppLayoutFromPartitions(table) ?? undefined;
    });

    const readOtadataLabel = tStep("readOtadataPartition");
    const [otaPartition, backupPartitionLabel] = await runStep(
      readOtadataLabel,
      async (): Promise<
        [OtaPartition, OtaPartitionDetails["partitionLabel"]]
      > => {
        const partition = await espController.readOtadataPartition((_, p, t) =>
          updateStepData(readOtadataLabel, {
            progress: { current: p, total: t },
          }),
        );

        return [partition, partition.getCurrentBackupPartitionLabel()];
      },
    );

    const flashAppPartitionStepName = tStep("flashAppPartitionWithLabel", {
      label: backupPartitionLabel,
    });
    updateStepData(tStep("flashAppPartition"), {
      name: flashAppPartitionStepName,
    });
    await runStep(flashAppPartitionStepName, () =>
      espController.writeAppPartition(
        backupPartitionLabel,
        firmwareFile,
        layout as AppPartitionLayout | undefined,
        (_, p, t) =>
          updateStepData(flashAppPartitionStepName, {
            progress: { current: p, total: t },
          }),
      ),
    );

    const flashOtadataLabel = tStep("flashOtadataPartition");
    await runStep(flashOtadataLabel, async () => {
      otaPartition.setBootPartition(backupPartitionLabel);

      await espController.writeOtadataPartition(otaPartition, (_, p, t) =>
        updateStepData(flashOtadataLabel, {
          progress: { current: p, total: t },
        }),
      );
    });

    await runStep(tStep("restartDevice"), () => espController.disconnect());
  };

  const flashEnglishFirmware = async () =>
    flashRemoteFirmware(() => getOfficialFirmware("x4-en"));
  const flashX4ChineseFirmware = async () =>
    flashRemoteFirmware(() => getOfficialFirmware("x4-ch"));
  const flashX3ChineseFirmware = async () =>
    flashRemoteFirmware(() => getOfficialFirmware("x3-ch"));
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
      tStep("readFile"),
      tStep("connectDevice"),
      tStep("checkPartitionLayout"),
      tStep("readOtadataPartition"),
      tStep("flashAppPartition"),
      tStep("flashOtadataPartition"),
      tStep("restartDevice"),
    ]);

    const fileData = await runStep(tStep("readFile"), async () => {
      const file = getFile();
      if (!file) {
        throw new Error(tStep("fileNotFound"));
      }
      return new Uint8Array(await file.arrayBuffer());
    });

    const espController = await runStep(tStep("connectDevice"), async () => {
      const c = await EspController.fromRequestedDevice();
      await c.connect();
      return c;
    });

    const layout = await runStep(tStep("checkPartitionLayout"), async () => {
      const table = await espController.readPartitionTable();
      return parseAppLayoutFromPartitions(table) ?? undefined;
    });

    const readOtadataLabel = tStep("readOtadataPartition");
    const [otaPartition, backupPartitionLabel] = await runStep(
      readOtadataLabel,
      async (): Promise<
        [OtaPartition, OtaPartitionDetails["partitionLabel"]]
      > => {
        const partition = await espController.readOtadataPartition((_, p, t) =>
          updateStepData(readOtadataLabel, {
            progress: { current: p, total: t },
          }),
        );

        return [partition, partition.getCurrentBackupPartitionLabel()];
      },
    );

    const flashAppPartitionStepName = tStep("flashAppPartitionWithLabel", {
      label: backupPartitionLabel,
    });
    updateStepData(tStep("flashAppPartition"), {
      name: flashAppPartitionStepName,
    });
    await runStep(flashAppPartitionStepName, () =>
      espController.writeAppPartition(
        backupPartitionLabel,
        fileData,
        layout as AppPartitionLayout | undefined,
        (_, p, t) =>
          updateStepData(flashAppPartitionStepName, {
            progress: { current: p, total: t },
          }),
      ),
    );

    const flashOtadataLabel = tStep("flashOtadataPartition");
    await runStep(flashOtadataLabel, async () => {
      otaPartition.setBootPartition(backupPartitionLabel);

      await espController.writeOtadataPartition(otaPartition, (_, p, t) =>
        updateStepData(flashOtadataLabel, {
          progress: { current: p, total: t },
        }),
      );
    });

    await runStep(tStep("restartDevice"), () => espController.disconnect());
  };

  const saveFullFlash = async () => {
    initializeSteps([
      tStep("connectDevice"),
      tStep("readFlash"),
      tStep("disconnectDevice"),
    ]);

    const espController = await runStep(tStep("connectDevice"), async () => {
      const c = await EspController.fromRequestedDevice();
      await c.connect();
      return c;
    });

    const readFlashLabel = tStep("readFlash");
    const firmwareFile = await runStep(
      readFlashLabel,
      wrapWithWakeLock(() =>
        espController.readFullFlash((_, p, t) =>
          updateStepData(readFlashLabel, {
            progress: { current: p, total: t },
          }),
        ),
      ),
    );

    await runStep(tStep("disconnectDevice"), () =>
      espController.disconnect({ skipReset: true }),
    );

    downloadData(firmwareFile, "flash.bin", "application/octet-stream");
  };

  const writeFullFlash = async (getFile: () => File | undefined) => {
    initializeSteps([
      tStep("readFile"),
      tStep("connectDevice"),
      tStep("writeFlash"),
      tStep("restartDevice"),
    ]);

    const fileData = await runStep(tStep("readFile"), async () => {
      const file = getFile();
      if (!file) {
        throw new Error(tStep("fileNotFound"));
      }
      return new Uint8Array(await file.arrayBuffer());
    });

    const espController = await runStep(tStep("connectDevice"), async () => {
      const c = await EspController.fromRequestedDevice();
      await c.connect();
      return c;
    });

    const writeFlashLabel = tStep("writeFlash");
    await runStep(writeFlashLabel, () =>
      espController.writeFullFlash(fileData, (_, p, t) =>
        updateStepData(writeFlashLabel, {
          progress: { current: p, total: t },
        }),
      ),
    );

    await runStep(tStep("restartDevice"), () => espController.disconnect());
  };

  return {
    stepData,
    isRunning,
    actions: {
      flashEnglishFirmware: wrapWithRunning(flashEnglishFirmware),
      flashX4ChineseFirmware: wrapWithRunning(flashX4ChineseFirmware),
      flashX3ChineseFirmware: wrapWithRunning(flashX3ChineseFirmware),
      flashCrossPointFirmware: wrapWithRunning(flashCrossPointFirmware),
      flashKoreanFirmware: wrapWithRunning(flashKoreanFirmware),
      flashKoreanFirmwareVersion: wrapWithRunning(flashKoreanFirmwareVersion),
      flashCustomFirmware: wrapWithRunning(flashCustomFirmware),
      saveFullFlash: wrapWithRunning(saveFullFlash),
      writeFullFlash: wrapWithRunning(writeFullFlash),
    },
  };
}
