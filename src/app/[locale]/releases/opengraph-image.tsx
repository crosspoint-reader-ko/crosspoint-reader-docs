import { generateOGImage, ogSize, ogContentType } from "@/lib/og";

export const dynamic = "force-static"

export function generateStaticParams() {
  return [{ locale: "ko" }, { locale: "en" }];
}

export const alt = "릴리즈 노트 | CrossPoint Reader";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return generateOGImage(
    "릴리즈 노트",
    "CrossPoint Reader 한국어 펌웨어 업데이트 및 변경사항",
  );
}
