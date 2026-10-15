"use client"

/**
 * shadcn/ui label (base-nova, Base UI) — Ollama 테마. shadcn CLI 로 설치한 원본이다.
 *
 * 해부도
 *   라벨 텍스트
 *
 * 토큰
 *   text-sm font-medium
 *
 * 상태
 *   기본 / 비활성 그룹
 *
 * 키보드·ARIA
 *   네이티브 <label>
 *
 * 수용 기준
 *   - 컨트롤과 연결된다(htmlFor 또는 감싸기)
 *   - 색·곡률·크기는 globals.css 의 shadcn 시맨틱 토큰에서만 나온다.
 */

import * as React from "react"
import { cn } from "@/lib/utils"

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Label }
