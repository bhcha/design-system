/**
 * shadcn/ui spinner (base-nova) — Ollama 테마. shadcn CLI 로 설치한 원본이다.
 *
 * 해부도
 *   회전하는 Loader2 아이콘 하나
 *
 * 토큰
 *   size-4 · currentColor(부모 글자색) · animate-spin
 *
 * 상태
 *   회전 중
 *
 * 키보드·ARIA
 *   role=status · aria-label="불러오는 중". 맥락이 다르면 aria-label 을 덮어쓴다.
 *
 * 수용 기준
 *   - 접근 가능한 이름이 있다.
 *   - 색은 부모 글자색(토큰)에서 온다.
 *   - 색·곡률·크기는 globals.css 의 shadcn 시맨틱 토큰에서만 나온다.
 */
import { cn } from "@/lib/utils"
import { Loader2Icon } from "lucide-react"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <Loader2Icon data-slot="spinner" role="status" aria-label="불러오는 중" className={cn("size-4 animate-spin", className)} {...props} />
  )
}

export { Spinner }
