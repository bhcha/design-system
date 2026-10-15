/**
 * shadcn/ui native-select (base-nova, Base UI) — Ollama 테마. shadcn CLI 로 설치한 원본이다.
 *
 * 해부도
 *   네이티브 select + ▾ 표시자
 *
 * 토큰
 *   {component.text-input} 과 같은 pill — h-10 rounded-full pl-4 pr-10 · size=sm h-8
 *
 * 상태
 *   기본 / focus / invalid / disabled
 *
 * 키보드·ARIA
 *   네이티브 select — 모바일·스크린 리더 동작을 그대로 쓴다. 표시자는 aria-hidden
 *
 * 수용 기준
 *   - 표시자가 보여 TextInput 과 구별된다
 *   - 색·곡률·크기는 globals.css 의 shadcn 시맨틱 토큰에서만 나온다.
 */
import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDownIcon } from "lucide-react"

type NativeSelectProps = Omit<React.ComponentProps<"select">, "size"> & {
  size?: "sm" | "default"
}

function NativeSelect({
  className,
  size = "default",
  ...props
}: NativeSelectProps) {
  return (
    <div
      className={cn(
        "group/native-select relative w-fit has-[select:disabled]:text-mute",
        className
      )}
      data-slot="native-select-wrapper"
      data-size={size}
    >
      <select
        data-slot="native-select"
        data-size={size}
        className="h-10 w-full min-w-0 appearance-none rounded-full border border-input bg-background py-2 pr-10 pl-4 text-base transition-colors outline-none select-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground focus-visible:border-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:cursor-not-allowed aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-[size=sm]:h-8 data-[size=sm]:pl-3 data-[size=sm]:text-sm dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"
        {...props}
      />
      <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted-foreground select-none" aria-hidden="true" data-slot="native-select-icon" />
    </div>
  )
}

function NativeSelectOption({
  className,
  ...props
}: React.ComponentProps<"option">) {
  return (
    <option
      data-slot="native-select-option"
      className={cn("bg-[Canvas] text-[CanvasText]", className)}
      {...props}
    />
  )
}

function NativeSelectOptGroup({
  className,
  ...props
}: React.ComponentProps<"optgroup">) {
  return (
    <optgroup
      data-slot="native-select-optgroup"
      className={cn("bg-[Canvas] text-[CanvasText]", className)}
      {...props}
    />
  )
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption }
