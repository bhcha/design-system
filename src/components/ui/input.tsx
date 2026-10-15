/**
 * shadcn/ui input (base-nova, Base UI) — Ollama 테마. shadcn CLI 로 설치한 원본이다.
 *
 * 해부도
 *   한 줄 입력 pill
 *
 * 토큰
 *   {component.text-input} — bg-background · 1px border-input · rounded-full · h-10 px-4 · text-base. 포커스 border-foreground + ring-3 ring-ring
 *
 * 상태
 *   기본 / focus / aria-invalid / disabled(bg-muted text-mute)
 *
 * 키보드·ARIA
 *   Base UI Input. 접근 가능한 이름은 Label/FormField 가 만든다.
 *
 * 수용 기준
 *   - 높이 40px · 곡률 9999px · 16px
 *   - 색·곡률·크기는 globals.css 의 shadcn 시맨틱 토큰에서만 나온다.
 */
import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-full border border-input bg-background px-4 py-2 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-muted disabled:text-mute aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }
