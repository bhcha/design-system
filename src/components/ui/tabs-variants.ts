import { cva } from "class-variance-authority"

/**
 * shadcn Tabs 의 목록 스타일 — 서버에서도 부를 수 있도록 tabs.tsx("use client")에서 분리했다.
 * 주소 기반 탭(link-tabs)이 서버 컴포넌트에서 이 클래스를 쓴다.
 */
export const tabsListVariants = cva(
  "group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-horizontal/tabs:h-8 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col data-[variant=line]:rounded-none",
  {
    variants: {
      variant: {
        default: "bg-muted",
        line: "gap-1 bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)
