// WebSerial client for the SerialFileBridge running on the device.
// Wire format mirrors src/io/SerialFileBridge.{h,cpp} in the firmware repo:
//   SLIP framing (0xC0 delimiter, 0xDB escape) wraps a binary record:
//   [u8 opcode][u16 reqid LE][payload...]
// Response opcode = request opcode | 0x80; errors use opcode 0xFF.

const SLIP_END = 0xc0;
const SLIP_ESC = 0xdb;
const SLIP_ESC_END = 0xdc;
const SLIP_ESC_ESC = 0xdd;

export const OP_PING = 0x01;
export const OP_LIST_DIR = 0x02;
export const OP_STAT = 0x03;
export const OP_READ = 0x04;
export const OP_WRITE_BEGIN = 0x05;
export const OP_WRITE_CHUNK = 0x06;
export const OP_WRITE_END = 0x07;
export const OP_DELETE = 0x08;
export const OP_MKDIR = 0x09;
export const OP_RENAME = 0x0a;
export const OP_ERROR = 0xff;

const RESPONSE_BIT = 0x80;

// Match firmware MAX_*_CHUNK constants. 1024 B trades a higher per-chunk
// truncation rate (handled by retry) for fewer round-trips overall, which
// in practice gives better throughput than the 256 B variant.
export const MAX_READ_CHUNK = 1024;
export const MAX_WRITE_CHUNK = 1024;

// ESP32-C3 vendor ID (Espressif). PID varies across boards so leave open.
export const ESP32_FILTERS: SerialPortFilter[] = [{ usbVendorId: 0x303a }];

export type FileType = "file" | "dir";

export interface DirEntry {
  name: string;
  type: FileType;
  size: number;
}

export interface PingInfo {
  firmware: string;
  freeHeap: number;
}

export interface StatInfo {
  type: FileType;
  size: number;
}

export class BridgeError extends Error {
  readonly code: number;
  constructor(code: number, message: string) {
    super(message);
    this.code = code;
    this.name = "BridgeError";
  }
}

interface PendingRequest {
  resolve: (data: Uint8Array) => void;
  reject: (err: Error) => void;
  expectedOpcode: number;
  timer: ReturnType<typeof setTimeout> | null;
}

function encodeSlip(payload: Uint8Array): Uint8Array {
  // Worst case every byte gets escaped; +2 for leading/trailing delimiters.
  const out = new Uint8Array(payload.length * 2 + 2);
  let i = 0;
  out[i++] = SLIP_END;
  for (const b of payload) {
    if (b === SLIP_END) {
      out[i++] = SLIP_ESC;
      out[i++] = SLIP_ESC_END;
    } else if (b === SLIP_ESC) {
      out[i++] = SLIP_ESC;
      out[i++] = SLIP_ESC_ESC;
    } else {
      out[i++] = b;
    }
  }
  out[i++] = SLIP_END;
  return out.subarray(0, i);
}

class SlipDecoder {
  private buf: number[] = [];
  private escape = false;
  private started = false;

  // Feed raw bytes; returns any complete frames as Uint8Arrays. Callers
  // typically iterate over returned frames before feeding more bytes.
  feed(chunk: Uint8Array): Uint8Array[] {
    const frames: Uint8Array[] = [];
    for (const b of chunk) {
      if (b === SLIP_END) {
        if (this.started && this.buf.length > 0) {
          frames.push(Uint8Array.from(this.buf));
        }
        this.buf = [];
        this.escape = false;
        this.started = true;
        continue;
      }
      if (!this.started) continue;
      if (this.escape) {
        let real = b;
        if (b === SLIP_ESC_END) real = SLIP_END;
        else if (b === SLIP_ESC_ESC) real = SLIP_ESC;
        this.buf.push(real);
        this.escape = false;
      } else if (b === SLIP_ESC) {
        this.escape = true;
      } else {
        this.buf.push(b);
      }
    }
    return frames;
  }

