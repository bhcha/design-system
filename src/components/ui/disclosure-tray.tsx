import { cn } from "@/lib/utils";

/**
 * DisclosureTray — 접이식 트레이
 *
 * shadcn 기반 — 네이티브 유지
 *   shadcn `Collapsible`(Base UI) 로 옮기지 **않는다**. 이유:
 *   1. props 계약이 `React.ComponentProps<"details">` 이고 호출부가 `open` 을 그대로
 *      넘긴다(/design 표본의 펼침 상태). Collapsible 로 바꾸면 계약이 바뀐다.
 *   2. 서버 컴포넌트 화면에서 좁은 폭 사이드바 메뉴 등을 감싼다.
 *      Collapsible 은 클라이언트 컴포넌트라 하이드레이션 전에는 열리지 않는다 —
 *      "JS 없이 동작" 수용 기준을 잃는다.
 *   3. 요약 줄 클릭 = 토글 이라는 동작은 어느 쪽도 같으므로 1·2 를 깨면서 얻는 것이
 *      없다.
 *   그래서 <details>/<summary> 를 유지하고 시각만 design.md 토큰으로 맞춘다.
 *
 * 근거: ADS 디스클로저 해부도(요약 줄 + 펼침 화살표 + 본문). 네이티브
 * `<details>/<summary>` 로 구현해 클라이언트 JS 없이 서버 컴포넌트로 남긴다.
 * 시각 값은 전부 design.md 토큰.
 *
 * 해부도
 *   ▸ [요약] [보조 정보]        ← summary, 클릭 대상
 *     [본문]                    ← 펼쳐졌을 때만
 *
 * 토큰
 *   배경 --color-background · 테두리 --color-border · 곡률 --radius-lg
 *   요약 --text-base + font-medium · 보조 --text-xs + ink-subtle
 *   화살표는 CSS 회전(transform)만 애니메이션한다 — prefers-reduced-motion 은 전역 처리.
 *
 * 상태
 *   접힘 / 펼침 / hover / focus-visible
 *
 * 키보드·ARIA
 *   `<summary>` 는 기본으로 포커스를 받고 Enter·Space 로 토글되며 `aria-expanded` 가
 *   브라우저에서 자동 노출된다. 직접 ARIA 를 쓰지 않는 편이 더 정확하다.
 *
 * 수용 기준
 *   - JS 없이 동작한다.
 *   - 기본 삼각형 마커가 사라지고 우리 화살표만 보인다.
 */
export type DisclosureTrayProps = React.ComponentProps<"details"> & {
  summary: React.ReactNode;
  /** 요약 오른쪽 보조 정보(개수·상태 등). */
  meta?: React.ReactNode;
};

export function DisclosureTray({
  className,
  summary,
  meta,
  children,
  ...props
}: DisclosureTrayProps) {
  return (
    <details
      className={cn(
        "group rounded-lg border border-border bg-background",
        className,
      )}
      {...props}
    >
      <summary className="flex cursor-pointer list-none items-center gap-2 p-3 select-none hover:bg-accent [&::-webkit-details-marker]:hidden">
        <span
          aria-hidden="true"
          className="inline-block text-xs text-charcoal transition-transform duration-150 group-open:rotate-90"
        >
          ▶
        </span>
        <span className="min-w-0 flex-1 text-base font-medium text-foreground">
          {summary}
        </span>
        {meta ? (
          <span className="shrink-0 text-xs text-charcoal">{meta}</span>
        ) : null}
      </summary>

      <div className="border-t border-border p-3">{children}</div>
    </details>
  );
}
