import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join, basename } from "path";

const ROOT_DIR = join(import.meta.dirname, "..");
const PUBLIC_FIRMWARE_DIR = join(ROOT_DIR, "public", "firmware");

interface FirmwareSource {
  name: string;
  url: string;
  key: "korean" | "crosspoint";
}

interface FirmwareVersionInfo {
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

interface KoreanVersionEntry {
  tag_name: string;
  name: string;
  published_at: string;
  filename: string;
}

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "";

function githubHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "crosspoint-reader-docs-build",
  };
  if (GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  }
  return headers;
}

const FIRMWARE_SOURCES: FirmwareSource[] = [
  {
    name: "Korean Community",
    url: "https://api.github.com/repos/crosspoint-reader-ko/crosspoint-reader-ko/releases/latest",
    key: "korean",
  },
  {
    name: "CrossPoint Community",
    url: "https://api.github.com/repos/crosspoint-reader/crosspoint-reader/releases/latest",
    key: "crosspoint",
  },
];

interface OfficialFirmware {
  name: string;
  url: string;
  version: string;
  key: "english" | "x4Chinese" | "x3Chinese";
  // 파일명을 URL에서 그대로 추출 (스토어펌은 원본 파일명 유지)
  filename?: string;
}

const OFFICIAL_FIRMWARE_SOURCES: OfficialFirmware[] = [
  {
    name: "English Official (X4)",
    url: "http://gotaserver.xteink.com/api/download/ESP32C3/V5.1.6/V5.1.6-X4-EN-PROD-0304_.bin",
    version: "5.1.6",
    key: "english",
  },
  {
    name: "Chinese Official (X4)",
    url: "https://domestic-static-file.oss-cn-hangzhou.aliyuncs.com/admin_uploads/firmware/202604/30/751e134f-22b1-4a00-bbfa-0942593ef867/V5.5.3-X4-CH-PROD-0430_213333.bin",
    version: "5.5.3",
    key: "x4Chinese",
  },
  {
    name: "Chinese Official (X3)",
    url: "https://domestic-static-file.oss-cn-hangzhou.aliyuncs.com/admin_uploads/firmware/202604/30/751e134f-22b1-4a00-bbfa-0942593ef867/V5.5.3-X3-CH-PROD-0430_214320.bin",
    version: "5.5.3",
    key: "x3Chinese",
  },
];

const versionInfo: Record<string, string> = {};
const versionFilenames: Record<string, string> = {};
const officialFilenames: Record<string, string> = {};

function buildCrosspointFilename(tag: string): string {
  // crosspoint-{tag}.bin (e.g., crosspoint-1.2.0.bin, crosspoint-1.2.0-ko.15.bin)
  const safeTag = tag.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `crosspoint-${safeTag}.bin`;
}

function buildPartitionsFilename(tag: string): string {
  const safeTag = tag.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `crosspoint-${safeTag}-partitions.bin`;
}