  reset(): void {
    this.buf = [];
    this.escape = false;
    this.started = false;
  }
}

const ENC = new TextEncoder();
const DEC = new TextDecoder("utf-8", { fatal: false });

function pushU16LE(out: number[], v: number): void {
  out.push(v & 0xff, (v >> 8) & 0xff);
}

function pushU32LE(out: number[], v: number): void {
  out.push(v & 0xff, (v >> 8) & 0xff, (v >> 16) & 0xff, (v >>> 24) & 0xff);
}

function pushU64LE(out: number[], v: number): void {
  // JS numbers safely cover up to 2^53; SD files realistically fit.
  const lo = v >>> 0;
  const hi = Math.floor(v / 0x100000000);
  pushU32LE(out, lo);
  pushU32LE(out, hi);
}

function pushLString(out: number[], s: string): void {
  const bytes = ENC.encode(s);
  pushU16LE(out, bytes.length);
  for (const b of bytes) out.push(b);
}

function readU16LE(view: DataView, offset: number): number {
  return view.getUint16(offset, true);
}

function readU32LE(view: DataView, offset: number): number {
  return view.getUint32(offset, true);
}

function readU64LE(view: DataView, offset: number): number {
  const lo = view.getUint32(offset, true);
  const hi = view.getUint32(offset + 4, true);
  return hi * 0x100000000 + lo;
}

export interface BridgeOptions {
  baudRate?: number;
  requestTimeoutMs?: number;
  onLogChunk?: (text: string) => void;
  onDisconnect?: (reason: string) => void;
}

export class SerialBridge {
  private port: SerialPort | null = null;
  private writer: WritableStreamDefaultWriter<Uint8Array> | null = null;
  private reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
  private decoder = new SlipDecoder();
  private pending = new Map<number, PendingRequest>();
  private nextReqId = 1;
  private readLoopPromise: Promise<void> | null = null;
  private logBuf: number[] = [];
  private opts: Required<Omit<BridgeOptions, "onLogChunk" | "onDisconnect">> & {
    onLogChunk?: (text: string) => void;
    onDisconnect?: (reason: string) => void;
  };

  constructor(opts: BridgeOptions = {}) {
    this.opts = {
      baudRate: opts.baudRate ?? 115200,
      requestTimeoutMs: opts.requestTimeoutMs ?? 30000,
      onLogChunk: opts.onLogChunk,
      onDisconnect: opts.onDisconnect,
    };
  }

  static isSupported(): boolean {
    return typeof navigator !== "undefined" && "serial" in navigator;
  }

  isConnected(): boolean {
    return this.port !== null && this.writer !== null;
  }

  async connect(port: SerialPort): Promise<void> {
    if (this.port) await this.disconnect("reconnect");
    this.port = port;
    await port.open({ baudRate: this.opts.baudRate });
    if (!port.writable || !port.readable) {
      throw new Error("Port has no readable/writable streams after open()");
    }
    this.writer = port.writable.getWriter();
    this.reader = port.readable.getReader();
    this.readLoopPromise = this.readLoop();
  }

  async disconnect(reason = "user"): Promise<void> {
    const port = this.port;
    this.port = null;
    if (this.reader) {
      try {
        await this.reader.cancel();
      } catch {
        /* ignore */
      }
      try {
        this.reader.releaseLock();
      } catch {
        /* ignore */
      }
      this.reader = null;
    }
    if (this.writer) {
      try {
        await this.writer.close();
      } catch {
        /* ignore */
      }
      try {
        this.writer.releaseLock();
      } catch {
        /* ignore */
      }
      this.writer = null;
    }
    if (port) {
      try {
        await port.close();
      } catch {
        /* ignore */
      }
    }
    this.failPending(new Error(`Connection closed (${reason})`));
    this.decoder.reset();
    if (this.opts.onDisconnect) this.opts.onDisconnect(reason);
  }

