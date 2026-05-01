import { getAssetPath } from "@/lib/basePath";

export interface FirmwareVersions {
  korean: string;
  koreanFile: string;
  crosspoint: string;
  crosspointFile: string;
  englishOfficial: string;
  englishOfficialFile: string;
  x4ChineseOfficial: string;
  x4ChineseOfficialFile: string;
  x3ChineseOfficial: string;
  x3ChineseOfficialFile: string;
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
      koreanFile: "",
      crosspoint: "unknown",
      crosspointFile: "",
      englishOfficial: "unknown",
      englishOfficialFile: "",
      x4ChineseOfficial: "unknown",
      x4ChineseOfficialFile: "",
      x3ChineseOfficial: "unknown",
      x3ChineseOfficialFile: "",
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

export type OfficialFirmwareKey = "x4-en" | "x4-ch" | "x3-ch";

export async function getOfficialFirmware(key: OfficialFirmwareKey) {
  const versions = await getFirmwareVersions();
  let filename: string;
  switch (key) {
    case "x4-en":
      filename = versions.englishOfficialFile;
      break;
    case "x4-ch":
      filename = versions.x4ChineseOfficialFile;
      break;
    case "x3-ch":
      filename = versions.x3ChineseOfficialFile;
      break;
  }
  if (!filename) {
    throw new Error(`Official firmware not available: ${key}`);
  }
  const url = getAssetPath(`/firmware/${filename}`);
  return fetchFirmwareFromUrl(url);
}

export async function getCommunityFirmware(firmware: "CrossPoint") {
  if (firmware === "CrossPoint") {
    const versions = await getFirmwareVersions();
    if (!versions.crosspointFile) {
      throw new Error("CrossPoint firmware not available");
    }
    const url = getAssetPath(`/firmware/${versions.crosspointFile}`);
    return fetchFirmwareFromUrl(url);
  }

  throw new Error("Unsupported community firmware");
}

export async function getKoreanCommunityFirmware() {
  const versions = await getFirmwareVersions();
  if (!versions.koreanFile) {
    throw new Error("Korean firmware not available");
  }
  const url = getAssetPath(`/firmware/${versions.koreanFile}`);
  return fetchFirmwareFromUrl(url);
}

export async function getKoreanPartitions(): Promise<Uint8Array | null> {
  try {
    const versions = await getFirmwareVersions();
    if (!versions.koreanFile) return null;
    // koreanFile: crosspoint-1.2.0-ko.15.bin -> crosspoint-1.2.0-ko.15-partitions.bin
    const partitionsName = versions.koreanFile.replace(/\.bin$/, "-partitions.bin");
    const url = getAssetPath(`/firmware/${partitionsName}`);
    return await fetchFirmwareFromUrl(url);
  } catch {
    return null;
  }
}

export async function getKoreanPartitionsByTag(tag: string): Promise<Uint8Array | null> {
  try {
    const safeTag = tag.replace(/[^a-zA-Z0-9._-]/g, "_");
    const url = getAssetPath(`/firmware/crosspoint-${safeTag}-partitions.bin`);
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

export function getOfficialFirmwareDownloadPath(key: OfficialFirmwareKey, versions: FirmwareVersions): string | null {
  let filename: string;
  switch (key) {
    case "x4-en":
      filename = versions.englishOfficialFile;
      break;
    case "x4-ch":
      filename = versions.x4ChineseOfficialFile;
      break;
    case "x3-ch":
      filename = versions.x3ChineseOfficialFile;
      break;
  }
  if (!filename) return null;
  return getAssetPath(`/firmware/${filename}`);
}

export function getCrossPointFirmwareDownloadPath(versions: FirmwareVersions): string | null {
  if (!versions.crosspointFile) return null;
  return getAssetPath(`/firmware/${versions.crosspointFile}`);
}

export function getKoreanFirmwareDownloadPath(versions: FirmwareVersions): string | null {
  if (!versions.koreanFile) return null;
  return getAssetPath(`/firmware/${versions.koreanFile}`);
}
