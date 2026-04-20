import type { ConversionResult } from "@/types/epdfont";

export interface ConversionState {
  status: "idle" | "loading" | "converting" | "success" | "error";
  progress: number;
  message: string;
  result?: ConversionResult;
}

export interface FontInfo {
  familyName: string;
  styleName: string;
  numGlyphs: number;
  fileSize: number;
  isValid: boolean;
  error?: string;
}

export interface QuickPreset {
  id: string;
  name: string;
  description: string;
  rangeIds: string[];
}
