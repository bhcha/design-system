import { cn } from "@/lib/utils"

/**
 * ActionFooter — 폼·패널 하단의 액션 줄 (저장·취소 버튼 묶음)
 *
 * 해부도
 *   ─────────────── (위쪽 1px hairline)
 *   [ 버튼 ][ 버튼 ] …
 *   sticky 이면 스크롤 컨테이너 바닥에 붙는다(작업 도구 패널의 액션 푸터 패턴).
 *
 * 토큰
 *   위 테두리 border-border(hairline) · 버튼 간격 gap-2 · 위 여백 pt-3
 *   sticky: bg-background · 패널 패딩을 상쇄하는 -mx-4 -mb-4 px-4 py-3 · z-10(globals.css 층위 표)
 *
 * 상태
 *   기본 / sticky
 *
 * 키보드·ARIA
 *   시맨틱 없음 — 안의 버튼이 포커스를 받는다.
 *
 * 수용 기준
 *   - 폼이 길어도 sticky 이면 저장 버튼이 보인다.
 *   - 그림자 없이 hairline 하나로 본문과 나뉜다.
 */
export function ActionFooter({
  sticky = false,
  className,
  ...props
}: React.ComponentProps<"div"> & { sticky?: boolean }) {
  return (
    <div
      data-slot="action-footer"
      className={cn(
        "flex flex-wrap gap-2 border-t border-border",
        sticky ? "sticky bottom-0 z-10 -mx-4 -mb-4 bg-background px-4 py-3" : "pt-3",
        className,
      )}
      {...props}
    />
  )
}
