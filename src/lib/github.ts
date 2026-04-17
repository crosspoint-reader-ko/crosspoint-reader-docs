export interface Contributor {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

export interface Release {
  id: number;
  tag_name: string;
  name: string;
  body: string;
  html_url: string;
  published_at: string;
  prerelease: boolean;
  draft: boolean;
  assets: {
    name: string;
    browser_download_url: string;
    size: number;
    download_count: number;
  }[];
}

export async function getReleases(): Promise<Release[]> {
  try {
    // 타임스탬프를 URL에 추가하여 캐시 방지
    const timestamp = Date.now();
    const response = await fetch(
      `https://api.github.com/repos/crosspoint-reader-ko/crosspoint-reader-ko/releases?_t=${timestamp}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "crosspoint-reader-docs",
        },
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch releases:", response.statusText);
      return [];
    }

    const data = await response.json();
    return data.map((release: Release) => ({
      id: release.id,
      tag_name: release.tag_name,
      name: release.name,
      body: release.body,
      html_url: release.html_url,
      published_at: release.published_at,
      prerelease: release.prerelease,
      draft: release.draft,
      assets: release.assets.map((asset) => ({
        name: asset.name,
        browser_download_url: asset.browser_download_url,
        size: asset.size,
        download_count: asset.download_count,
      })),
    }));
  } catch (error) {
    console.error("Error fetching releases:", error);
    return [];
  }
}

export interface LatestRelease {
  tag_name: string;
  name: string;
  html_url: string;
  published_at: string;
  // 머지된 바이너리 (esptool용) - CrossPoint-x.x.x.bin
  merged_firmware_url: string | null;
  merged_firmware_name: string | null;
  merged_firmware_size: number | null;
  // 웹 플래시용 - firmware.bin
  web_firmware_url: string | null;
  web_firmware_name: string | null;
  web_firmware_size: number | null;
}

export async function getLatestRelease(): Promise<LatestRelease | null> {
  try {
    const timestamp = Date.now();
    const response = await fetch(
      `https://api.github.com/repos/crosspoint-reader-ko/crosspoint-reader-ko/releases/latest?_t=${timestamp}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "crosspoint-reader-docs",
        },
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch latest release:", response.statusText);
      return null;
    }

    const data = await response.json();

    // 머지된 펌웨어 (CrossPoint-*.bin) - esptool용
    const mergedAsset = data.assets?.find(
      (asset: { name: string }) =>
        asset.name.startsWith("CrossPoint-") && asset.name.endsWith(".bin")
    );

    // 웹 플래시용 펌웨어 (firmware.bin)
    const webAsset = data.assets?.find(
      (asset: { name: string }) => asset.name === "firmware.bin"
    );

    return {
      tag_name: data.tag_name,
      name: data.name,
      html_url: data.html_url,
      published_at: data.published_at,
      merged_firmware_url: mergedAsset?.browser_download_url || null,
      merged_firmware_name: mergedAsset?.name || null,
      merged_firmware_size: mergedAsset?.size || null,
      web_firmware_url: webAsset?.browser_download_url || null,
      web_firmware_name: webAsset?.name || null,
      web_firmware_size: webAsset?.size || null,
    };
  } catch (error) {
    console.error("Error fetching latest release:", error);
    return null;
  }
}

export async function getContributors(): Promise<Contributor[]> {
  try {
    const response = await fetch(
      "https://api.github.com/repos/crosspoint-reader/crosspoint-reader/contributors",
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          // GitHub API rate limit을 피하기 위해 User-Agent 설정
          "User-Agent": "crosspoint-reader-docs",
        },
        // 빌드 시 캐시 (revalidate 없이 정적 생성)
        next: { revalidate: false },
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch contributors:", response.statusText);
      return getDefaultContributors();
    }

    const data = await response.json();
    return data.map((contributor: Contributor) => ({
      login: contributor.login,
      avatar_url: contributor.avatar_url,
      html_url: contributor.html_url,
      contributions: contributor.contributions,
    }));
  } catch (error) {
    console.error("Error fetching contributors:", error);
    return getDefaultContributors();
  }
}

// API 실패 시 폴백용 기본 데이터
function getDefaultContributors(): Contributor[] {
  return [
    {
      login: "daveallie",
      avatar_url: "https://avatars.githubusercontent.com/u/968573?v=4",
      html_url: "https://github.com/daveallie",
      contributions: 107,
    },
    {
      login: "jonasdiemer",
      avatar_url: "https://avatars.githubusercontent.com/u/1502748?v=4",
      html_url: "https://github.com/jonasdiemer",
      contributions: 13,
    },
    {
      login: "IFAKA",
      avatar_url: "https://avatars.githubusercontent.com/u/99131130?v=4",
      html_url: "https://github.com/IFAKA",
      contributions: 10,
    },
    {
      login: "eunchurn",
      avatar_url: "https://avatars.githubusercontent.com/u/7800413?v=4",
      html_url: "https://github.com/eunchurn",
      contributions: 4,
    },
    {
      login: "olearycrew",
      avatar_url: "https://avatars.githubusercontent.com/u/6044920?v=4",
      html_url: "https://github.com/olearycrew",
      contributions: 4,
    },
    {
      login: "osteotek",
      avatar_url: "https://avatars.githubusercontent.com/u/651075?v=4",
      html_url: "https://github.com/osteotek",
      contributions: 3,
    },
    {
      login: "1991AcuraLegend",
      avatar_url: "https://avatars.githubusercontent.com/u/251075421?v=4",
      html_url: "https://github.com/1991AcuraLegend",
      contributions: 1,
    },
    {
      login: "treetrum",
      avatar_url: "https://avatars.githubusercontent.com/u/4800689?v=4",
      html_url: "https://github.com/treetrum",
      contributions: 1,
    },
  ];
}
