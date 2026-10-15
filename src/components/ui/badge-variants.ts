import { cva } from "class-variance-authority";

/**
 * shadcn Badge 의 스타일 정의 — 서버에서도 부를 수 있도록 badge.tsx("use client")에서 분리했다.
 * 서버 컴포넌트에서 배지 클래스만 필요하면 여기서 가져온다(lozenge · count-badge · command-tag).
 */
export const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        outline:
          "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
        // 상태 표시 — design.md 적용 차이 3 의 상태 팔레트. 상호작용 신호로 쓰지 않는다.
        success: "bg-status-ok-soft text-status-ok",
        info: "bg-status-info-soft text-status-info",
        warning: "bg-status-warn-soft text-status-warn",
        danger: "bg-status-danger-soft text-status-danger",
        muted: "bg-muted text-charcoal",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);