  async ping(): Promise<PingInfo> {
    const data = await this.send(OP_PING, new Uint8Array(0));
    const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
    const fwLen = readU32LE(view, 0);
    const fw = DEC.decode(data.subarray(4, 4 + fwLen));
    const heap = readU32LE(view, 4 + fwLen);
    return { firmware: fw, freeHeap: heap };
  }

  async listDir(path: string): Promise<DirEntry[]> {
    const payload: number[] = [];
    pushLString(payload, path);
    const data = await this.send(OP_LIST_DIR, Uint8Array.from(payload));
    const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
    const count = readU16LE(view, 0);
    const entries: DirEntry[] = [];
    let off = 2;
    for (let i = 0; i < count; i++) {
      const type = data[off] === 1 ? "dir" : "file";
      off += 1;
      const size = readU64LE(view, off);
      off += 8;
      const nameLen = readU16LE(view, off);
      off += 2;
      const name = DEC.decode(data.subarray(off, off + nameLen));
      off += nameLen;
      entries.push({ name, type, size });
    }
    return entries;
  }

  async stat(path: string): Promise<StatInfo> {
    const payload: number[] = [];
    pushLString(payload, path);
    const data = await this.send(OP_STAT, Uint8Array.from(payload));
    const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
    return {
      type: data[0] === 1 ? "dir" : "file",
      size: readU64LE(view, 1),
    };
  }

  async readChunk(path: string, offset: number, length: number): Promise<Uint8Array> {
    const payload: number[] = [];
    pushLString(payload, path);
    pushU64LE(payload, offset);
    pushU32LE(payload, Math.min(length, MAX_READ_CHUNK));
    const data = await this.send(OP_READ, Uint8Array.from(payload));
    const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
    const got = readU32LE(view, 0);
    return data.subarray(4, 4 + got);
  }

  // Convenience: pull an entire file by repeatedly reading MAX_READ_CHUNK
  // until the size is reached. onProgress receives bytes read so far.
  async downloadFile(
    path: string,
    onProgress?: (bytesRead: number, total: number) => void,
  ): Promise<Blob> {
    const info = await this.stat(path);
    if (info.type !== "file") throw new Error("Not a file");
    const total = info.size;
    const chunks: Uint8Array[] = [];
    let off = 0;
    while (off < total) {
      const want = Math.min(MAX_READ_CHUNK, total - off);
      const chunk = await this.readChunk(path, off, want);
      if (chunk.length === 0) break;
      chunks.push(chunk);
      off += chunk.length;
      if (onProgress) onProgress(off, total);
    }
    // Cast: TS 5.7's Uint8Array<ArrayBufferLike> includes SharedArrayBuffer,
    // which Blob's typings reject; the runtime accepts Uint8Array fine.
    return new Blob(chunks as unknown as BlobPart[]);
  }

  async writeBegin(path: string, totalSize: number): Promise<number> {
    const payload: number[] = [];
    pushLString(payload, path);
    pushU64LE(payload, totalSize);
    const u8 = Uint8Array.from(payload);
    // eslint-disable-next-line no-console
    console.debug(
      "[bridge] writeBegin",
      { path, totalSize, payloadLen: u8.length },
      Array.from(u8)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join(" "),
    );
    const data = await this.send(OP_WRITE_BEGIN, u8);
    const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
    return readU16LE(view, 0);
  }

