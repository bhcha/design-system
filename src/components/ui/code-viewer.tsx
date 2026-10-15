import { codeToTokens, createCssVariablesTheme } from "shiki"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { CopyButton } from "@/components/ui/copy-button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

/**
 * CodeViewer — 읽기 전용 코드 보기 (이슈 #3). 구문 강조는 Shiki 가 서버에서 한다.
 *
 * 서버 컴포넌트(async)다. 브라우저로 가는 JS 는 복사 버튼(CopyButton)뿐이다.
 * 클라이언트 컴포넌트 안에서는 쓸 수 없다 — 서버 화면에서 그리고 props 로 넘긴다.
 * 편집은 이 컴포넌트의 책임이 아니다(별도 Editor 로 요청한다). 실행 결과를 보여 주는 자리도 아니다.
 *
 * 해부도
 *   Card(figure)
 *     [ 파일명 · 언어 배지 ··· actions · 복사 ]  ← 머리
 *     ─ Separator ─
 *     [ 줄 번호 │ 코드 ]  ← 본문(내부 스크롤, 포커스 가능)
 *     [ footer — 출처 링크·설명 ]  (선택)
 *
 * 토큰
 *   면 bg-muted · 머리 글자 text-sm · 코드 font-mono text-sm(14px/20px)
 *   줄 번호 --color-mute 계열이 아니라 --color-muted-foreground(대비 4.5:1)
 *   강조 줄 --color-status-info-soft + 줄 번호 --color-foreground
 *   구문 색 --color-syntax-{keyword·string·constant·function·comment·punctuation}
 *   (Shiki css-variables 테마의 토큰 이름을 이 유틸리티로 바꾼다 — 인라인 style 없음)
 *
 * 상태
 *   기본 / 빈 값(code="") / 로딩(CodeViewerSkeleton — Suspense fallback) / 오류(error)
 *   줄 바꿈 wrap(기본 끔 — 가로 스크롤) · 강조 범위 highlight · 시작 줄 startLine
 *   fill — 부모 높이를 채우고 본문만 스크롤한다(ResizablePanel 안에서 쓴다)
 *
 * 키보드·ARIA
 *   <figure> + <figcaption>(파일명). 본문 스크롤 영역은 tabIndex 0 + aria-label 이라
 *   키보드로 스크롤할 수 있고 포커스가 보인다(ring-2 ring-ring).
 *   줄 번호는 aria-hidden + select-none — 읽기와 선택·복사에서 빠진다.
 *   각 줄에 id `{id}-L{n}` 이 있어 `href="#{id}-L{n}"` 로 강조 줄로 이동할 수 있다.
 *
 * 수용 기준
 *   - 복사하면 줄 번호 없이 원문 그대로가 복사된다.
 *   - 긴 SQL 은 wrap 이 꺼져 있으면 가로로, 켜져 있으면 줄을 바꿔 보인다. 문서 전체는 늘지 않는다.
 *   - 빈 값·오류는 코드처럼 보이지 않는다.
 *   - 구문 색은 코드 면 위에서 4.5:1 이상이다.
 */

export type CodeLanguage =
  | "sql"
  | "python"
  | "java"
  | "json"
  | "typescript"
  | "tsx"
  | "javascript"
  | "bash"
  | "text"

const LANGUAGE_LABEL: Record<CodeLanguage, string> = {
  sql: "SQL",
  python: "Python",
  java: "Java",
  json: "JSON",
  typescript: "TypeScript",
  tsx: "TSX",
  javascript: "JavaScript",
  bash: "Bash",
  text: "Text",
}

const theme = createCssVariablesTheme({ name: "design-system", variablePrefix: "--shiki-" })

/** Shiki css-variables 테마가 내는 색 이름 → 토큰 유틸리티. */
const TOKEN_CLASS: Record<string, string> = {
  "var(--shiki-token-keyword)": "text-syntax-keyword",
  "var(--shiki-token-string)": "text-syntax-string",
  "var(--shiki-token-string-expression)": "text-syntax-string",
  "var(--shiki-token-constant)": "text-syntax-constant",
  "var(--shiki-token-function)": "text-syntax-function",
  "var(--shiki-token-comment)": "text-syntax-comment",
  "var(--shiki-token-punctuation)": "text-syntax-punctuation",
  "var(--shiki-token-link)": "text-syntax-keyword",
}

type Token = { content: string; className: string }

async function tokenize(code: string, language: CodeLanguage): Promise<Token[][]> {
  if (language === "text") {
    return code.split("\n").map((line) => [{ content: line, className: "" }])
  }
  const { tokens } = await codeToTokens(code, { lang: language, theme })
  return tokens.map((line) =>
    line.map((token) => ({
      content: token.content,
      className: cn(
        (token.color && TOKEN_CLASS[token.color]) || "text-foreground",
        // FontStyle.Italic = 1
        (token.fontStyle ?? 0) & 1 ? "italic" : undefined
      ),
    }))
  )
}

