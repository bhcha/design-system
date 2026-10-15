/**
 * design-system-lint — 이 디자인 시스템(Ollama 테마 shadcn/ui)을 쓰는 프로젝트용 ESLint 설정 묶음.
 *
 * 쓰는 법 (eslint.config.mjs)
 *   import { designSystemLint } from "./tools/design-system-lint/index.mjs";
 *   export default defineConfig([...nextVitals, ...designSystemLint({ enabled: true })]);
 *
 * 켜고 끄기
 *   - 옵션 `enabled` (기본 true). 환경 변수 DESIGN_SYSTEM_LINT=off 이면 강제로 끈다.
 *   - 켜져 있으면 모든 규칙이 `error` 다. next.mjs 의 withDesignSystemLint 와 함께 쓰면
 *     위반이 하나라도 있을 때 `next build` · `next dev` 가 시작되지 않는다.
 *
 * 무엇을 막는가
 *   토큰 밖의 값
 *     shadcn/no-raw-colors        bg-pink-500 같은 팔레트 색 (팔레트는 비어 있다)
 *     shadcn/no-unknown-classes   테마에 없는 클래스 (text-5xl · rounded-huge · shadow-md …)
 *     shadcn/no-arbitrary-values  p-[13px] 같은 임의값
 *     shadcn/no-inline-styles     style={{…}} · <style>
 *     shadcn/require-static-classes `bg-${x}` 처럼 읽을 수 없는 클래스
 *     guards/no-style-literal     코드 속 hex·rgb 색, className 속 px·rem
 *   컴포넌트 밖에서 새로 만든 UI
 *     shadcn/no-restyle           디자인 시스템 컴포넌트의 모양을 className 으로 바꾸기
 *     guards/ui-only-elements     화면에서 raw button·input·select·textarea·table·a·label…
 *     guards/no-surface-styling   화면에서 raw div 등에 배경·테두리·곡률·그림자·링 입히기
 *     guards/no-arbitrary-class   화면에서 Tailwind 임의값
 *
 * 디자인 시스템 안쪽(uiDir)은 shadcn 원본 코드라 임의 변형자·재스타일이 허용되고,
 * 토큰 밖 색·클래스·리터럴만 막는다.
 */
import { plugin as shadcn } from "@shadcn/lint";
import tsParser from "@typescript-eslint/parser";
import guards from "../eslint-rules/index.mjs";

const NOTE =
  "디자인 시스템 규칙 — 값은 src/app/globals.css 토큰, 모양은 components/ui 컴포넌트에서만 나온다. " +
  "컴포넌트 머리 주석과 design.md 를 본다. 맞는 것이 없으면 화면에서 만들지 말고 디자인 시스템에 추가한다 — " +
  "디자인 시스템 저장소 밖이면 https://github.com/bhcha/design-system/issues/new/choose 에 요청한다.";

/** 화면이 컴포넌트에 줄 수 있는 className — 배치(layout)만. 컴포넌트별 예외는 contracts. */
const RESTYLE = {
  allow: ["layout"],
  contracts: [
    { pattern: "^(Button|ButtonLink)$", allow: ["layout", "w-full", "self-*"] },
    { pattern: "^(Card|CardContent|CardHeader|CardFooter|SectionPanel|PricingCard|TerminalCard)$", allow: ["layout", "spacing"] },
    { pattern: "^(Input|Textarea|NativeSelect|TextInput|Select|SearchInput|InputGroup)$", allow: ["layout"] },
    // 콘텐츠를 담는 컨테이너는 안쪽 배치(flex·gap)를 호출부가 정한다.
    { pattern: "^(TabPanel|CollapsibleContent|ItemGroup|FieldGroup)$", allow: ["layout", "spacing"] },
    // 인라인 링크는 주변 문장의 글자 크기를 따른다.
    { pattern: "^TextLink$", allow: ["layout", "text-xs", "text-sm", "text-base"] },
  ],
};

export function designSystemLint({
  enabled = true,
  ui = "@/components/ui",
  uiDir = "src/components/ui",
  files = ["src/**/*.{ts,tsx}"],
  screens = ["src/app/**/*.{ts,tsx}", "src/features/**/*.{ts,tsx}"],
  tokenMirror = "src/lib/design-tokens.ts",
} = {}) {
  if (!enabled || process.env.DESIGN_SYSTEM_LINT === "off") return [];

  const languageOptions = {
    parser: tsParser,
    parserOptions: { ecmaFeatures: { jsx: true } },
  };
  const settings = { shadcn: { ui, note: NOTE } };

  return [
    // 1) 소스 전체 — 토큰 밖의 값 금지
    {
      name: "design-system/tokens",
      files,
      languageOptions,
      plugins: { shadcn, guards },
      settings,
      rules: {
        "shadcn/no-raw-colors": "error",
        "shadcn/no-unknown-classes": "error",
        "guards/no-style-literal": "error",
      },
    },
    // 2) 화면 코드 — 컴포넌트 밖에서 UI 를 새로 만들지 않는다
    {
      name: "design-system/screens",
      files: screens,
      languageOptions,
      plugins: { shadcn, guards },
      settings,
      rules: {
        "shadcn/no-restyle": ["error", RESTYLE],
        "shadcn/no-arbitrary-values": "error",
        "shadcn/no-inline-styles": "error",
        "shadcn/require-static-classes": "error",
        "guards/no-arbitrary-class": "error",
        "guards/ui-only-elements": "error",
        "guards/no-surface-styling": "error",
      },
    },
    // 3) 디자인 시스템 안쪽 — 모양을 정의하는 곳이라 재스타일 규칙은 끈다
    {
      name: "design-system/ui",
      files: [`${uiDir}/**/*.{ts,tsx}`],
      rules: {
        "shadcn/no-restyle": "off",
        "shadcn/no-arbitrary-values": "off",
        "guards/no-arbitrary-class": "off",
        "guards/ui-only-elements": "off",
        "guards/no-surface-styling": "off",
      },
    },
    // 4) 토큰 JS 미러 — 색 리터럴이 있어야 하는 단 하나의 예외 파일(<meta name="theme-color"> 등)
    {
      name: "design-system/token-mirror",
      files: [tokenMirror],
      rules: {
        "guards/no-style-literal": "off",
      },
    },
  ];
}

export default designSystemLint;
