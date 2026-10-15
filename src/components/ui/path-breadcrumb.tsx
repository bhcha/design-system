import { Fragment } from "react"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { cn } from "@/lib/utils"

/**
 * PathBreadcrumb — 항목 배열과 관계 라벨을 받는 탐색 경로 (shadcn Breadcrumb 조립)
 *
 * 해부도
 *   항목 · 구분자(/ + 관계 라벨) · 항목 · 현재 항목(BreadcrumbPage)
 *   구분자는 shadcn 규칙대로 항목의 **형제** <li role="presentation"> 다(항목 안에 넣으면 li 중첩).
 *
 * 토큰
 *   글자 text-xs · 링크 text-charcoal → hover text-foreground · 현재 text-foreground font-medium
 *   관계 라벨 bg-muted rounded-sm(6px) · 어두운 면: on-dark · on-dark-mute · bg-surface-dark
 *
 * 상태
 *   링크 / 현재 위치(aria-current="page") / 어두운 면
 *
 * 키보드·ARIA
 *   <nav aria-label> + <ol>. 이동은 next/link. 구분자·관계 라벨은 장식(aria-hidden).
 *
 * 수용 기준
 *   - 마지막 항목은 링크가 아니다.
 *   - 넘치면 줄바꿈 대신 가로 스크롤한다.
 */
export type PathItem = {
  label: string
  href?: string
  relation?: string
}

export type PathBreadcrumbProps = {
  items: readonly PathItem[]
  label?: string
  surface?: "light" | "dark"
  className?: string
}

export function PathBreadcrumb({
  items,
  label = "탐색 경로",
  surface = "light",
  className,
}: PathBreadcrumbProps) {
  const dark = surface === "dark"
  return (
    <Breadcrumb aria-label={label} className={cn("min-w-0", className)}>
      <BreadcrumbList className="flex-nowrap gap-2 overflow-x-auto text-xs whitespace-nowrap sm:gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <Fragment key={`${item.label}-${index}`}>
              {index > 0 ? (
                <BreadcrumbSeparator
                  className={cn(
                    "flex items-center gap-2",
                    dark ? "text-on-dark-mute" : "text-charcoal",
                  )}
                >
                  <span>/</span>
                  {item.relation ? (
                    <span
                      className={cn(
                        "rounded-sm px-1.5 py-0.5",
                        dark ? "bg-surface-dark" : "bg-muted",
                      )}
                    >
                      {item.relation}
                    </span>
                  ) : null}
                </BreadcrumbSeparator>
              ) : null}
              <BreadcrumbItem>
                {item.href && !isLast ? (
                  <BreadcrumbLink
                    render={<Link href={item.href} />}
                    className={cn(
                      "rounded-sm underline-offset-2 hover:underline",
                      dark
                        ? "text-on-dark-mute hover:text-on-dark"
                        : "text-charcoal hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </BreadcrumbLink>
                ) : isLast ? (
                  // shadcn BreadcrumbPage — role="link" aria-disabled aria-current="page"(원본 설계).
                  <BreadcrumbPage
                    className={cn("font-medium", dark ? "text-on-dark" : "text-foreground")}
                  >
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <span className={dark ? "text-on-dark-mute" : "text-charcoal"}>{item.label}</span>
                )}
              </BreadcrumbItem>
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
