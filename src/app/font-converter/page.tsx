"use client";

import { Suspense, lazy } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const FontConverter = lazy(() => import("@/components/font-converter"));

function LoadingSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">폰트 변환기 로드 중...</p>
      </div>
    </div>
  );
}

export default function FontConverterPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<LoadingSpinner />}>
          <FontConverter />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