async function downloadFirmware(source: FirmwareSource): Promise<void> {
  console.log(`📥 Downloading ${source.name} firmware...`);

  try {
    const releaseResponse = await fetch(source.url, {
      headers: githubHeaders(),
    });

    if (!releaseResponse.ok) {
      throw new Error(`Failed to fetch release info: ${releaseResponse.status}`);
    }

    const releaseData = await releaseResponse.json();

    const firmwareAsset = releaseData.assets?.find(
      (asset: { name: string }) => asset.name === "firmware.bin"
    );

    if (!firmwareAsset) {
      throw new Error("firmware.bin not found in release assets");
    }

    const version = releaseData.tag_name;
    const filename = buildCrosspointFilename(version);
    console.log(`   Found: ${firmwareAsset.name} (${version}) -> ${filename}`);

    versionInfo[source.key] = version;
    versionFilenames[source.key] = filename;

    const firmwareResponse = await fetch(firmwareAsset.browser_download_url, {
      headers: {
        "User-Agent": "crosspoint-reader-docs-build",
      },
    });

    if (!firmwareResponse.ok) {
      throw new Error(`Failed to download firmware: ${firmwareResponse.status}`);
    }

    const firmwareBuffer = await firmwareResponse.arrayBuffer();

    const outputPath = join(PUBLIC_FIRMWARE_DIR, filename);
    writeFileSync(outputPath, Buffer.from(firmwareBuffer));

    console.log(
      `   ✅ Saved to public/firmware/${filename} (${(firmwareBuffer.byteLength / 1024).toFixed(1)} KB)`
    );

    const partitionsAsset = releaseData.assets?.find(
      (asset: { name: string }) => asset.name === "partitions.bin"
    );
    if (partitionsAsset) {
      const partitionsResponse = await fetch(partitionsAsset.browser_download_url, {
        headers: { "User-Agent": "crosspoint-reader-docs-build" },
      });
      if (partitionsResponse.ok) {
        const partitionsBuffer = await partitionsResponse.arrayBuffer();
        const partitionsFilename = buildPartitionsFilename(version);
        writeFileSync(join(PUBLIC_FIRMWARE_DIR, partitionsFilename), Buffer.from(partitionsBuffer));
        console.log(
          `   ✅ Saved to public/firmware/${partitionsFilename} (${(partitionsBuffer.byteLength / 1024).toFixed(1)} KB)`
        );
      }
    }
  } catch (error) {
    console.error(`   ❌ Failed to download ${source.name}:`, error);
    throw error;
  }
}

