import type { FreeTypeInstance, FreeTypeInit } from "@/types/freetype";
import { basePath } from "./basePath";

let freetypeInstance: FreeTypeInstance | null = null;
let loadingPromise: Promise<FreeTypeInstance> | null = null;

/**
 * Main-thread FreeType instance. Used for lightweight work (font validation,
 * preview rendering). Heavy conversion runs in the Web Worker — see
 * `freetype-worker.ts` / `freetype-worker-client.ts`.
 */
export async function loadFreeType(): Promise<FreeTypeInstance> {
  if (freetypeInstance) return freetypeInstance;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    try {
      const wasmDir = `${basePath}/wasm/`;
      const jsUrl = `${wasmDir}freetype.js`;
      const module = (await import(/* webpackIgnore: true */ jsUrl)) as {
        default: FreeTypeInit;
      };
      const init = module.default as unknown as (
        opts: Record<string, unknown>,
      ) => Promise<FreeTypeInstance>;
      freetypeInstance = await init({
        locateFile: (path: string) => `${wasmDir}${path}`,
        // Match the worker's pre-sized heap so main-thread validation /
        // preview rendering doesn't OOM on large fonts. emscripten_resize_heap
        // is compiled in, so this can still grow up to ~2GB.
        INITIAL_MEMORY: 256 * 1024 * 1024,
      });
      return freetypeInstance;
    } catch (err) {
      loadingPromise = null;
      throw err;
    }
  })();

  return loadingPromise;
}

export function getFreeType(): FreeTypeInstance | null {
  return freetypeInstance;
}
