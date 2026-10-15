"use client";

import { Fragment } from "react";
import Link from "next/link";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
} from "@/components/ui/item";
import { cn } from "@/lib/utils";
import { CountBadge } from "./count-badge";

/**
 * SideNav — 사이드바 내비게이션
 *
 * shadcn 기반
 *   항목 하나가 shadcn `Item`(size="xs") 이다. 이동 항목은 `render={<Link />}` 로
 *   <a> 를 렌더하고, 비활성 항목은 `render={<span />}` 로 포커스 대상에서 빠진다.
 *   아이콘은 `ItemMedia variant="icon"`, 라벨·부제는 `ItemContent`, 카운트는
 *   `ItemActions` 안의 CountBadge 다.
 *   Item 은 Base UI useRender(useRef 사용)라 서버 컴포넌트에서 렌더할 수 없다 —
 *   그래서 이 파일은 "use client" 다. props 는 전부 직렬화 가능한 값과 ReactNode 다.
 *
 * 근거: ADS 사이드 내비 해부도(그룹 라벨 → 항목 목록, 항목 = 아이콘 + 라벨 + 우측 카운트,
 * 선택은 강조 배경). 시각 값은 전부 design.md 토큰.
 *
 * 부제가 붙는 두 줄 메뉴(아이콘 + 제목 + 부제)는 별도 컴포넌트가 아니라 항목의
 * `description` 유무로 흡수했다 — 같은 역할을 두 번 만들지 않는다.
 *
 * 해부도
 *   [ 상단 슬롯 (작업 공간 전환기 등) ]
 *   [ 그룹 라벨 ]
 *     [ ItemMedia 아이콘 ][ ItemContent 라벨 (+ 부제) ][ ItemActions 카운트 ]
 *     ...
 *
 * 토큰
 *   항목 px-2 py-1.5 gap-2 — --text-base 줄높이 24px + 위아래 6px 로 한 줄 항목 36px
 *   (Button 기본 높이와 같다). 높이를 고정하지 않는 이유: 부제가 붙는 메뉴는
 *   두 줄이라 고정 높이면 글자가 잘린다. 패딩으로 만들면 두 줄은 자연히 늘어난다.
 *   Item 의 기본값(1px 사방 테두리 · text-sm · flex-wrap · hover bg-muted)은 덮는다:
 *   테두리는 좌측 2px 만, 글자 --text-base/500, 줄바꿈 없음, hover --color-accent
 *   (사이드바 면이 --color-muted 라 bg-muted hover 는 보이지 않는다).
 *   기본 --color-foreground · 선택 --color-selected + --color-primary + font-semibold
 *   비활성 --color-mute (포커스 대상 아님) · 부제 --text-xs + --color-charcoal
 *   그룹 라벨 --text-xs + font-semibold + --color-charcoal + uppercase
 *
 * 상태
 *   기본 / hover / 선택(aria-current="page") / 비활성 / focus-visible(Item 의 ring)
 *   선택은 배경색 + 글자 색 + weight + 좌측 2px 바 네 가지로 전달한다(작업 도구 계열 패턴).
 *   선택 항목은 hover 에도 선택 배경을 유지한다.
 *
 * 키보드·ARIA
 *   이동이므로 항목은 <Link>. 비활성 항목은 <span aria-disabled>(포커스 대상에서 제거).
 *   그룹은 <nav aria-labelledby=그룹라벨id>. 아이콘은 aria-hidden.
 *
 * 수용 기준
 *   - 선택 항목에 aria-current="page" 가 하나만 붙는다.
 *   - 긴 라벨이 카운트를 밀어내지 않는다(min-w-0 + truncate).
 */
export type SideNavItem = {
  label: string;
  href: string;
  /** 두 줄 항목의 부제. */
  description?: string;
  icon?: React.ReactNode;
  count?: number;
  current?: boolean;
  disabled?: boolean;
};

export type SideNavGroup = {
  /** aria-labelledby 대상이 되므로 고유해야 한다. */
  id: string;
  label: string;
  items: readonly SideNavItem[];
};

function ItemBody({ item }: { item: SideNavItem }) {
  return (
    <>
      {item.icon ? (
        <ItemMedia variant="icon" aria-hidden="true" className="size-4">
          {item.icon}
        </ItemMedia>
      ) : null}

      <ItemContent className="min-w-0">
        <span className="truncate">{item.label}</span>
        {item.description ? (
          <span className="truncate text-xs font-normal text-charcoal">
            {item.description}
          </span>
        ) : null}
      </ItemContent>

      {typeof item.count === "number" ? (
        <ItemActions>
          <CountBadge value={item.count} />
        </ItemActions>
      ) : null}
    </>
  );
}

/** 좌측 2px 바는 선택 표식이다(작업 도구 계열 패턴 — 선택 항목은 배경 + 좌측 바 + 색 셋 다).
    기본은 투명으로 자리만 지켜 선택이 바뀌어도 텍스트가 밀리지 않는다.
    Item(size="xs") 위에 덮는 몫만 적는다. */
const ITEM_BASE =
  "flex-nowrap gap-2 border-0 border-l-2 px-2 py-1.5 text-left text-base font-medium";

export function SideNav({
  groups,
  header,
  idPrefix = "",
  className,
}: {
  groups: readonly SideNavGroup[];
  /** 상단 슬롯 — 작업 공간 전환기 등. */
  header?: React.ReactNode;
  /**
   * 그룹 라벨 id 접두어. 같은 메뉴를 한 페이지에 두 번 그릴 때(좁은 폭 접이식 +
   * 데스크톱) aria-labelledby 가 가리키는 id 가 중복되지 않게 한다.
   */
  idPrefix?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-5", className)}>
      {/* 서버 화면이 넘긴 header 는 이 클라이언트 컴포넌트에서 그룹 목록과 형제로 그려진다.
          직렬화된 요소에는 key 검사 표시가 없어 React 가 key 경고를 내므로 자리에 고정 key 를 준다. */}
      <Fragment key="side-nav-header">{header}</Fragment>

      {groups.map((group) => (
        <nav
          key={group.id}
          aria-labelledby={`${idPrefix}${group.id}`}
          className="flex flex-col gap-1"
        >
          <p
            id={`${idPrefix}${group.id}`}
            className="px-2 pb-0.5 text-xs font-semibold text-charcoal uppercase"
          >
            {group.label}
          </p>

          <ul className="flex flex-col gap-0.5">
            {group.items.map((item) => (
              <li key={`${item.href}-${item.label}`}>
                {item.disabled ? (
                  <Item
                    size="xs"
                    render={<span />}
                    aria-disabled="true"
                    className={cn(ITEM_BASE, "border-l-transparent text-mute")}
                  >
                    <ItemBody item={item} />
                  </Item>
                ) : (
                  <Item
                    size="xs"
                    render={<Link href={item.href} />}
                    aria-current={item.current ? "page" : undefined}
                    className={cn(
                      ITEM_BASE,
                      item.current
                        ? "border-l-primary bg-selected font-semibold text-primary [a]:hover:bg-selected"
                        : "border-l-transparent text-foreground [a]:hover:bg-accent",
                    )}
                  >
                    <ItemBody item={item} />
                  </Item>
                )}
              </li>
            ))}
          </ul>
        </nav>
      ))}
    </div>
  );
}
