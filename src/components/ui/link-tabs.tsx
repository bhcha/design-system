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
  className,
}: {
  items: readonly TabItem[]
  current: string
  label: string
  className?: string
}) {
  return (
    <div className={cn("overflow-x-auto border-b border-border", className)}>
      <nav
        aria-label={label}
        data-variant="line"
        className={cn(tabsListVariants({ variant: "line" }), "h-9 min-w-max p-0")}
      >
        {items.map((item) => {
          const selected = item.value === current
          return (
            <Link
              key={item.value}
              id={`tab-${item.value}`}
              href={item.href}
              aria-current={selected ? "page" : undefined}
              className={cn(
                "relative inline-flex h-9 items-center rounded-sm px-3 text-sm font-medium whitespace-nowrap",
                selected
                  ? "text-foreground after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:bg-foreground"
                  : "text-muted-foreground hover:text-foreground",
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
