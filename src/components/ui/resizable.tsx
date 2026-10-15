"use client"

import * as ResizablePrimitive from "react-resizable-panels"
import { cn } from "@/lib/utils"

/**
 * shadcn/ui resizable (react-resizable-panels v4) — Ollama 테마. 이슈 #2 의 SplitPane.
 *
 * 해부도
 *   ResizablePanelGroup(orientation horizontal | vertical)
 *     ResizablePanel ─ ResizableHandle ─ ResizablePanel [─ ResizableHandle ─ ResizablePanel …]
 *   핸들 = 1px 선 + 보이지 않는 8px 잡는 영역(after) [+ withHandle 이면 가운데 손잡이]
 *
 * 토큰
 *   선 --color-border · hover --color-hairline-strong · 드래그 중 --color-foreground
 *   손잡이 --color-hairline-strong rounded-full · 포커스 ring-2 --color-ring(불투명 파랑)
 *   그림자 없음. 패널 크기·최소 크기는 호출부가 % 또는 px 문자열로 준다(defaultSize · minSize).
 *
 * 상태
 *   기본 / hover / focus-visible / 드래그(data-separator="active") / 비활성(disabled)
 *   접기: ResizablePanel collapsible + collapsedSize. panelRef 의 collapse()·expand() 로 복원한다.
 *
 * 키보드·ARIA
 *   핸들은 role="separator" · tabIndex 0 · aria-orientation · aria-valuenow/min/max ·
 *   aria-controls(앞 패널) 를 라이브러리가 단다. aria-label 은 필수 prop 이다
 *   (예: "질문과 SQL 사이 크기 조절").
 *   ←→(세로 핸들) · ↑↓(가로 핸들) 로 크기 조절, Home·End 로 최소·최대.
 *   Enter 는 핸들 **앞** 패널이 collapsible 일 때만 접고 편다. 뒤 패널을 접으려면 버튼을 두고
 *   panelRef.collapse()·expand() 를 부른다(표본의 "분석 패널 접기").
 *
 * 좁은 화면
 *   이 컴포넌트는 스스로 쌓지 않는다. 834px 미만에서는 orientation="vertical" 로 바꿔
 *   위에서 아래로 쌓는다(DOM 순서 = 읽기 순서). 패널이 셋 이상이면 Tabs 로 전환한다.
 *
 * 수용 기준
 *   - 패널 안 내용은 패널 안에서 스크롤한다(ResizablePanel 에 overflow-auto). 문서 전체가 늘지 않는다.
 *   - minSize 아래로 줄지 않는다. 키보드만으로 크기를 바꾸고 접고 펼 수 있다.
 *   - 핸들에 접근 가능한 이름이 있다.
 */

function ResizablePanelGroup({
  className,
  ...props
}: ResizablePrimitive.GroupProps) {
  return (
    <ResizablePrimitive.Group
      data-slot="resizable-panel-group"
      className={cn(
        "flex h-full w-full aria-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    />
  )
}

function ResizablePanel({ className, ...props }: ResizablePrimitive.PanelProps) {
  return (
    <ResizablePrimitive.Panel
      data-slot="resizable-panel"
      className={cn("min-h-0 min-w-0 overflow-auto", className)}
      {...props}
    />
  )
}

function ResizableHandle({
  withHandle,
  className,
  ...props
}: ResizablePrimitive.SeparatorProps & {
  withHandle?: boolean
  /** 무엇과 무엇 사이인지 — 예: "질문과 SQL 사이 크기 조절". */
  "aria-label": string
}) {
  return (
    <ResizablePrimitive.Separator
      data-slot="resizable-handle"
      className={cn(
        "relative flex w-px shrink-0 items-center justify-center bg-border transition-colors outline-none",
        "after:absolute after:inset-y-0 after:left-1/2 after:w-2 after:-translate-x-1/2",
        "data-[separator=hover]:bg-hairline-strong data-[separator=active]:bg-foreground",
        "focus-visible:ring-2 focus-visible:ring-ring",
        "data-disabled:bg-border",
        "aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:after:left-0 aria-[orientation=horizontal]:after:h-2 aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:translate-x-0 aria-[orientation=horizontal]:after:-translate-y-1/2 [&[aria-orientation=horizontal]>div]:rotate-90",
        className
      )}
      {...props}
    >
      {withHandle && (
        <div
          aria-hidden="true"
          className="z-10 flex h-6 w-1 shrink-0 rounded-full bg-hairline-strong"
        />
      )}
    </ResizablePrimitive.Separator>
  )
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup }
