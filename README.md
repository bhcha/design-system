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

## 다른 프로젝트에서 쓰기

**정본은 이 GitHub 저장소의 `main` 이다.** https://github.com/bhcha/design-system

다른 프로젝트에 복사된 사본이나 로컬 폴더를 기준으로 삼지 않는다.
쓰는 쪽(사람이든 에이전트든)은 가져오거나 고치기 전에 저장소의 `main` 을 본다.
npm 패키지가 아니라 shadcn 방식대로 **파일을 복사해서** 쓴다.

### 1. 먼저 읽을 것

| 파일 | 왜 |
|---|---|
| `design.md` | 색·서체·곡률·간격·컴포넌트 모양의 시각 정본과 "이 앱에서의 적용 차이" |
| `src/components/ui/*.tsx` 머리 주석 | 컴포넌트마다 해부도·토큰·상태·키보드·ARIA·수용 기준 |
| `/design` 카탈로그 | 이 저장소에서 `npm run dev` 후 전 컴포넌트의 상태 표본을 본다 |

### 2. 가져올 파일

| 저장소 경로 | 쓰는 프로젝트 경로 | 내용 |
|---|---|---|
| `src/components/ui/` | `src/components/ui/` | 컴포넌트 |
| `src/hooks/` | `src/hooks/` | 컴포넌트가 쓰는 훅 |
| `src/lib/utils.ts` | `src/lib/utils.ts` | `cn()` |
| `src/app/globals.css`, `src/app/pretendard.css` | `src/app/` | 토큰과 한글 서체 |
| `public/fonts/pretendard/` | `public/fonts/pretendard/` | Pretendard (SIL OFL, 라이선스 파일 포함) |
| `tools/design-system-lint/`, `tools/eslint-rules/` | `tools/` | lint (선택) |

`@/` 경로 별칭(`tsconfig.json` 의 `"@/*": ["./src/*"]`)이 있어야 한다.
`src/app/layout.tsx` 처럼 Inter·Nunito 를 `next/font/google` 로 불러 `--font-inter` ·
`--font-nunito` 변수를 `<html>` 에 심는다.

```bash
git clone --depth 1 https://github.com/bhcha/design-system /tmp/design-system
cd /tmp/design-system && git rev-parse --short HEAD   # 가져온 커밋 — 아래 3번에 기록
cd -  # 쓰는 프로젝트 루트로 돌아와서
mkdir -p src/components src/lib src/app public/fonts tools
cp -R /tmp/design-system/src/components/ui src/components/
cp -R /tmp/design-system/src/hooks src/
cp /tmp/design-system/src/lib/utils.ts src/lib/
cp /tmp/design-system/src/app/globals.css /tmp/design-system/src/app/pretendard.css src/app/
cp -R /tmp/design-system/public/fonts/pretendard public/fonts/
cp -R /tmp/design-system/tools/design-system-lint /tmp/design-system/tools/eslint-rules tools/   # lint 를 쓸 때
```

의존성:

```bash
npm i @base-ui/react class-variance-authority clsx tailwind-merge lucide-react tw-animate-css shadcn \
      cmdk date-fns input-otp react-day-picker sonner
npm i -D tailwindcss @tailwindcss/postcss
```

lint 를 켜는 방법은 [tools/design-system-lint/README.md](tools/design-system-lint/README.md) 에 있다.

### 3. 가져온 커밋을 기록하고 갱신한다

- 쓰는 프로젝트의 `AGENTS.md`(아래 문구)에 가져온 커밋 해시를 적는다.
- 갱신할 때는 최신 커밋과 비교해서 바뀐 파일만 다시 가져온다.

```bash
git ls-remote https://github.com/bhcha/design-system main   # 최신 커밋
```

- 가져온 컴포넌트·토큰 파일은 쓰는 쪽에서 고치지 않는다. 고칠 일이 생기면 이슈로 요청하고,
  디자인 시스템에 반영된 뒤 다시 가져온다. 쓰는 쪽에서 고치면 다음 갱신 때 덮어써진다.

### 4. 쓰는 프로젝트의 AGENTS.md 에 붙일 문구

그 프로젝트의 에이전트가 정본을 확인하고, 모자란 것을 직접 만들지 않고 이슈로 요청하게 된다.

```md
## 디자인 시스템

- 정본: https://github.com/bhcha/design-system 의 main. 가져온 커밋: <해시>
- UI 는 디자인 시스템의 컴포넌트(`src/components/ui`)와 토큰(`src/app/globals.css`)으로만 만든다.
  컴포넌트 사용법은 파일 머리의 스펙 주석과 저장소의 `design.md` 를 본다.
- `src/components/ui` · `globals.css` 는 이 프로젝트에서 고치지 않는다.
- 필요한 컴포넌트·variant·토큰이 없거나, 컴포넌트·토큰·lint 가 잘못 동작하면
  화면에서 직접 만들거나 lint 를 끄지 말고 디자인 시스템 저장소에 이슈를 올린다.
  양식과 `gh issue create` 예시: https://github.com/bhcha/design-system/blob/main/REQUESTS.md
- 올린 이슈 번호를 작업 기록에 남긴다.
```

## 요청과 문제 보고

컴포넌트·토큰이 모자라거나 문제가 생기면 GitHub 이슈로 올린다.
양식 고르는 법과 에이전트용 `gh` 명령은 [REQUESTS.md](REQUESTS.md) 에 있다.
