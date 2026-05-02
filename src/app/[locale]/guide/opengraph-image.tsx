import { generateOGImage, ogSize, ogContentType } from "@/lib/og";

export const dynamic = "force-static"

export function generateStaticParams() {
  return [{ locale: "ko" }, { locale: "en" }];
}

export const alt = "사용자 가이드 | CrossPoint Reader";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return generateOGImage(
    "사용자 가이드",
    "CrossPoint Reader 한국어 펌웨어의 모든 기능과 사용법",
  );
}