async function downloadOfficialFirmware(source: OfficialFirmware): Promise<void> {
  // 스토어펌은 URL의 원본 파일명 유지
  const filename = basename(new URL(source.url).pathname);
  console.log(`📥 Downloading ${source.name} firmware (${source.version}) -> ${filename}...`);

  try {
    const response = await fetch(source.url, {
      headers: {
        "User-Agent": "crosspoint-reader-docs-build",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to download: ${response.status}`);
    }

    const firmwareBuffer = await response.arrayBuffer();

    const outputPath = join(PUBLIC_FIRMWARE_DIR, filename);
    writeFileSync(outputPath, Buffer.from(firmwareBuffer));

    officialFilenames[source.key] = filename;

    console.log(
      `   ✅ Saved to public/firmware/${filename} (${(firmwareBuffer.byteLength / 1024).toFixed(1)} KB)`
    );
  } catch (error) {
    console.error(`   ❌ Failed to download ${source.name}:`, error);
    console.log(`   ⚠️ Skipping ${source.name} - will not be available`);
  }
}

async function downloadKoreanFirmwareReleases(): Promise<KoreanVersionEntry[]> {
  console.log("📥 Downloading Korean firmware releases (last 5)...\n");
  const entries: KoreanVersionEntry[] = [];

  try {
    const response = await fetch(
      "https://api.github.com/repos/crosspoint-reader-ko/crosspoint-reader-ko/releases?per_page=5",
      {
        headers: githubHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch releases: ${response.status}`);
    }

    const releases = await response.json();
    const validReleases = releases.filter(
      (r: any) => !r.draft && !r.prerelease
    );

    for (const release of validReleases) {
      const firmwareAsset = release.assets?.find(
        (asset: any) => asset.name === "firmware.bin"
      );
      if (!firmwareAsset) {
        console.log(`   ⚠️ ${release.tag_name}: firmware.bin not found, skipping`);
        continue;
      }

      const filename = buildCrosspointFilename(release.tag_name);

      console.log(`   📥 ${release.tag_name} -> ${filename}...`);
      try {
        const fwResponse = await fetch(firmwareAsset.browser_download_url, {
          headers: { "User-Agent": "crosspoint-reader-docs-build" },
        });
        if (!fwResponse.ok) throw new Error(`HTTP ${fwResponse.status}`);

        const buffer = await fwResponse.arrayBuffer();
        writeFileSync(join(PUBLIC_FIRMWARE_DIR, filename), Buffer.from(buffer));
        console.log(`   ✅ ${filename} (${(buffer.byteLength / 1024).toFixed(1)} KB)`);

        const partitionsAsset = release.assets?.find(
          (asset: any) => asset.name === "partitions.bin"
        );
        if (partitionsAsset) {
          const ptResponse = await fetch(partitionsAsset.browser_download_url, {
            headers: { "User-Agent": "crosspoint-reader-docs-build" },
          });
          if (ptResponse.ok) {
            const ptBuffer = await ptResponse.arrayBuffer();
            const ptFilename = buildPartitionsFilename(release.tag_name);
            writeFileSync(join(PUBLIC_FIRMWARE_DIR, ptFilename), Buffer.from(ptBuffer));
            console.log(`   ✅ ${ptFilename} (${(ptBuffer.byteLength / 1024).toFixed(1)} KB)`);
          }
        }

        entries.push({
          tag_name: release.tag_name,
          name: release.name || release.tag_name,
          published_at: release.published_at,
          filename,
        });
      } catch (err) {
        console.error(`   ❌ Failed to download ${release.tag_name}:`, err);
      }
    }
  } catch (error) {
    console.error("   ❌ Failed to fetch Korean releases:", error);
  }

  const manifestPath = join(PUBLIC_FIRMWARE_DIR, "korean-versions.json");
  writeFileSync(manifestPath, JSON.stringify(entries, null, 2));
  console.log(`\n   📋 Saved korean-versions.json (${entries.length} versions)\n`);

  return entries;
}

async function main(): Promise<void> {
  console.log("🔧 Downloading firmware files for build...\n");

  if (!existsSync(PUBLIC_FIRMWARE_DIR)) {
    mkdirSync(PUBLIC_FIRMWARE_DIR, { recursive: true });
    console.log(`📁 Created directory: public/firmware\n`);
  }

  for (const source of FIRMWARE_SOURCES) {
    await downloadFirmware(source);
    console.log("");
  }

  console.log("📥 Downloading official firmware files...\n");
  for (const source of OFFICIAL_FIRMWARE_SOURCES) {
    await downloadOfficialFirmware(source);
    console.log("");
  }

  await downloadKoreanFirmwareReleases();

  const englishSource = OFFICIAL_FIRMWARE_SOURCES.find(s => s.key === "english")!;
  const x4Source = OFFICIAL_FIRMWARE_SOURCES.find(s => s.key === "x4Chinese")!;
  const x3Source = OFFICIAL_FIRMWARE_SOURCES.find(s => s.key === "x3Chinese")!;

  const versionData: FirmwareVersionInfo = {
    korean: versionInfo.korean || "unknown",
    koreanFile: versionFilenames.korean || "",
    crosspoint: versionInfo.crosspoint || "unknown",
    crosspointFile: versionFilenames.crosspoint || "",
    englishOfficial: englishSource.version,
    englishOfficialFile: officialFilenames.english || basename(new URL(englishSource.url).pathname),
    x4ChineseOfficial: x4Source.version,
    x4ChineseOfficialFile: officialFilenames.x4Chinese || basename(new URL(x4Source.url).pathname),
    x3ChineseOfficial: x3Source.version,
    x3ChineseOfficialFile: officialFilenames.x3Chinese || basename(new URL(x3Source.url).pathname),
    downloadedAt: new Date().toISOString(),
  };

  const versionPath = join(PUBLIC_FIRMWARE_DIR, "versions.json");
  writeFileSync(versionPath, JSON.stringify(versionData, null, 2));
  console.log(`📋 Saved version info to public/firmware/versions.json`);
  console.log(`   Korean: ${versionData.korean} (${versionData.koreanFile})`);
  console.log(`   CrossPoint: ${versionData.crosspoint} (${versionData.crosspointFile})`);
  console.log(`   English Official (X4): ${versionData.englishOfficial} (${versionData.englishOfficialFile})`);
  console.log(`   Chinese Official (X4): ${versionData.x4ChineseOfficial} (${versionData.x4ChineseOfficialFile})`);
  console.log(`   Chinese Official (X3): ${versionData.x3ChineseOfficial} (${versionData.x3ChineseOfficialFile})\n`);

  console.log("✅ All firmware files downloaded successfully!");
}

main().catch((error) => {
  console.error("Build failed:", error);
  process.exit(1);
});