/** [3, [10, 12]] → 3 · 10 · 11 · 12 */
function highlightedLines(highlight: CodeViewerProps["highlight"]): Set<number> {
  const lines = new Set<number>()
  for (const entry of highlight ?? []) {
    if (typeof entry === "number") lines.add(entry)
    else for (let n = entry[0]; n <= entry[1]; n++) lines.add(n)
  }
  return lines
}

export type CodeViewerProps = {
  code: string
  language: CodeLanguage
  /** 머리에 보이는 파일 이름. 없으면 언어 이름을 쓴다. */
  filename?: string
  /** 줄 앵커 접두어 — `{id}-L{n}`. 한 화면에 둘 이상이면 서로 달라야 한다. */
  id?: string
  /** 첫 줄의 번호. 파일 일부를 보여 줄 때 원본 줄 번호를 맞춘다. */
  startLine?: number
  /** 강조할 줄(원본 줄 번호). 숫자 하나 또는 [시작, 끝]. */
  highlight?: readonly (number | readonly [number, number])[]
  /** 긴 줄을 바꿔 보인다. 끄면 가로 스크롤. */
  wrap?: boolean
  /** 부모 높이를 채우고 본문만 스크롤한다. 끄면 본문 최대 높이 24rem. */
  fill?: boolean
  /** 오류 문구. 있으면 코드 대신 보인다. */
  error?: string
  /** 머리 오른쪽, 복사 버튼 앞에 놓을 것. */
  actions?: React.ReactNode
  /** 본문 아래 — 출처 링크·설명. */
  footer?: React.ReactNode
  className?: string
}

export async function CodeViewer({
  code,
  language,
  filename,
  id = "code",
  startLine = 1,
  highlight,
  wrap = false,
  fill = false,
  error,
  actions,
  footer,
  className,
}: CodeViewerProps) {
  const title = filename ?? LANGUAGE_LABEL[language]
  const empty = code.trim() === ""
  const lines = error || empty ? [] : await tokenize(code.replace(/\n$/, ""), language)
  const marked = highlightedLines(highlight)

  return (
    <Card
      render={<figure />}
      data-slot="code-viewer"
      variant="muted"
      className={cn("gap-0 py-0", fill && "h-full", className)}
    >
      <div className="flex items-center gap-2 px-4 py-2">
        <figcaption className="min-w-0 truncate font-mono text-sm text-foreground">
          {title}
        </figcaption>
        {filename ? <Badge variant="muted">{LANGUAGE_LABEL[language]}</Badge> : null}
        <div className="ml-auto flex items-center gap-1">
          {actions}
          {!error && !empty ? <CopyButton value={code} label={`${title} 복사`} /> : null}
        </div>
      </div>
      <Separator />

      {error ? (
        <p role="alert" className="px-4 py-6 text-sm text-status-danger">
          {error}
        </p>
      ) : empty ? (
        <p className="px-4 py-6 text-sm text-muted-foreground">표시할 코드가 없다.</p>
      ) : (
        <div
          tabIndex={0}
          aria-label={`${title} 코드`}
          className={cn(
            "overflow-auto outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
            fill ? "min-h-0 flex-1" : "max-h-96"
          )}
        >
          <pre className={cn("py-3 font-mono text-sm", wrap ? "whitespace-pre-wrap" : "w-max min-w-full")}>
            <code className="grid">
              {lines.map((tokens, index) => {
                const n = startLine + index
                const on = marked.has(n)
                return (
                  <span
                    key={n}
                    id={`${id}-L${n}`}
                    data-highlighted={on ? "" : undefined}
                    className={cn("flex scroll-mt-12 pr-4", on && "bg-status-info-soft")}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "w-12 shrink-0 pr-4 text-right select-none",
                        on ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {n}
                    </span>
                    <span className={cn("min-w-0", wrap && "break-words")}>
                      {tokens.length === 0 || (tokens.length === 1 && tokens[0].content === "")
                        ? " "
                        : tokens.map((token, t) => (
                            <span key={t} className={token.className}>
                              {token.content}
                            </span>
                          ))}
                    </span>
                  </span>
                )
              })}
            </code>
          </pre>
        </div>
      )}

      {footer ? (
        <>
          <Separator />
          <div className="px-4 py-3 text-sm text-charcoal">{footer}</div>
        </>
      ) : null}
    </Card>
  )
}

/** 로딩 — `<Suspense fallback={<CodeViewerSkeleton />}>` 로 쓴다. */
export function CodeViewerSkeleton({
  filename = "불러오는 중",
  lines = 6,
}: {
  filename?: string
  lines?: number
}) {
  return (
    <Card render={<figure aria-busy="true" />} variant="muted" className="gap-0 py-0">
      <div className="flex items-center gap-2 px-4 py-2">
        <figcaption className="font-mono text-sm text-muted-foreground">{filename}</figcaption>
      </div>
      <Separator />
      <div className="flex flex-col gap-2 px-4 py-4">
        {Array.from({ length: lines }, (_, i) => (
          <Skeleton key={i} className={cn("h-4", i % 3 === 2 ? "w-1/2" : "w-3/4")} />
        ))}
      </div>
    </Card>
  )
}
