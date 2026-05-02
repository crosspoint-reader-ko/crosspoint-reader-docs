import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

/**
 * dev 환경에서만 동작합니다 (production은 `output: "export"` 라
 * middleware가 번들에 포함되지 않음). dev에서 `/install/` 같은 unprefixed
 * 경로를 기본 로케일(`/ko/install/`)로 internal rewrite하기 위해 사용합니다.
 *
 * Production에서는 scripts/postbuild-locale.ts가 빌드 산출물을 재배치해
 * 같은 URL 모양을 유지합니다.
 */
export default createMiddleware(routing);

export const config = {
  // `_next`, 정적 자산, 라우트가 아닌 파일은 제외
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
