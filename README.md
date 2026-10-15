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
- `http://localhost:3000/design/ollama` — Ollama 원문과 이 시스템의 비교 페이지

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
| `npm run check` | lint → check:guards → typecheck → test → build 를 한 번에 |

## 폴더

```
design.md                  시각 정본 (컬러·타이포·곡률·간격·컴포넌트)
src/app/globals.css        토큰 (shadcn 시맨틱 이름)
src/components/ui/         shadcn 원본 + 복합 컴포넌트
src/app/design/            /design 카탈로그와 /design/ollama 비교 페이지
src/lib/                   유틸리티와 토큰 테스트
tools/design-system-lint/  다른 프로젝트에서 쓸 수 있는 lint 묶음
tools/eslint-rules/        자체 가드 규칙 (lint 묶음이 쓴다)
e2e/                       Playwright 테스트
```

## 요청과 문제 보고

컴포넌트·토큰이 모자라거나 문제가 생기면 GitHub 이슈로 올린다.
양식 고르는 법과 에이전트용 `gh` 명령은 [REQUESTS.md](REQUESTS.md) 에 있다.

## 다른 프로젝트에서 lint 쓰기

`tools/design-system-lint` 와 `tools/eslint-rules` 를 복사해 `eslint.config.mjs` 에 펼치면 된다.
자세한 절차는 [tools/design-system-lint/README.md](tools/design-system-lint/README.md) 를 본다.
