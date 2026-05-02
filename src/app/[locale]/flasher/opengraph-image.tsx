import { generateOGImage, ogSize, ogContentType } from "@/lib/og";

export const dynamic = "force-static"

export function generateStaticParams() {
  return [{ locale: "ko" }, { locale: "en" }];
}

export const alt = "웹 플래셔 | CrossPoint Reader";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return generateOGImage(
    "웹 플래셔",
    "웹 브라우저에서 바로 CrossPoint Reader 펌웨어를 설치하세요",
  );
}
