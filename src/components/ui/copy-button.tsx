"use client"

import { useState } from "react"
import { CheckIcon, CopyIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

/**
 * CopyButton — 주어진 문자열을 클립보드에 복사하는 아이콘 버튼.
 *
 * 해부도
 *   [ 복사 아이콘 → 복사됨 체크 ] + sr-only 알림(aria-live)
 *
 * 토큰
 *   Button variant="ghost" size="icon-sm" 그대로 — 모양은 Button 이 정한다.
 *
 * 상태
 *   대기 / 복사됨(2초) / 복사 실패(2초)
 *
 * 키보드·ARIA
 *   <button>. aria-label 이 상태를 따라 "{label}" → "복사됨" → "복사 실패" 로 바뀌고,
 *   aria-live="polite" 영역이 결과를 읽어 준다.
 *
 * 수용 기준
 *   - 화면에 보이는 것(줄 번호 등)이 아니라 value 그대로를 복사한다.
 *   - 클립보드 권한이 없으면 "복사 실패"를 알린다.
 */
export function CopyButton({
  value,
  label = "복사",
}: {
  value: string
  /** 대기 상태의 접근 가능한 이름 — 예: "SQL 복사". */
  label?: string
}) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle")

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setState("copied")
    } catch {
      setState("failed")
    }
    window.setTimeout(() => setState("idle"), 2000)
  }

  const current =
    state === "copied" ? "복사됨" : state === "failed" ? "복사 실패" : label

  return (
    <>
      <Button variant="ghost" size="icon-sm" onClick={copy} aria-label={current}>
        {state === "copied" ? (
          <CheckIcon aria-hidden="true" />
        ) : (
          <CopyIcon aria-hidden="true" />
        )}
      </Button>
      <span aria-live="polite" className="sr-only">
        {state === "idle" ? "" : current}
      </span>
    </>
  )
}
