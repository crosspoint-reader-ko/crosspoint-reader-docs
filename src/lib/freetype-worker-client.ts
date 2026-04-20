import { basePath } from "./basePath";

export interface WorkerGlyph {
  codePoint: number;
  width: number;
  height: number;
  advanceX: number;
  left: number;
  top: number;
  data: Uint8Array;
}

export interface WorkerMetrics {
  ascender: number;
  descender: number;
  height: number;
}

export interface WorkerConvertRequest {
  fontData: Uint8Array;
  fontSize: number;
  is2Bit: boolean;
  antialiasing: boolean;
  codePoints: number[];
  charSpacing: number;
  horizontalScale: number;
  baselineShift: number;
}

export interface WorkerProgress {
  progress: number;
  message: string;
}

export interface WorkerResult {
  glyphs: WorkerGlyph[];
  metrics: WorkerMetrics;
}

type WorkerMessage =
  | { type: "progress"; progress: number; message: string }
  | { type: "done"; result: WorkerResult }
  | { type: "error"; error: string };

let worker: Worker | null = null;

function getWorker(): Worker {
  if (!worker) {
    worker = new Worker(new URL("./freetype-worker.ts", import.meta.url), {
      type: "module",
      name: "epdfont-freetype-worker",
    });
    worker.postMessage({ type: "init", wasmBase: `${basePath}/wasm/` });
  }
  return worker;
}

export function convertInWorker(
  req: WorkerConvertRequest,
  onProgress: (p: WorkerProgress) => void,
): Promise<WorkerResult> {
  return new Promise((resolve, reject) => {
    const w = getWorker();
    const handleMessage = (ev: MessageEvent<WorkerMessage>) => {
      const msg = ev.data;
      if (msg.type === "progress") {
        onProgress({ progress: msg.progress, message: msg.message });
      } else if (msg.type === "done") {
        w.removeEventListener("message", handleMessage);
        resolve(msg.result);
      } else if (msg.type === "error") {
        w.removeEventListener("message", handleMessage);
        reject(new Error(msg.error));
      }
    };
    w.addEventListener("message", handleMessage);
    w.postMessage({ type: "convert", req }, [req.fontData.buffer]);
  });
}
