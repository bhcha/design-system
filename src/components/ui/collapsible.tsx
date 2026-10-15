"use client"

/**
 * shadcn/ui collapsible (base-nova, Base UI) — Ollama 테마. shadcn CLI 로 설치한 원본이다.
 *
 * 해부도
 *   Collapsible·Trigger·Content
 *
 * 토큰
 *   시각 없음 — 호출부가 입힌다
 *
 * 상태
 *   접힘 / 펼침
 *
 * 키보드·ARIA
 *   Base UI Collapsible — 트리거 aria-expanded
 *
 * 수용 기준
 *   - 펼침 상태가 트리거에 표시된다
 *   - 색·곡률·크기는 globals.css 의 shadcn 시맨틱 토큰에서만 나온다.
 */

import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible"

function Collapsible({ ...props }: CollapsiblePrimitive.Root.Props) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
}

function CollapsibleTrigger({ ...props }: CollapsiblePrimitive.Trigger.Props) {
  return (
    <CollapsiblePrimitive.Trigger data-slot="collapsible-trigger" {...props} />
  )
}

function CollapsibleContent({ ...props }: CollapsiblePrimitive.Panel.Props) {
  return (
    <CollapsiblePrimitive.Panel data-slot="collapsible-content" {...props} />
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
