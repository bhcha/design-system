# design-system

개인 디자인 시스템이다. 세 가지를 묶었다.

- **컴포넌트** — shadcn/ui(Base UI, `base-nova` 스타일) 원본과 그 위에 조립한 복합 컴포넌트
- **토큰** — `design.md`(Ollama 분석 원문 + 적용 차이)를 `src/app/globals.css` 의 shadcn 시맨틱 변수로 옮긴 값
- **lint** — 토큰 밖의 값과 컴포넌트 밖에서 새로 만든 UI를 오류로 막는 ESLint 설정 묶음

Next.js 16 · React 19 · Tailwind CSS v4 기반이다.

## 실행

```bash
npm install            # 첫 설치에서 실패하면 npm install --legacy-peer-deps
npm run dev
```

첫 설치 때 npm 의존성 해석기 버그로 peer 충돌이 날 수 있다. 그때는 `--legacy-peer-deps` 를 붙인다.

- `http://localhost:3000/design` — 컴포넌트 카탈로그(전 컴포넌트의 상태 표본)

`next dev` · `next build` 는 시작할 때 lint 를 돌리고, 위반이 하나라도 있으면 시작하지 않는다.
잠깐 끄려면 `DESIGN_SYSTEM_LINT=off npm run dev`.

## 스크립트

