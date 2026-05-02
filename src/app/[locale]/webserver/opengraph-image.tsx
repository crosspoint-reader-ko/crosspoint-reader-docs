import { generateOGImage, ogSize, ogContentType } from "@/lib/og";

export const dynamic = "force-static"

export function generateStaticParams() {
  return [{ locale: "ko" }, { locale: "en" }];
}

export const alt = "웹 서버 가이드 | CrossPoint Reader";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return generateOGImage(
    "웹 서버 가이드",
    "내장 웹 서버를 통해 무선으로 전자책 파일을 업로드하는 방법",
  );
}
