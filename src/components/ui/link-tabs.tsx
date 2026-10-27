import Link from "next/link"
import { tabsListVariants } from "@/components/ui/tabs-variants"
import { cn } from "@/lib/utils"

/**
 * LinkTabs · TabPanel — 주소(?tab=)로 상태를 갖는 라인 탭 (shadcn tabs 라인 변형)
 *
 * 해부도
 *   <nav aria-label>[ 탭 링크 ][ 탭 링크 ] ... </nav>   — shadcn TabsList variant="line" 모양
 *   ─────────────────────────────── (1px hairline)
 *   <TabPanel role="tabpanel"> 콘텐츠
 *
 * 왜 Base UI Tabs 상태가 아니라 링크인가
 *   탭·보기 상태는 URL 에 반영해 새로고침·딥링크에서 살아남아야 한다.
 *   선택 상태의 출처가 주소이므로 탭은 이동(<a>)이고 현재 탭은 aria-current="page".
 *   모양은 shadcn `tabsListVariants({ variant: "line" })` 를 그대로 쓴다.
 *
 * 토큰
 *   라벨 text-sm font-medium · 비선택 text-muted-foreground → hover text-foreground
 *   선택 text-foreground + 하단 2px 언더라인(bg-foreground)
 *   variant="docs" — h-12 카테고리 행 · gap-5 · max-w-app · 상단바(h-15) 아래 sticky.
 *   밑줄은 텍스트 너비, 배경은 background, 색·서체는 기존 토큰을 공유한다.
 *
 * 상태
 *   선택 / 비선택 / hover / focus-visible
 *
 * 키보드·ARIA
 *   링크라 Tab 으로 이동, Enter 로 선택. 패널은 aria-labelledby 로 탭과 묶인다.
 *
 * 수용 기준
 *   - 새로고침해도 선택이 유지된다(주소가 선택 상태의 출처).
 *   - 좁은 폭에서 탭 행이 가로 스크롤한다.
 *   - docs는 상단 카테고리를 스크롤 중에도 유지하며 왼쪽 문서 목록과 역할을 나눈다.
 */
export type TabItem = {
  value: string
  label: React.ReactNode
  href: string
}

export function LinkTabs({
  items,
  current,
  label,
  variant = "default",
  className,
}: {
  items: readonly TabItem[]
  current: string
  label: string
  variant?: "default" | "docs"
  className?: string
}) {
  return (
    <div className={cn("overflow-x-auto border-b border-border", variant === "docs" && "sticky top-15 z-20 bg-background", className)}>
      <nav
        aria-label={label}
        data-variant="line"
        className={cn(
          tabsListVariants({ variant: "line" }),
          "min-w-max p-0",
          variant === "docs" ? "mx-auto flex h-12 w-full max-w-app justify-start gap-5 px-4.5 sm:px-6" : "h-9",
        )}
      >
        {items.map((item) => {
          const selected = item.value === current
          return (
            <Link
              key={item.value}
              id={variant === "default" ? `tab-${item.value}` : undefined}
              href={item.href}
              aria-current={selected ? "page" : undefined}
              className={cn(
                "relative inline-flex items-center text-sm font-medium whitespace-nowrap",
                variant === "docs" ? "h-12 px-0 focus-visible:-outline-offset-2" : "h-9 rounded-sm px-3",
                selected
                  ? "text-foreground after:absolute after:bottom-0 after:h-0.5 after:bg-primary"
                  : "text-muted-foreground hover:text-foreground",
                selected && (variant === "docs" ? "after:inset-x-0" : "after:inset-x-2"),
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export function TabPanel({
  value,
  children,
  className,
}: {
  value: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div role="tabpanel" aria-labelledby={`tab-${value}`} className={cn("pt-4", className)}>
      {children}
    </div>
  )
}
