# AGENTS.md

이 저장소에서 일하는 에이전트가 지킬 규칙이다.

## 기본 규칙

1. **시각 정본은 `design.md` 다.** 색·서체·곡률·간격·컴포넌트 모양은 여기서 정한다.
   원문과 다르게 쓰는 부분은 `design.md` 의 "이 앱에서의 적용 차이" 목록에만 둔다.
   목록에 없는 차이를 새로 만들지 않는다.
2. **토큰은 `src/app/globals.css` 에만 둔다.** 이름은 shadcn 시맨틱 이름
   (`--background` · `--primary` · `--border` …)을 쓴다. 컴포넌트·화면 코드에 hex·rgb 색이나
   px 값을 직접 쓰지 않는다.
3. **화면(페이지)은 `src/components/ui` 를 조립만 한다.** 화면이 정하는 것은 배치·간격·글자뿐이다.
   raw 요소에 배경·테두리·곡률·그림자·링을 입혀 카드나 버튼을 따로 만들지 않는다.
   lint 가 이를 막고, 위반이 있으면 `next dev` · `next build` 가 시작을 거부한다.
4. **필요한 것이 없으면 `components/ui` 에 컴포넌트나 variant 를 추가한다.**
   - 파일 머리에 스펙 주석을 단다. 다음 다섯 항목이 반드시 있어야 한다(단위 테스트가 검사한다):
     `해부도` · `토큰` · `상태` · `키보드·ARIA` · `수용 기준`
   - `/design` 카탈로그(`src/app/design`)에 표본을 추가한다. `components/ui` 의 모든 파일이
     카탈로그에서 import 되어야 한다(단위 테스트가 검사한다).

## 서버·클라이언트 경계

- **서버 컴포넌트에서 쓰는 shadcn cva 는 `*-variants.ts` 로 분리한다.**
  `"use client"` 모듈에서 내보낸 함수는 서버 컴포넌트가 호출할 수 없다.
  예: `badge-variants.ts` · `tabs-variants.ts`.
- **서버에서 ReactNode 를 받아 목록 옆에 렌더하는 `"use client"` 컴포넌트는 안정된 key 를 준다.**
  배열 index 나 매 렌더 바뀌는 값을 key 로 쓰면 하이드레이션 뒤 상태가 엉뚱한 항목에 붙는다.

## 함정

1. **Tailwind v4 `@theme` 순서** — `--color-*: initial;` 은 `@theme inline` 시맨틱 색 정의보다
   **앞**에 둔다. 뒤에 두면 `bg-primary` 같은 시맨틱 색까지 함께 지워진다.
2. **cascade layer** — 전역 기본값(`html` · `body` · 요소 선택자 스타일)은 반드시 `@layer base` 안에 둔다.
   레이어 밖에 두면 utilities 레이어를 이겨서 컴포넌트에서 조정할 수 없게 된다.

## 검증

작업을 마치기 전에 돌린다.

```bash
npm run lint
npm run check:guards
npm run typecheck
npm run test
npm run e2e        # 화면을 바꿨을 때
npm run check      # 위 단계(e2e 제외)와 build 를 한 번에
```

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
