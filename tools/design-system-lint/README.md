# design-system-lint

이 디자인 시스템(shadcn/ui · Base UI · Ollama 토큰)을 쓰는 프로젝트에서 **토큰 밖의 값**과
**컴포넌트 밖에서 새로 만든 UI**를 오류로 막는 ESLint 설정 묶음이다.
[`@shadcn/lint`](https://github.com/shadcn-ui/lint) 의 6개 규칙과 자체 가드 4개를 묶었다.

## 무엇을 막는가

| 분류 | 규칙 | 예 |
|---|---|---|
| 토큰 밖의 값 | `shadcn/no-raw-colors` | `bg-pink-500` (팔레트는 비어 있다) |
| | `shadcn/no-unknown-classes` | `text-5xl`, `shadow-md`, `rounded-huge` |
| | `shadcn/no-arbitrary-values` | `p-[13px]` |
| | `shadcn/no-inline-styles` | `style={{ … }}` |
| | `shadcn/require-static-classes` | `<Button className={\`w-${x}\`}>` |
| | `guards/no-style-literal` | 코드 속 hex·rgb, className 속 px |
| 컴포넌트 밖 UI | `shadcn/no-restyle` | `<Button className="p-4 rounded-none">` |
| | `guards/ui-only-elements` | 화면에서 raw `button·input·select·textarea·table·a·label·details` |
| | `guards/no-surface-styling` | 화면에서 raw `div` 에 `bg·border·rounded·ring·shadow` 로 카드 만들기 |
| | `guards/no-arbitrary-class` | 화면에서 Tailwind 임의값 |

화면 코드(`src/app`·`src/features`)는 **배치·간격·글자**만 정한다. 모양이 필요하면
`components/ui` 에 컴포넌트나 variant 를 추가한다. `components/ui` 안쪽은 shadcn 원본
코드라 재스타일·임의 변형자를 허용하고, 토큰 밖 색·클래스·리터럴만 막는다.

## 다른 프로젝트에서 켜기

1. 의존성: `npm i -D @shadcn/lint @typescript-eslint/parser eslint`
2. 이 폴더(`tools/design-system-lint`)와 `tools/eslint-rules` 를 복사한다.
3. `eslint.config.mjs`

```js
import { designSystemLint } from "./tools/design-system-lint/index.mjs";

export default defineConfig([
  ...nextVitals,
  ...designSystemLint({ enabled: true }), // false 면 규칙이 하나도 켜지지 않는다
]);
```

4. (선택) 위반이 있으면 앱을 띄우지 않기 — `next.config.ts`

```ts
import { withDesignSystemLint } from "./tools/design-system-lint/next.mjs";
export default withDesignSystemLint(nextConfig, { enabled: true });
```

Next.js 16 은 `next build` 에서 lint 를 돌리지 않는다. 이 래퍼가 `next build`·`next dev`
시작 시 ESLint 를 돌리고, 오류가 1건이라도 있으면 위반 목록을 찍고 시작을 거부한다.

## 끄기

- 설정에서 `enabled: false`
- 일시적으로: `DESIGN_SYSTEM_LINT=off npm run dev`

## 규칙이 살아 있는지 확인

`npm run check:guards` — `tools/guard-fixtures/design-system.tsx` 에 심어 둔 위반이
10개 규칙 모두에서 error 로 보고되는지 검사한다.
