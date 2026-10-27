"use client";

import { useEffect, useRef, type ComponentProps } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * DocsSideNav · DocsToc — 문서의 좌측 탐색과 우측 본문 목차 (design.md 적용 차이 10)
 *
 * 해부도
 *   좌측: 카테고리 제목 → 접이식 그룹 → 세로 안내선 + 문서 링크.
 *   우측: 목차 제목 → H2 앵커 링크. 카테고리 전환은 상단 LinkTabs가 맡는다.
 *
 * 토큰
 *   좌측 text-sm · px-6 py-6 · 그룹 간 gap-3 · 들여쓰기 ml-2 pl-2.5.
 *   문서 선택은 foreground + semibold, 기본은 muted-foreground, 안내선은 border.
 *   우측 text-xs · px-4 py-6 · 현재 절은 border-primary. 색·면·곡률을 새로 만들지 않는다.
 *   영역의 폭·고정·스크롤은 DocsShell 또는 DocsMobileMenu가 맡는다.
 *
 * 상태
 *   기본 / hover(밑줄 또는 목차 세로선) / 현재 문서·절 / 그룹 펼침·접힘 / focus-visible.
 *   그룹은 처음에 펼친다(defaultOpen=false로 접을 수 있다). 현재 문서의 그룹은 항상 처음에 펼친다.
 *   검색·이전/다음으로 이동한 현재 문서의 그룹도 다시 펼친다.
 *
 * 키보드·ARIA
 *   native details/summary는 Enter·Space로 접는다. 모달 안에서도 Space가 작동하도록
 *   Space는 스크롤 기본 동작을 막고 summary.click()으로 처리한다. 링크는 Tab·Enter로 이동한다.
 *   문서에 aria-current="page", 본문 절에 aria-current="location"을 준다.
 *   nav는 고유한 aria-label을 받으며 장식 아이콘은 aria-hidden이다.
 *
 * 수용 기준
 *   현재 문서가 속한 그룹은 이동 후 보인다. 접힌 그룹의 링크는 Tab 순서에서 빠진다.
 *   선택 문서에 둥근 배경을 쓰지 않는다. 본문 목차에는 카테고리·문서 목록을 섞지 않는다.
 *   긴 제목은 줄바꿈한다. 내비게이션 자체에 화면 높이를 결박하지 않는다.
 */
export type DocsNavItem = {
  label: string;
  href: string;
  current?: boolean;
};

export type DocsNavGroup = {
  id: string;
  label: string;
  defaultOpen?: boolean;
  items: readonly DocsNavItem[];
};

export function DocsSideNav({
  title,
  groups,
  label = "문서 목록",
  className,
}: {
  title: string;
  groups: readonly DocsNavGroup[];
  label?: string;
  className?: string;
}) {
  const navRef = useRef<HTMLElement>(null);
  const currentHref = groups.flatMap((group) => group.items).find((item) => item.current)?.href;

  useEffect(() => {
    const group = navRef.current?.querySelector('a[aria-current="page"]')?.closest("details");
    if (group) group.open = true;
  }, [currentHref]);

  return (
    <nav ref={navRef} data-slot="docs-side-nav" aria-label={label} className={cn("flex flex-col gap-3 px-6 py-6", className)}>
      <p className="mb-1 text-sm font-semibold text-foreground">{title}</p>
      {groups.map((group) => (
        <details key={group.id} open={group.defaultOpen !== false || group.items.some((item) => item.current)} className="group/docs-nav">
          <summary
            className="flex cursor-pointer list-none items-center justify-between gap-3 px-1 py-2 text-sm font-semibold text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden"
            onKeyDown={(event) => {
              if (event.key === " ") {
                event.preventDefault();
                if (!event.repeat) event.currentTarget.click();
              }
            }}
          >
            {group.label}
            <ChevronRight className="size-3 shrink-0 group-open/docs-nav:rotate-90" aria-hidden="true" />
          </summary>
          <ul className="mt-1.5 mb-1.5 ml-2 border-l border-border pl-2.5">
            {group.items.map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={item.current ? "page" : undefined} className={cn(
                  "block px-2 py-2 text-sm break-words underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  item.current ? "font-semibold text-foreground" : "font-normal text-muted-foreground",
                )}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </details>
      ))}
    </nav>
  );
}

export function DocsToc({
  items,
  title = "이 페이지에서",
  label = "이 페이지의 목차",
  className,
  ...props
}: {
  items: readonly DocsNavItem[];
  title?: string;
  label?: string;
} & Omit<ComponentProps<"nav">, "children">) {
  return (
    <nav data-slot="docs-toc" aria-label={label} className={cn("px-4 py-6", className)} {...props}>
      <p className="mb-3 text-xs font-semibold text-foreground">{title}</p>
      <ul>
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} aria-current={item.current ? "location" : undefined} className={cn(
              "block border-l-2 py-1 pl-3 text-xs font-medium break-words hover:border-primary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              item.current ? "border-primary text-foreground" : "border-transparent text-muted-foreground",
            )}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
