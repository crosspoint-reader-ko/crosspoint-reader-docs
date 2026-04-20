import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import KoreanFontContent from "@/components/KoreanFontContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "한글 폰트 정보",
  description:
    "CrossPoint Reader 한국어 버전에 내장된 KoPub 바탕, Pretendard 한글 폰트 정보와 라이선스를 안내합니다.",
  openGraph: {
    title: "한글 폰트 정보 | CrossPoint Reader",
    description:
      "CrossPoint Reader 한국어 버전에 내장된 KoPub 바탕, Pretendard 한글 폰트 정보를 안내합니다.",
  },
};

export default function KoreanFontPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="grow">
        <Suspense fallback={<div className="min-h-screen" />}>
          <KoreanFontContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
