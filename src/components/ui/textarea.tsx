/**
 * shadcn/ui textarea (base-nova, Base UI) — Ollama 테마. shadcn CLI 로 설치한 원본이다.
 *
 * 해부도
 *   여러 줄 입력
 *
 * 토큰
 *   bg-background · 1px border-input · rounded-lg(적용 차이 6) · px-4 py-2 · text-base
 *
 * 상태
 *   기본 / focus / aria-invalid / disabled
 *
 * 키보드·ARIA
 *   네이티브 textarea. 붙여넣기를 막지 않는다.
 *
 * 수용 기준
 *   - pill 이 아니라 12px 곡률
 *   - 색·곡률·크기는 globals.css 의 shadcn 시맨틱 토큰에서만 나온다.
 */
import * as React from "react"
import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-16 w-full rounded-lg border border-input bg-background px-4 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:bg-muted disabled:text-mute aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
