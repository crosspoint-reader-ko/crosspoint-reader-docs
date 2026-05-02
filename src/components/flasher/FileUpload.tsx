"use client";

import React, { Ref, useImperativeHandle, useRef, useState } from "react";
import { useTranslations } from "next-intl";

export interface FileUploadHandle {
  getFile: () => File | undefined;
}

interface FileUploadProps {
  ref: Ref<FileUploadHandle>;
  disabled?: boolean;
}

export default function FileUpload({ ref, disabled }: FileUploadProps) {
  const t = useTranslations("flasher.fileUpload");
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");

  useImperativeHandle(ref, () => ({
    getFile: () => inputRef.current?.files?.[0],
  }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileName(file?.name || "");
  };

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setFileName("");
  };

  return (
    <div className="flex items-center gap-2 w-full">
      <input
        type="file"
        ref={inputRef}
        onChange={handleChange}
        disabled={disabled}
        className="hidden"
        accept=".bin"
      />
      <div className="flex-1 flex items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          {t("selectFile")}
        </button>
        {fileName && (
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
            <span className="text-sm text-gray-700 truncate max-w-[200px]">
              {fileName}
            </span>
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
