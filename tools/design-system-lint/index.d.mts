import type { Linter } from "eslint";

export function designSystemLint(options?: {
  enabled?: boolean;
  ui?: string;
  uiDir?: string;
  files?: string[];
  screens?: string[];
  /** 색 리터럴을 허용하는 토큰 JS 미러 파일. 기본 src/lib/design-tokens.ts */
  tokenMirror?: string;
}): Linter.Config[];

export default designSystemLint;
