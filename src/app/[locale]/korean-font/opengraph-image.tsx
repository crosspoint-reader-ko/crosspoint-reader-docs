import { generateOGImage, ogSize, ogContentType } from "@/lib/og";

export const dynamic = "force-static"

export function generateStaticParams() {
  return [{ locale: "ko" }, { locale: "en" }];
}

export const alt = "한글 폰트 정보 | CrossPoint Reader";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return generateOGImage(
    "한글 폰트 정보",
    "KoPub 바탕, Pretendard 등 내장 한글 폰트 정보와 라이선스",
  );
}
