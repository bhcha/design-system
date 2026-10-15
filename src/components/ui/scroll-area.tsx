"use client"

/**
 * shadcn/ui scroll-area (base-nova, Base UI) — Ollama 테마. shadcn CLI 로 설치한 원본이다.
 *
 * 해부도
 *   스스로 스크롤하는 영역 + 얇은 스크롤바
 *
 * 토큰
 *   스크롤바 bg-border · rounded-full
 *
 * 상태
 *   스크롤 / 스크롤 없음
 *
 * 키보드·ARIA
 *   Base UI ScrollArea — 뷰포트가 tabIndex=0 이라 Tab 으로 들어가 화살표로 스크롤한다
 *
 * 수용 기준
 *   - 내용이 넘칠 때만 스크롤바가 보인다
 *   - 색·곡률·크기는 globals.css 의 shadcn 시맨틱 토큰에서만 나온다.
 */

import * as React from "react"
import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area"
import { cn } from "@/lib/utils"

function ScrollArea({
  className,
  children,
  ...props
}: ScrollAreaPrimitive.Root.Props) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("relative", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        // 키보드 사용자가 스크롤할 수 있도록 뷰포트를 탭 순서에 넣는다(axe scrollable-region-focusable).
        tabIndex={0}
        className="size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-1"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: ScrollAreaPrimitive.Scrollbar.Props) {
  return (
    <ScrollAreaPrimitive.Scrollbar
      data-slot="scroll-area-scrollbar"
      data-orientation={orientation}
      orientation={orientation}
      className={cn(
        "flex touch-none p-px transition-colors select-none data-horizontal:h-2.5 data-horizontal:flex-col data-horizontal:border-t data-horizontal:border-t-transparent data-vertical:h-full data-vertical:w-2.5 data-vertical:border-l data-vertical:border-l-transparent",
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb
        data-slot="scroll-area-thumb"
        className="relative flex-1 rounded-full bg-border"
      />
    </ScrollAreaPrimitive.Scrollbar>
  )
}

export { ScrollArea, ScrollBar }