  async writeChunk(sessionId: number, chunk: Uint8Array): Promise<number> {
    if (chunk.length > MAX_WRITE_CHUNK) {
      throw new Error(`Chunk too large: ${chunk.length} > ${MAX_WRITE_CHUNK}`);
    }
    const payload = new Uint8Array(2 + 4 + chunk.length);
    const view = new DataView(payload.buffer);
    view.setUint16(0, sessionId, true);
    view.setUint32(2, chunk.length, true);
    payload.set(chunk, 6);
    const tailStart = Math.max(0, payload.length - 8);
    const tail = Array.from(payload.subarray(tailStart))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(" ");
    // eslint-disable-next-line no-console
    console.debug("[bridge] writeChunk", {
      sid: sessionId,
      chunkLen: chunk.length,
      payloadLen: payload.length,
      tailFromIdx: tailStart,
      tail,
    });
    const data = await this.send(OP_WRITE_CHUNK, payload);
    return readU64LE(new DataView(data.buffer, data.byteOffset, data.byteLength), 0);
  }

  async writeEnd(sessionId: number): Promise<void> {
    const payload = new Uint8Array(2);
    new DataView(payload.buffer).setUint16(0, sessionId, true);
    await this.send(OP_WRITE_END, payload);
  }

  async uploadFile(
    path: string,
    file: Blob | Uint8Array,
    onProgress?: (bytesWritten: number, total: number) => void,
  ): Promise<void> {
    const totalSize = file instanceof Blob ? file.size : file.byteLength;
    const sid = await this.writeBegin(path, totalSize);
    let off = 0;
    try {
      while (off < totalSize) {
        const end = Math.min(off + MAX_WRITE_CHUNK, totalSize);
        let chunk: Uint8Array;
        if (file instanceof Blob) {
          chunk = new Uint8Array(await file.slice(off, end).arrayBuffer());
        } else {
          chunk = file.subarray(off, end);
        }
        const written = await this.writeChunkWithRetry(sid, chunk);
        off = end;
        if (onProgress) onProgress(written, totalSize);
      }
      await this.writeEnd(sid);
    } catch (err) {
      // Best-effort cleanup of the partial/zombie file the firmware created
      // at writeBegin so the SD card isn't littered with 0-byte uploads.
      try {
        await this.writeEnd(sid);
      } catch {
        /* session may already be gone */
      }
      try {
        await this.deletePath(path);
      } catch {
        /* if the connection itself is dead, leave it */
      }
      throw err;
    }
  }

