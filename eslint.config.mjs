import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import guards from "./tools/eslint-rules/index.mjs";
import { designSystemLint } from "./tools/design-system-lint/index.mjs";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "playwright-report/**",
    "test-results/**",
  ]),

  // 디자인 시스템 규칙 — 토큰 밖의 값, 컴포넌트 밖에서 새로 만든 UI 를 error 로 막는다.
  // 설정 묶음: tools/design-system-lint (다른 프로젝트에서 그대로 가져다 쓴다).
  ...designSystemLint({ enabled: true }),

  // 디자인 시스템 lint 가 살아 있는지 증명하는 위반 샘플(npm run check:guards 전용).
  ...designSystemLint({
    files: ["tools/guard-fixtures/design-system.tsx"],
    screens: ["tools/guard-fixtures/design-system.tsx"],
    uiDir: "tools/guard-fixtures/__none__",
  }),

  // 가드 자체를 검사하는 위반 샘플 파일.
  {
    files: ["tools/guard-fixtures/**/*.{ts,tsx}"],
    plugins: { guards },
    rules: {
      "guards/no-arbitrary-class": "error",
      "guards/no-style-literal": "error",
      "guards/ui-only-elements": "error",
    },
  },

  // 토큰 JS 미러는 색 리터럴이 존재해야 하는 단 하나의 예외 파일이다.
  // globals.css 와 짝이 맞는지는 단위 테스트가 검사한다.
  {
    files: ["src/lib/design-tokens.ts"],
    rules: {
      "guards/no-style-literal": "off",
    },
  },

  // 테스트는 토큰 값 자체를 단언해야 하므로 리터럴 금지에서 제외한다.
  // 화면에 실려 나가는 코드가 아니다.
  {
    files: ["src/**/*.test.{ts,tsx}", "e2e/**/*.{ts,tsx}"],
    rules: {
      "guards/no-style-literal": "off",
    },
  },
]);

export default eslintConfig;
