import { generateOGImage, ogSize, ogContentType } from "@/lib/og";

export const dynamic = "force-static"

export const alt = "CrossPoint Reader - 한국어 펌웨어 가이드";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return generateOGImage(
    "CrossPoint Reader",
    "Xteink X3/X4 전자잉크 리더를 위한 한국어 오픈소스 펌웨어",
  );
}
