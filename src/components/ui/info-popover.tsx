"use client"

import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

/**
 * InfoPopover — 트리거·제목·본문을 props 로 받는 보충 설명 팝오버 (shadcn Popover 조립)
 *
 * 해부도
 *   [트리거] → ┌ PopoverContent ┐
 *              │ PopoverTitle   │
 *              │ 본문           │
 *              └────────────────┘
 *
 * 토큰
 *   shadcn Popover — bg-popover · ring-1 ring-foreground/10 · rounded-lg(12px) · 그림자 없음
 *   폭 w-80 · 본문 text-base text-charcoal
 *
 * 상태
 *   닫힘 / 열림
 *
 * 키보드·ARIA
 *   Base UI Popover — 트리거 Enter/Space 로 열고 Esc 로 닫는다. 포커스를 가두지 않는다.
 *
 * 수용 기준
 *   - 배경을 가리지 않는다(모달이 아니다).
 */
export type InfoPopoverProps = {
  trigger: React.ReactElement<Record<string, unknown>>
  title: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function InfoPopover({ trigger, title, children, className }: InfoPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger render={trigger} />
      <PopoverContent sideOffset={8} className={cn("w-80 gap-2 p-4", className)}>
        <PopoverHeader>
          <PopoverTitle className="text-base font-semibold">{title}</PopoverTitle>
        </PopoverHeader>
        <div className="text-base text-charcoal">{children}</div>
      </PopoverContent>
    </Popover>
  )
}
