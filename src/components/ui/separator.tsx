"use client"

/**
 * shadcn/ui separator (base-nova, Base UI) — Ollama 테마. shadcn CLI 로 설치한 원본이다.
 *
 * 해부도
 *   가로·세로 1px 구분선
 *
 * 토큰
 *   bg-border(hairline)
 *
 * 상태
 *   가로 / 세로
 *
 * 키보드·ARIA
 *   장식이면 role 없음, 의미가 있으면 role="separator"
 *
 * 수용 기준
 *   - 두께 1px
 *   - 색·곡률·크기는 globals.css 의 shadcn 시맨틱 토큰에서만 나온다.
 */

import { Separator as SeparatorPrimitive } from "@base-ui/react/separator"
import { cn } from "@/lib/utils"

function Separator({
  className,
  orientation = "horizontal",
  ...props
}: SeparatorPrimitive.Props) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch",
        className
      )}
      {...props}
    />
  )
}

export { Separator }
