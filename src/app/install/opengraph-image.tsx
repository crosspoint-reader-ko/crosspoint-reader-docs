import { generateOGImage, ogSize, ogContentType } from "@/lib/og";

export const dynamic = "force-static"

export const alt = "설치 가이드 | CrossPoint Reader";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return generateOGImage(
    "설치 가이드",
    "Xteink X3/X4에 CrossPoint Reader 한국어 펌웨어를 설치하는 방법",
  );
}
