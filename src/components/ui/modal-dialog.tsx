"use client"

import { XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

/**
 * ModalDialog — 트리거·제목·본문·하단 액션을 props 로 받는 모달 (shadcn Dialog 조립)
 *
 * 해부도
 *   [트리거]  →  ┌ DialogContent ───────────────┐
 *                │ DialogTitle / Description [✕] │
 *                │ 본문(스크롤)                   │
 *                │ DialogFooter(액션)             │
 *                └──────────────────────────────┘
 *
 * 토큰
 *   shadcn Dialog — bg-popover · ring-1 ring-foreground/10 · rounded-xl(12px) · 그림자 없음
 *   폭 max-w-reading(720px) · 닫기 Button ghost icon-sm
 *   본문 p-1(4px)으로 포커스 공간 확보 · -m-1로 제목·하단 액션과 본문 정렬 유지
 *
 * 상태
 *   닫힘 / 열림 · 제어(open·onOpenChange) / 비제어
 *
 * 키보드·ARIA
 *   Base UI Dialog — 포커스 가둠, Esc 닫기, 닫으면 트리거로 포커스 복귀.
 *   닫기 버튼 접근 가능한 이름은 closeLabel(기본 "닫기").
 *
 * 수용 기준
 *   - 본문이 길면 패널이 아니라 본문 영역이 스크롤한다.
 *   - 본문 폭을 채운 컨트롤의 바깥 포커스 링이 스크롤 경계에서 잘리지 않는다.
 */
export type ModalDialogProps = {
  trigger: React.ReactElement<Record<string, unknown>>
  title: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  closeLabel?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}

export function ModalDialog({
  trigger,
  title,
  description,
  children,
  footer,
  closeLabel = "닫기",
  open,
  onOpenChange,
  className,
}: ModalDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger render={trigger} />
      <DialogContent
        showCloseButton={false}
        className={cn(
          "flex max-h-[90dvh] flex-col p-6 sm:max-w-reading",
          className,
        )}
      >
        <DialogHeader className="flex-row items-start gap-3">
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <DialogTitle className="text-xl font-semibold break-words">
              {title}
            </DialogTitle>
            {description ? (
              <DialogDescription className="text-base">{description}</DialogDescription>
            ) : null}
          </div>
          <DialogClose
            render={<Button variant="secondary" size="icon-sm" aria-label={closeLabel} />}
          >
            <XIcon aria-hidden="true" />
          </DialogClose>
        </DialogHeader>
        <div
          data-slot="modal-dialog-body"
          className="-m-1 min-h-0 flex-1 scroll-p-1 overflow-y-auto overscroll-contain p-1"
        >
          {children}
        </div>
        {footer ? (
          <DialogFooter className="flex-row flex-wrap items-center justify-start gap-2 border-t border-border pt-3">
            {footer}
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
