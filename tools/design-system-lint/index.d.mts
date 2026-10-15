import type { Linter } from "eslint";

export function designSystemLint(options?: {
  enabled?: boolean;
  ui?: string;
  uiDir?: string;
  files?: string[];
  screens?: string[];
}): Linter.Config[];

export default designSystemLint;
