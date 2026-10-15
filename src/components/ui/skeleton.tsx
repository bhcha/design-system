import { cn } from "@/lib/utils"

/**
 * shadcn/ui skeleton (base-nova) — Ollama 테마. shadcn CLI 로 설치한 원본이다.
 *
 * 해부도
 *   자리 표시 블록 하나 — 크기는 화면이 정한다
 *
 * 토큰
 *   bg-accent(6% ink) · rounded-md(8px) · animate-pulse
 *
 * 상태
 *   로딩 중(맥동)
 *
 * 키보드·ARIA
 *   장식이다. 로딩 중인 영역에는 aria-busy 를 두고, 스켈레톤 자체는 읽히지 않게 한다.
 *
 * 수용 기준
 *   - 흰 면 위에서 보인다.
 *   - 모양(곡률)은 토큰에서만 나온다.
 *   - 색·곡률·크기는 globals.css 의 shadcn 시맨틱 토큰에서만 나온다.
 */

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-accent", className)}
      {...props}
    />
  )
}

export { Skeleton }
