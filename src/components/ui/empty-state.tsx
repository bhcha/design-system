import { cva, type VariantProps } from "class-variance-authority";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { cn } from "@/lib/utils";

/**
 * EmptyState — 빈 상태 · 오류 상태 · 목록 각주
 *
 * 기반 primitive: shadcn Empty (Empty · EmptyHeader · EmptyTitle · EmptyDescription ·
 *   EmptyContent). shadcn 기본은 가운데 정렬 큰 빈 화면이지만, 이 앱의 빈 상태는 목록·
 *   영역 자리에 들어가는 **왼쪽 정렬 패널**이라 정렬·여백·곡률만 덮어쓴다.
 *   빈 결과·빈 영역·각주·오류 안내처럼 같은 역할의 변형을 하나로 합치고 `tone` 으로 구분했다.
 *
 * 해부도
 *   panel : ┌ Empty
 *           │  EmptyHeader [EmptyTitle] [EmptyDescription]
 *           └  EmptyContent [액션]
 *           — 목록·영역이 통째로 비었을 때
 *   note  : [EmptyDescription 한 줄] — 목록 아래 각주, 액자 없음
 *
 * 토큰
 *   panel 배경 --color-muted · 테두리 점선 --color-border · 곡률 --radius-lg · p-4 · gap-2
 *   error 테두리 --color-status-danger · 배경 --color-status-danger-soft
 *         제목 --color-status-danger
 *   제목 --text-base + font-semibold · 설명 --text-base + --color-charcoal
 *   note  --text-xs + --color-charcoal
 *
 * 상태
 *   상태 없음. `tone` 으로 성격만 바뀐다(neutral · error · note).
 *
 * 키보드·ARIA
 *   검색 결과처럼 **동적으로 나타나는** 빈 상태는 호출부에서 `aria-live="polite"` 를 준다
 *   (panel 톤은 나머지 div 속성을 Empty 루트에 그대로 넘긴다).
 *   처음부터 비어 있는 영역에는 live region 을 붙이지 않는다(불필요한 낭독 방지).
 *
 * 수용 기준
 *   - 액션 없이도 성립한다.
 *   - note 톤은 액자·배경 없이 텍스트만 남는다.
 *   - 패널은 왼쪽 정렬이다(shadcn 기본 가운데 정렬을 쓰지 않는다).
 */
const emptyStateVariants = cva("", {
  variants: {
    tone: {
      neutral:
        "w-auto flex-none items-start justify-start gap-2 rounded-lg border border-dashed border-border bg-muted p-4 text-left text-wrap",
      error:
        "w-auto flex-none items-start justify-start gap-2 rounded-lg border border-solid border-status-danger bg-status-danger-soft p-4 text-left text-wrap",
      note: "text-xs text-charcoal",
    },
  },
  defaultVariants: { tone: "neutral" },
});

export type EmptyStateProps = React.ComponentProps<"div"> &
  VariantProps<typeof emptyStateVariants> & {
    title?: React.ReactNode;
    description: React.ReactNode;
    action?: React.ReactNode;
  };

export function EmptyState({
  className,
  tone,
  title,
  description,
  action,
  ...props
}: EmptyStateProps) {
  if (tone === "note") {
    return (
      <EmptyDescription className={cn(emptyStateVariants({ tone }), className)}>
        {description}
      </EmptyDescription>
    );
  }

  return (
    <Empty className={cn(emptyStateVariants({ tone }), className)} {...props}>
      <EmptyHeader className="max-w-none items-start gap-2">
        {title ? (
          <EmptyTitle
            className={cn(
              "text-base font-semibold",
              tone === "error" ? "text-status-danger" : "text-foreground",
            )}
          >
            {title}
          </EmptyTitle>
        ) : null}
        <EmptyDescription className="text-base text-charcoal">
          {description}
        </EmptyDescription>
      </EmptyHeader>
      {action ? (
        <EmptyContent className="max-w-none items-start pt-1 text-base text-wrap">
          {action}
        </EmptyContent>
      ) : null}
    </Empty>
  );
}

export { emptyStateVariants };
