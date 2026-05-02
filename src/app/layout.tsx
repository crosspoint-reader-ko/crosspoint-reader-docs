// 모든 라우트가 [locale] 아래에 있으므로 실제 html/body는
// src/app/[locale]/layout.tsx 가 담당합니다. 루트 레이아웃은 단순 통과 역할.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
