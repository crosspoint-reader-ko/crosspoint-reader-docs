import { getAssetPath } from "@/lib/basePath";

// 공식 펌웨어는 빌드 시 다운로드되어 로컬에 저장됨 (Mixed Content 문제 해결)
const officialFirmwareFiles = {
  "5.1.6-EN": "/firmware/english-official-firmware.bin",
  "5.3.9-CH": "/firmware/chinese-official-firmware.bin",
};

export interface FirmwareVersions {
  korean: string;
  crosspoint: string;
  englishOfficial: string;
  chineseOfficial: string;
  downloadedAt: string;
}

let cachedVersions: FirmwareVersions | null = null;

export async function getFirmwareVersions(): Promise<FirmwareVersions> {
  if (cachedVersions) {
    return cachedVersions;
  }

  const url = getAssetPath("/firmware/versions.json");
  const response = await fetch(url);
  if (!response.ok) {
    return {
      korean: "unknown",
      crosspoint: "unknown",
      englishOfficial: "unknown",
      chineseOfficial: "unknown",
      downloadedAt: "",
    };
  }
  cachedVersions = await response.json();
  return cachedVersions!;
}

async function fetchFirmwareFromUrl(url: string): Promise<Uint8Array> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download firmware: ${response.status}`);
  }
  return new Uint8Array(await response.arrayBuffer());
}

export async function getOfficialFirmware(
  version: keyof typeof officialFirmwareFiles,
) {
  const url = getAssetPath(officialFirmwareFiles[version]);
  return fetchFirmwareFromUrl(url);
}

export async function getCommunityFirmware(firmware: "CrossPoint") {
  if (firmware === "CrossPoint") {
    // Firmware is downloaded at build time and stored in public/firmware
    const url = getAssetPath("/firmware/crosspoint-firmware.bin");
    return fetchFirmwareFromUrl(url);
  }

  throw new Error("Unsupported community firmware");
}

export async function getKoreanCommunityFirmware() {
  // Firmware is downloaded at build time and stored in public/firmware
  const url = getAssetPath("/firmware/korean-firmware.bin");
  return fetchFirmwareFromUrl(url);
}

export async function getKoreanPartitions(): Promise<Uint8Array | null> {
  try {
    const url = getAssetPath("/firmware/korean-partitions.bin");
    return await fetchFirmwareFromUrl(url);
  } catch {
    return null;
  }
}

export async function getKoreanPartitionsByTag(tag: string): Promise<Uint8Array | null> {
  try {
    const safeTag = tag.replace(/[^a-zA-Z0-9._-]/g, "_");
    const url = getAssetPath(`/firmware/korean-partitions-${safeTag}.bin`);
    return await fetchFirmwareFromUrl(url);
  } catch {
    return null;
  }
}

export interface KoreanFirmwareRelease {
  tag_name: string;
  name: string;
  filename: string;
  published_at: string;
}

let cachedKoreanReleases: KoreanFirmwareRelease[] | null = null;

export async function getKoreanFirmwareReleases(): Promise<KoreanFirmwareRelease[]> {
  if (cachedKoreanReleases) return cachedKoreanReleases;

  try {
    const url = getAssetPath("/firmware/korean-versions.json");
    const response = await fetch(url);
    if (!response.ok) return [];
    cachedKoreanReleases = await response.json();
    return cachedKoreanReleases!;
  } catch {
    return [];
  }
}

export async function getKoreanFirmwareByTag(filename: string): Promise<Uint8Array> {
  const url = getAssetPath(`/firmware/${filename}`);
  return fetchFirmwareFromUrl(url);
}
