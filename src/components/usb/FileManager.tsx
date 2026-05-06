"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  DirEntry,
  formatBytes,
  joinPath,
  parentPath,
  SerialBridge,
} from "@/lib/usb/protocol";
import { ConnectionState } from "@/lib/usb/useBridge";
import { ConnectionBadge } from "./ConnectionBadge";

// NOTE: Upload and download are intentionally disabled. ESP32-C3's USB
// Serial-JTAG drops bytes during sustained binary bursts (see git history
// for the long debugging trail). Until a more reliable transport (e.g. WiFi
// web upload) is the recommended path for large files, this UI exposes
// browse/delete/mkdir/rename only — those are short single-frame commands
// that work reliably over the same channel.

interface Props {
  bridge: SerialBridge | null;
  state: ConnectionState;
  onConnect: () => Promise<void>;
  onDisconnect: () => Promise<void>;
}

export function FileManager({ bridge, state, onConnect, onDisconnect }: Props) {
  const t = useTranslations("usb.actions");
  const tBrowser = useTranslations("usb.browser");
  const tStatus = useTranslations("usb.status");
  const tErrors = useTranslations("usb.errors");

  const [path, setPath] = useState("/");
  const [entries, setEntries] = useState<DirEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const connected = state.kind === "connected" && bridge !== null;

  const refresh = useCallback(async () => {
    if (!bridge || !bridge.isConnected()) return;
    setLoading(true);
    setError(null);
    try {
      const list = await bridge.listDir(path);
      list.sort((a, b) => {
        if (a.type !== b.type) return a.type === "dir" ? -1 : 1;
        return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
      });
      setEntries(list);
      setSelected(new Set());
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(tErrors("listFailed", { message: msg }));
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [bridge, path, tErrors]);

  useEffect(() => {
    if (connected) refresh();
  }, [connected, refresh]);

  const handleEnter = (entry: DirEntry) => {
    if (entry.type === "dir") {
      setPath((prev) => joinPath(prev, entry.name));
    }
    // Files: no-op. Download is disabled until USB transport is reliable.
  };

  const performDelete = async (names: string[]) => {
    if (!bridge || names.length === 0) return;
    setError(null);
    try {
      for (const name of names) {
        await bridge.deletePath(joinPath(path, name));
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(tErrors("deleteFailed", { message: msg }));
    } finally {
      await refresh();
    }
  };

  const handleDelete = async () => {
    if (!bridge || selected.size === 0) return;
    const targets = Array.from(selected);
    const message =
      targets.length === 1
        ? tBrowser.rich("deleteConfirmSingle", {
            name: targets[0],
            strong: (chunks: React.ReactNode) => chunks,
          })
        : tBrowser("deleteConfirmMulti", { count: targets.length });
    const confirmed = window.confirm(
      typeof message === "string" ? message : `Delete ${targets.length} items?`,
    );
    if (!confirmed) return;
    await performDelete(targets);
  };

  const handleDeleteOne = async (entry: DirEntry) => {
    if (!bridge) return;
    const message = tBrowser.rich("deleteConfirmSingle", {
      name: entry.name,
      strong: (chunks: React.ReactNode) => chunks,
    });
    const confirmed = window.confirm(
      typeof message === "string" ? message : `Delete ${entry.name}?`,
    );
    if (!confirmed) return;
    await performDelete([entry.name]);
  };

  const handleMkdir = async () => {
    if (!bridge) return;
    const name = window.prompt(tBrowser("newFolderPrompt"));
    if (!name) return;
    setError(null);
    try {
      await bridge.mkdir(joinPath(path, name));
      await refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(tErrors("mkdirFailed", { message: msg }));
    }
  };

  const handleRename = async (entry: DirEntry) => {
    if (!bridge) return;
    const newName = window.prompt(tBrowser("renamePrompt"), entry.name);
    if (!newName || newName === entry.name) return;
    setError(null);
    try {
      await bridge.rename(joinPath(path, entry.name), joinPath(path, newName));
      await refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(tErrors("renameFailed", { message: msg }));
    }
  };

  const toggleSelected = (name: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const breadcrumbs = useMemo(() => {
    const parts = path.split("/").filter(Boolean);
    const acc: { label: string; path: string }[] = [{ label: tBrowser("rootLabel"), path: "/" }];
    let cur = "";
    for (const part of parts) {
      cur += `/${part}`;
      acc.push({ label: part, path: cur });
    }
    return acc;
  }, [path, tBrowser]);

  return (
    <div className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50/60 to-white">
        <ConnectionBadge state={state} />
        {state.kind === "connected" && (
          <span className="text-xs text-gray-400">
            {tStatus("firmware")}: {state.info.firmware}
          </span>
        )}
        <div className="ml-auto flex items-center gap-2">
          {!connected ? (
            <button
              onClick={() => void onConnect()}
              disabled={state.kind === "connecting"}
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-medium px-4 py-2 transition-colors"
            >
              <PlugIcon />
              {t("connect")}
            </button>
          ) : (
            <>
              <button
                onClick={handleMkdir}
                className="inline-flex items-center gap-2 rounded-full ring-1 ring-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium px-4 py-2 transition-colors"
              >
                <FolderPlusIcon />
                {t("newFolder")}
              </button>
              <button
                onClick={() => void refresh()}
                className="inline-flex items-center justify-center rounded-full ring-1 ring-gray-300 hover:bg-gray-50 text-gray-600 p-2 transition-colors"
                aria-label={t("refresh")}
                title={t("refresh")}
              >
                <RefreshIcon />
              </button>
              <button
                onClick={() => void onDisconnect()}
                className="inline-flex items-center gap-2 rounded-full text-rose-600 hover:bg-rose-50 text-sm font-medium px-4 py-2 transition-colors"
              >
                {t("disconnect")}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-1 px-5 py-3 border-b border-gray-100 text-sm overflow-x-auto">
        {breadcrumbs.map((bc, i) => (
          <span key={bc.path} className="flex items-center gap-1 whitespace-nowrap">
            {i > 0 && <span className="text-gray-300">/</span>}
            <button
              onClick={() => setPath(bc.path)}
              className={`px-2 py-1 rounded-md transition-colors ${
                i === breadcrumbs.length - 1
                  ? "text-gray-900 font-medium"
                  : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              {bc.label}
            </button>
          </span>
        ))}
      </div>

      {/* Status row + bulk actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-2 border-b border-gray-100 text-xs text-gray-500 bg-gray-50/50">
        <span>
          {loading
            ? tBrowser("loading")
            : selected.size > 0
              ? tBrowser("selectedCount", { count: selected.size })
              : tBrowser("fileCount", { count: entries.length })}
        </span>
        {selected.size > 0 && connected && (
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-700 font-medium"
            >
              <TrashIcon />
              {t("delete")}
            </button>
          </div>
        )}
      </div>

      {/* Errors */}
      {error && (
        <div className="px-5 py-3 bg-rose-50 border-b border-rose-100 text-sm text-rose-700">
          {error}
        </div>
      )}

      {/* File list / empty / disconnected */}
      <div className="relative">
        {!connected ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <PlugIcon className="h-12 w-12 mb-3 opacity-30" />
            <p className="text-sm">{tStatus("disconnected")}</p>
          </div>
        ) : entries.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <FolderIcon className="h-12 w-12 mb-3 opacity-30" />
            <p className="text-sm">{tBrowser("emptyFolder")}</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {path !== "/" && (
              <li>
                <button
                  onClick={() => setPath(parentPath(path))}
                  className="flex items-center gap-3 w-full px-5 py-3 hover:bg-gray-50 transition-colors text-left"
                >
                  <span className="w-6 text-center text-gray-400">↑</span>
                  <span className="text-sm text-gray-600">..</span>
                </button>
              </li>
            )}
            {entries.map((entry) => {
              const isSelected = selected.has(entry.name);
              return (
                <li
                  key={entry.name}
                  className={`group flex items-center gap-3 px-5 py-3 hover:bg-blue-50/40 transition-colors ${
                    isSelected ? "bg-blue-50/60" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelected(entry.name)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button
                    onClick={() => handleEnter(entry)}
                    className="flex flex-1 items-center gap-3 min-w-0 text-left"
                    disabled={entry.type === "file"}
                  >
                    {entry.type === "dir" ? (
                      <FolderIcon className="h-5 w-5 flex-shrink-0 text-blue-500" />
                    ) : (
                      <FileIcon className="h-5 w-5 flex-shrink-0 text-gray-400" />
                    )}
                    <span className="truncate text-sm text-gray-800 font-medium">
                      {entry.name}
                    </span>
                    {entry.type === "file" && (
                      <span className="ml-auto text-xs text-gray-400 tabular-nums whitespace-nowrap">
                        {formatBytes(entry.size)}
                      </span>
                    )}
                  </button>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => void handleRename(entry)}
                      title={t("rename")}
                      className="p-1.5 rounded-md hover:bg-white text-gray-500 hover:text-blue-600"
                    >
                      <PencilIcon />
                    </button>
                    <button
                      onClick={() => void handleDeleteOne(entry)}
                      title={t("delete")}
                      className="p-1.5 rounded-md hover:bg-white text-gray-500 hover:text-rose-600"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

// ── Icons ──────────────────────────────────────────────────────────────

function PlugIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 2v6M15 2v6M6 8h12v4a6 6 0 0 1-12 0V8zM12 18v4" />
    </svg>
  );
}

function FolderIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8l-2-2z" />
    </svg>
  );
}

function FolderPlusIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2zM12 11v6M9 14h6" />
    </svg>
  );
}

function FileIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}

function TrashIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    </svg>
  );
}

function PencilIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
  );
}

function RefreshIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}
