"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * {component.install-snippet} — 스펙 시트
 *
 * 바탕 primitive (shadcn/ui base-nova)
 *   복사 버튼 → shadcn `Button` variant="ghost" size="icon-sm"(32px 원형, Base UI 네이티브
 *   `<button>`), 아이콘은 lucide `CopyIcon`/`CheckIcon`. pill 껍데기와 `<code>` 는 대응
 *   primitive 가 없어(InputGroup 은 입력 컨트롤용) 토큰으로 직접 그린다.
 *
 * 해부도
 *   [ $ ][ 명령 (code-md) ........................ ][ 복사 아이콘 버튼 ]
 *   한 개의 pill. 좁은 폭에서는 명령이 두 줄로 감기고 복사 버튼은 오른쪽에 붙어 있다
 *   (design.md: "wraps … rather than truncating; the copy-icon stays anchored").
 *
 * 토큰 — design.md {component.install-snippet}
 *   배경 --color-muted(soft) · 글자 --color-foreground · {typography.code-md}(font-mono 16/24)
 *   padding 12px 20px(py-3 px-5) · 최소 높이 48px(min-h-12) · 곡률 --radius-full
 *   프롬프트 기호 `$` --color-charcoal
 *   복사 버튼 32px 원형(Button ghost icon-sm) · 아이콘 --color-charcoal → hover --color-foreground +
 *   --color-accent 면 · 포커스 ring-3 --color-ring/50 (Button)
 *
 * 상태
 *   기본 / 복사 버튼 hover / focus-visible(ring) / 복사됨(라벨 "복사됨", 2초)
 *
 * 키보드·ARIA
 *   복사 버튼은 네이티브 <button>(Base UI Button)이고 aria-label 이 상태를 말한다("명령 복사" → "복사됨").
 *   상태 변화는 aria-live="polite" 영역이 읽는다. `$` 는 장식이라 aria-hidden.
 *
 * 수용 기준
 *   - 높이 48px 이상 · 곡률 9999px · soft surface.
 *   - 명령이 잘리지 않고 감긴다.
 *   - 클립보드 API 가 없으면 버튼이 조용히 실패하지 않고 "복사 실패"를 알린다.
 */
export function InstallSnippet({
  command,
  className,
}: {
  command: string;
  className?: string;
}) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setState("copied");
    } catch {
      setState("failed");
    }
    window.setTimeout(() => setState("idle"), 2000);
  }

  const label =
    state === "copied" ? "복사됨" : state === "failed" ? "복사 실패" : "명령 복사";

  return (
    <div
      className={cn(
        "flex min-h-12 items-center gap-3 rounded-full bg-muted py-3 pl-5 pr-2",
        className,
      )}
    >
      <code className="min-w-0 flex-1 break-all font-mono text-base text-foreground">
        <span aria-hidden="true" className="text-charcoal">
          ${" "}
        </span>
        {command}
      </code>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={copy}
        aria-label={label}
        className="text-charcoal hover:bg-accent hover:text-foreground"
      >
        {state === "copied" ? (
          <CheckIcon aria-hidden="true" />
        ) : (
          <CopyIcon aria-hidden="true" />
        )}
      </Button>
      <span aria-live="polite" className="sr-only">
        {state === "idle" ? "" : label}
      </span>
    </div>
  );
}