| 명령 | 하는 일 |
|------|---------|
| `npm run lint` | `src` · `tools` · `e2e` ESLint (경고 0개 기준) |
| `npm run check:guards` | lint 규칙이 심어 둔 위반을 실제로 잡는지 검사 |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test` | Vitest 단위 테스트 (토큰 · 카탈로그 등재 · 스펙 주석) |
| `npm run e2e` | Playwright (카탈로그 · 토큰 · 접근성) |
| `npm run registry:build` | `registry.json` 과 `public/r/*.json` 을 다시 만든다 (컴포넌트·토큰·lint 를 바꾼 뒤) |
| `npm run check` | lint → check:guards → typecheck → test → build 를 한 번에 |

## 폴더

```
design.md                  시각 정본 (컬러·타이포·곡률·간격·컴포넌트)
src/app/globals.css        토큰 (shadcn 시맨틱 이름)
src/components/ui/         shadcn 원본 + 복합 컴포넌트
src/app/design/            /design 카탈로그
src/lib/                   cn()·서체·토큰 JS 미러와 테스트
tools/design-system-lint/  다른 프로젝트에서 쓸 수 있는 lint 묶음
tools/eslint-rules/        자체 가드 규칙 (lint 묶음이 쓴다)
tools/registry/            shadcn 레지스트리 생성기
registry.json · public/r/  shadcn 레지스트리 (생성물 — 직접 고치지 않는다)
e2e/                       Playwright 테스트
```

## 다른 프로젝트에서 쓰기

**정본은 이 GitHub 저장소의 `main` 이다.** https://github.com/bhcha/design-system

shadcn 레지스트리로 배포한다. 쓰는 프로젝트는 `shadcn` CLI 로 컴포넌트·토큰·lint 를 받는다.
받은 파일은 쓰는 프로젝트의 코드가 되지만, 기준은 언제나 이 저장소의 `main` 이다.

**전제** — Next.js(App Router) · React 19 · Tailwind CSS v4 · `src/` 폴더 · `@/*` → `./src/*` 경로 별칭.
컴포넌트가 `next/link` · `next/font` 를 쓴다.

### 1. 레지스트리 등록

`npx shadcn@latest init` 을 한 적이 없으면 먼저 한다(`components.json` 이 생긴다).
그다음 `components.json` 에 레지스트리를 추가한다.

```json
{
  "registries": {
    "@bhcha": "https://raw.githubusercontent.com/bhcha/design-system/main/public/r/{name}.json"
  }
}
```

### 2. 설치

```bash
npx shadcn@latest add @bhcha/all --overwrite   # 토큰(theme) + 모든 컴포넌트
npx shadcn@latest add @bhcha/lint               # 디자인 시스템 lint (선택)
```

하나씩 받을 수도 있다. 처음 한 번은 `theme` 을 받고, 그다음 필요한 컴포넌트를 받는다.
컴포넌트가 쓰는 다른 컴포넌트와 npm 패키지는 함께 설치된다.

```bash
npx shadcn@latest add @bhcha/theme --overwrite
npx shadcn@latest add @bhcha/button @bhcha/card @bhcha/badge
```

`components.json` 을 고치지 않고 주소로 받아도 된다.

```bash
npx shadcn@latest add https://raw.githubusercontent.com/bhcha/design-system/main/public/r/button.json
```

| 항목 | 내용 |
|---|---|
| `theme` | `src/app/globals.css`(토큰 — 쓰는 프로젝트의 파일을 **덮어쓴다**) · `src/lib/fonts.ts` · `src/lib/design-tokens.ts` · Pretendard(npm) |
| `<컴포넌트 이름>` | `src/components/ui/<이름>.tsx` 하나와 그것이 쓰는 컴포넌트·패키지. 이름은 파일 이름과 같다 |
| `all` | `theme` 과 모든 컴포넌트 |
| `lint` | `tools/design-system-lint/` · `tools/eslint-rules/` 와 ESLint 의존성 |

### 3. 서체 연결

`theme` 이 넣은 `fontVariables` 를 `<html>` 에 단다(Inter·Nunito 를 `next/font` 로 불러온다).
한글 Pretendard 는 `globals.css` 가 npm 패키지에서 불러오므로 따로 할 일이 없다.

```tsx
// src/app/layout.tsx
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
```

### 4. lint 켜기 (선택)

`eslint.config.mjs` 와 `next.config.ts` 에 붙이는 법은
[tools/design-system-lint/README.md](tools/design-system-lint/README.md) 에 있다.
켜면 규칙 위반이 있을 때 `next dev` · `next build` 가 시작하지 않는다.

### 5. 갱신

같은 명령을 다시 돌린다. 바뀐 파일만 덮어쓴다.

```bash
npx shadcn@latest add @bhcha/all --overwrite
```

- 받은 컴포넌트·토큰 파일은 쓰는 쪽에서 고치지 않는다. 다음 갱신 때 덮어써진다.
  고칠 일이 생기면 이슈로 요청하고, 반영된 뒤 다시 받는다.
- 받은 시점의 커밋은 `git ls-remote https://github.com/bhcha/design-system main` 으로 확인해 기록해 둔다.

### 6. 쓰는 프로젝트의 AGENTS.md 에 붙일 문구

그 프로젝트의 에이전트가 정본을 확인하고, 모자란 것을 직접 만들지 않고 이슈로 요청하게 된다.

```md
## 디자인 시스템

- 정본: https://github.com/bhcha/design-system 의 main. 받은 커밋: <해시>
- 설치·갱신: `npx shadcn@latest add @bhcha/all --overwrite` (components.json 에 @bhcha 레지스트리 등록)
- UI 는 디자인 시스템의 컴포넌트(`src/components/ui`)와 토큰(`src/app/globals.css`)으로만 만든다.
  컴포넌트 사용법은 파일 머리의 스펙 주석과 저장소의 `design.md` 를 본다.
- `src/components/ui` · `globals.css` 는 이 프로젝트에서 고치지 않는다.
- 필요한 컴포넌트·variant·토큰이 없거나, 컴포넌트·토큰·lint 가 잘못 동작하면
  화면에서 직접 만들거나 lint 를 끄지 말고 디자인 시스템 저장소에 이슈를 올린다.
  양식과 `gh issue create` 예시: https://github.com/bhcha/design-system/blob/main/REQUESTS.md
- 올린 이슈 번호를 작업 기록에 남긴다.
```

### 이 저장소에서 바꿀 때

컴포넌트·토큰·lint 를 바꾸면 `npm run registry:build` 로 레지스트리를 다시 만들어 함께 커밋한다.
`npm run test` 가 레지스트리와 소스가 어긋나면 실패한다.

## 요청과 문제 보고

컴포넌트·토큰이 모자라거나 문제가 생기면 GitHub 이슈로 올린다.
양식 고르는 법과 에이전트용 `gh` 명령은 [REQUESTS.md](REQUESTS.md) 에 있다.

## 라이선스

[MIT](LICENSE)
