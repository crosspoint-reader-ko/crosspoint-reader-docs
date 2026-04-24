import type { Metadata } from "next";
import "./globals.css";
import { basePath } from "@/lib/basePath";

const siteUrl = "https://eunchurn.github.io/crosspoint-reader-docs";
const siteName = "CrossPoint Reader 한국어";
const siteDescription =
  "Xteink X3 및 X4 전자잉크 리더를 위한 CrossPoint Reader 한국어 펌웨어 설치 및 사용 가이드. EPUB, XTC, XTCH 파일을 지원하며 한글 폰트가 내장되어 있습니다.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "CrossPoint Reader - 한국어 펌웨어 가이드",
    template: "%s | CrossPoint Reader",
  },
  description: siteDescription,
  keywords: [
    "CrossPoint Reader",
    "Xteink X3",
    "Xteink X4",
    "전자책",
    "e-ink",
    "펌웨어",
    "한국어",
    "EPUB",
    "XTC",
    "XTCH",
    "전자잉크",
    "이북리더",
    "오픈소스",
  ],
  authors: [
    { name: "eunchurn", url: "https://github.com/eunchurn" },
    { name: "Dave Allie", url: "https://github.com/daveallie" },
  ],
  creator: "eunchurn",
  publisher: "CrossPoint Reader Contributors",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: siteName,
    description: siteDescription,
    url: siteUrl,
    siteName: siteName,
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
    images: ["/opengraph-image"],
    creator: "@eunchurn",
  },
  icons: {
    icon: [
      { url: `${basePath}/logo.svg`, type: "image/svg+xml" },
      { url: `${basePath}/web-app-manifest-192x192.png`, sizes: "192x192", type: "image/png" },
      { url: `${basePath}/web-app-manifest-512x512.png`, sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: `${basePath}/web-app-manifest-192x192.png`, sizes: "192x192", type: "image/png" },
    ],
  },
  manifest: `${basePath}/manifest.json`,
  alternates: {
    canonical: siteUrl,
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body className="bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  );
}