  private async writeChunkWithRetry(
    sid: number,
    chunk: Uint8Array,
    maxAttempts = 20,
  ): Promise<number> {
    let lastErr: unknown = null;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await this.writeChunk(sid, chunk);
      } catch (err) {
        lastErr = err;
        const isTruncation =
          err instanceof BridgeError &&
          err.code === 0x01 &&
          /truncated|missing/i.test(err.message);
        if (!isTruncation || attempt === maxAttempts) throw err;
        // First few retries: send again immediately. Most USB-Serial-JTAG
        // truncations are one-off and clear with no delay. Beyond that, back
        // off so the device's CDC pipeline has time to settle.
        const delay = attempt <= 3 ? 0 : Math.min(50 * (attempt - 3), 400);
        if (delay > 0) {
          // eslint-disable-next-line no-console
          console.warn(
            `[bridge] writeChunk truncated, retry ${attempt}/${maxAttempts - 1} after ${delay}ms`,
            err.message,
          );
          await new Promise((r) => setTimeout(r, delay));
        }
      }
    }
    throw lastErr;
  }

  async deletePath(path: string): Promise<void> {
    const payload: number[] = [];
    pushLString(payload, path);
    await this.send(OP_DELETE, Uint8Array.from(payload));
  }

  async mkdir(path: string): Promise<void> {
    const payload: number[] = [];
    pushLString(payload, path);
    await this.send(OP_MKDIR, Uint8Array.from(payload));
  }

  async rename(src: string, dst: string): Promise<void> {
    const payload: number[] = [];
    pushLString(payload, src);
    pushLString(payload, dst);
    await this.send(OP_RENAME, Uint8Array.from(payload));
  }

  // ── internals ─────────────────────────────────────────────────────────

  private allocReqId(): number {
    let id = this.nextReqId;
    // Skip 0 to differentiate from default-initialized values.
    do {
      this.nextReqId = (this.nextReqId + 1) & 0xffff;
      if (this.nextReqId === 0) this.nextReqId = 1;
    } while (this.pending.has(id));
    return id;
  }

  private async send(opcode: number, payload: Uint8Array): Promise<Uint8Array> {
    if (!this.writer) throw new Error("Not connected");
    const reqid = this.allocReqId();
    const frame = new Uint8Array(3 + payload.length);
    frame[0] = opcode;
    frame[1] = reqid & 0xff;
    frame[2] = (reqid >> 8) & 0xff;
    frame.set(payload, 3);
    const slip = encodeSlip(frame);

    const result = new Promise<Uint8Array>((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(reqid);
        reject(new BridgeError(0xfe, "Timed out"));
      }, this.opts.requestTimeoutMs);
      this.pending.set(reqid, {
        resolve,
        reject,
        expectedOpcode: opcode | RESPONSE_BIT,
        timer,
      });
    });

    await this.writer.write(slip);
    return result;
  }

  private failPending(err: Error): void {
    for (const [, p] of this.pending) {
      if (p.timer) clearTimeout(p.timer);
      p.reject(err);
    }
    this.pending.clear();
  }

  private async readLoop(): Promise<void> {
    if (!this.reader) return;
    try {
      while (true) {
        const { value, done } = await this.reader.read();
        if (done) break;
        if (!value || value.length === 0) continue;
        const frames = this.decoder.feed(value);
        for (const f of frames) this.handleFrame(f);
      }
    } catch (err) {
      // Reader was cancelled or stream errored.
      const reason = err instanceof Error ? err.message : "read error";
      void this.disconnect(reason);
    }
  }

  private flushLog(): void {
    if (this.logBuf.length === 0) return;
    if (this.opts.onLogChunk) {
      try {
        this.opts.onLogChunk(DEC.decode(Uint8Array.from(this.logBuf)));
      } catch {
        /* ignore */
      }
    }
    this.logBuf = [];
  }

  private handleFrame(frame: Uint8Array): void {
    if (frame.length < 3) return;
    const opcode = frame[0];
    const reqid = frame[1] | (frame[2] << 8);
    const payload = frame.subarray(3);
    const pending = this.pending.get(reqid);
    if (!pending) return;
    this.pending.delete(reqid);
    if (pending.timer) clearTimeout(pending.timer);

    if (opcode === OP_ERROR) {
      const view = new DataView(payload.buffer, payload.byteOffset, payload.byteLength);
      const code = payload[0];
      const msgLen = readU16LE(view, 1);
      const msg = DEC.decode(payload.subarray(3, 3 + msgLen));
      pending.reject(new BridgeError(code, msg || `error ${code}`));
      return;
    }
    if (opcode !== pending.expectedOpcode) {
      pending.reject(new BridgeError(0xfd, `opcode mismatch: ${opcode}`));
      return;
    }
    pending.resolve(payload);
  }
}

export function joinPath(parent: string, child: string): string {
  if (!parent || parent === "/") return `/${child}`;
  if (parent.endsWith("/")) return `${parent}${child}`;
  return `${parent}/${child}`;
}

export function parentPath(p: string): string {
  if (!p || p === "/") return "/";
  const trimmed = p.endsWith("/") && p.length > 1 ? p.slice(0, -1) : p;
  const idx = trimmed.lastIndexOf("/");
  if (idx <= 0) return "/";
  return trimmed.slice(0, idx);
}

export function basename(p: string): string {
  if (!p || p === "/") return "";
  const trimmed = p.endsWith("/") && p.length > 1 ? p.slice(0, -1) : p;
  const idx = trimmed.lastIndexOf("/");
  return idx >= 0 ? trimmed.slice(idx + 1) : trimmed;
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / 1024 / 1024).toFixed(1)} MB`;
  return `${(n / 1024 / 1024 / 1024).toFixed(2)} GB`;
}
