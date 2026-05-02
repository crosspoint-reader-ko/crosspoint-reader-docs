import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

// 추가 namespace 파일을 만들면 여기 등록만 하면 됨.
// 'common'은 top-level로 spread, 그 외는 파일명을 namespace prefix로 사용.
const NAMESPACES = [
  "common",
  "home",
  "install",
  "flasher",
  "fontConverter",
  "koreanFont",
  "webserver",
  "guide",
  "releases",
] as const;

async function loadNamespace(
  locale: string,
  ns: string,
): Promise<Record<string, unknown> | null> {
  try {
    const mod = await import(`../../messages/${locale}/${ns}.json`);
    return mod.default ?? mod;
  } catch {
    return null;
  }
}

async function loadMessages(locale: string): Promise<Record<string, unknown>> {
  const merged: Record<string, unknown> = {};
  for (const ns of NAMESPACES) {
    const data = await loadNamespace(locale, ns);
    if (!data) continue;
    if (ns === "common") {
      Object.assign(merged, data);
    } else {
      merged[ns] = data;
    }
  }
  return merged;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: await loadMessages(locale),
  };
});
