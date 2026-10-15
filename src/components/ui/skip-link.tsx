import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * SkipLink — 본문 바로가기
 *
 * shadcn 기반
 *   shadcn `buttonVariants({ variant: "default", size: "sm" })` 를 입힌 <a> 다 —
 *   포커스를 받아 나타나는 순간 Button(primary · compact 32px · pill)과 같은 모양이다.
 *   평소에는 `sr-only` 로 숨긴다. 포커스 시 `focus:not-sr-only` 가 height·padding 을
 *   auto·0 으로 되돌리므로 Button 의 높이(h-8)·좌우 패딩(px-4)을 focus: 변형으로 다시 건다.
 *   이동이므로 Base UI Button 이 아니라 네이티브 <a href="#id"> 다(서버 컴포넌트 유지).
 *
 * 근거: ADS 접근성 원칙 "헤딩 계층 + 본문 건너뛰기 링크". 시각 값은 design.md 토큰.
 *
 * 해부도
 *   평소에는 보이지 않다가 키보드 포커스를 받으면 좌상단에 나타나는 pill 링크.
 *
 * 토큰
 *   Button default/sm — 배경 --color-primary · 텍스트 --color-primary-foreground ·
 *   곡률 --radius-full · 높이 32px · 라벨 {typography.button-md} 14px/500
 *   위치 top-2 left-2 · 층위 z-50
 *
 * 상태
 *   숨김(기본) / 포커스(표시, Button 의 focus-visible ring)
 *
 * 키보드·ARIA
 *   문서에서 가장 먼저 포커스를 받아야 하므로 <body> 최상단에 둔다.
 *   `sr-only` 로 숨기고 `focus:not-sr-only` 로 되살린다 — display:none 은 쓰지 않는다
 *   (포커스를 받을 수 없게 되기 때문).
 *
 * 수용 기준
 *   - Tab 한 번에 도달한다.
 *   - 활성화하면 targetId 요소로 포커스가 옮겨간다(대상에 tabindex="-1" 필요).
 */
export function SkipLink({
  targetId,
  children = "본문 바로가기",
  className,
}: {
  targetId: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={`#${targetId}`}
      className={cn(
        buttonVariants({ variant: "default", size: "sm" }),
        "sr-only focus:not-sr-only",
        "focus:absolute focus:top-2 focus:left-2 focus:z-50",
        "focus:h-8 focus:px-4",
        className,
      )}
    >
      {children}
    </a>
  );
}
