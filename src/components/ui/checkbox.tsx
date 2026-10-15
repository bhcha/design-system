"use client"

/**
 * shadcn/ui checkbox (base-nova, Base UI) — Ollama 테마. shadcn CLI 로 설치한 원본이다.
 *
 * 해부도
 *   체크 상자
 *
 * 토큰
 *   size-4 rounded-sm(6px) · 1px border-input · 체크 시 bg-primary text-primary-foreground
 *
 * 상태
 *   미선택 / 선택 / indeterminate / disabled / invalid
 *
 * 키보드·ARIA
 *   Base UI Checkbox — Space 로 토글, 숨은 input 으로 폼 제출
 *
 * 수용 기준
 *   - 선택이 색과 체크 표시 둘로 보인다
 *   - 색·곡률·크기는 globals.css 의 shadcn 시맨틱 토큰에서만 나온다.
 */

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { cn } from "@/lib/utils"
import { CheckIcon } from "lucide-react"

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer relative flex size-4 shrink-0 items-center justify-center rounded-sm border border-input transition-colors outline-none group-has-disabled/field:opacity-50 group-has-[:focus-visible]/field-label:ring-0 group-has-[:focus-visible]/field-label:not-data-checked:border-input after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed data-disabled:bg-muted data-disabled:text-mute aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground group-has-[:focus-visible]/field-label:data-checked:border-primary dark:data-checked:bg-primary",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none [&>svg]:size-3.5"
      >
        <CheckIcon
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
