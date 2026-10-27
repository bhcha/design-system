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
 *   테두리 없음, 글자 --text-base/500, 줄바꿈 없음, hover --color-accent
 *   (사이드바 면이 --color-muted 라 bg-muted hover 는 보이지 않는다).
 *   기본 --color-foreground · 선택 --color-selected + --color-primary + font-semibold
 *   비활성 --color-mute (포커스 대상 아님) · 부제 --text-xs + --color-charcoal
 *   그룹 라벨 --text-xs + font-semibold + --color-charcoal + uppercase
 *
 *   density="compact" — 문서·작업 도구용(이슈 #1). 기본값은 바꾸지 않는다.
 *     항목 --text-sm(14px/20px) · px-2 py-1.5 → 한 줄 32px (Sidebar 의 SidebarMenuButton 과 같은 높이)
 *     그룹 라벨 --text-xs(12px/16px) · 대문자 변환 없음
 *     rounded-md · 부제는 기본으로 그리지 않는다(showDescription 으로 켠다)
 *     hover --color-accent/60 · 선택 --color-accent + font-semibold + --color-foreground
 *     (선택 규칙이 Sidebar 의 data-active 와 같다 — 옅은 중립 면 + 굵기)
 *
 * 상태
 *   기본 / hover / 선택(aria-current="page") / 비활성 / focus-visible(Item 의 ring)
 *   선택은 배경색 + 글자 색 + weight 세 가지로 전달한다. 좌측 강조 바는 쓰지 않는다(이슈 #1).
 *   선택 항목은 hover 에도 선택 배경을 유지한다.
 *   compact 는 배경 + 굵기 두 가지로 전달한다(색 강조 없음). 색만으로 전달하지 않는다.
 *   current(aria-current)와 키보드 포커스(focus-visible ring)는 별개로 보인다.
 *
 * 키보드·ARIA
 *   이동이므로 항목은 <Link>. 비활성 항목은 <span aria-disabled>(포커스 대상에서 제거).
 *   그룹은 <nav aria-labelledby=그룹라벨id>. 아이콘은 aria-hidden.
 *
 * 수용 기준
 *   - 선택 항목에 aria-current="page" 가 하나만 붙는다.
 *   - 긴 라벨이 카운트를 밀어내지 않는다(min-w-0 + truncate).
 *   - compact 의 한 줄 항목은 32px, 메뉴 글자는 14px, 그룹 라벨은 12px 이다.
 *   - 화면은 색·곡률을 덮어쓰지 않고 density 로만 고른다.
 *
 * 무엇으로 만드나 — 내비게이션 사용 기준(카탈로그 "내비게이션 사용 기준")
 *   전역 상단 GlobalNav · 앱 좌측 탐색 SideNav(접기가 필요하면 Sidebar)
 *   프로젝트 수평 탭(주소가 바뀐다) LinkTabs · 상세 보기 탭(같은 화면 안 패널 전환) Tabs
 *   문서 읽기 화면은 DocsShell + DocsSideNav + DocsToc + DocsMobileMenu를 쓴다.
 *   SideNav의 compact는 작업 도구의 촘촘한 목록이며 문서 읽기 메뉴의 대체가 아니다.
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

export type SideNavDensity = "default" | "compact";

function ItemBody({ item, showDescription }: { item: SideNavItem; showDescription: boolean }) {
  return (
    <>
      {item.icon ? (
        <ItemMedia variant="icon" aria-hidden="true" className="size-4">
          {item.icon}
        </ItemMedia>
      ) : null}

      <ItemContent className="min-w-0">
        <span className="truncate">{item.label}</span>
        {showDescription && item.description ? (
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

/** density 별 모양. Item(size="xs") 위에 덮는 몫만 적는다.
    default — 선택은 진한 면 + 색 + 굵기.
    compact — 선택은 옅은 중립 면 + 굵기. 둘 다 좌측 강조 바는 없다. */
const ITEM_STYLE = {
  default: {
    base: "flex-nowrap gap-2 border-0 px-2 py-1.5 text-left text-base font-medium",
    disabled: "text-mute",
    current: "bg-selected font-semibold text-primary [a]:hover:bg-selected",
    idle: "text-foreground [a]:hover:bg-accent",
  },
  compact: {
    base: "flex-nowrap gap-2 rounded-md border-0 px-2 py-1.5 text-left text-sm font-normal",
    disabled: "text-mute",
    current: "bg-accent font-semibold text-foreground [a]:hover:bg-accent",
    idle: "text-foreground [a]:hover:bg-accent/60",
  },
} satisfies Record<SideNavDensity, Record<string, string>>;

const GROUP_LABEL_STYLE = {
  default: "px-2 pb-0.5 text-xs font-semibold text-charcoal uppercase",
  compact: "px-2 pb-0.5 text-xs font-semibold text-charcoal",
} satisfies Record<SideNavDensity, string>;

export function SideNav({
  groups,
  header,
  idPrefix = "",
  density = "default",
  showDescription = density === "default",
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
  /** 문서·작업 도구 화면은 "compact"(14px 한 줄, 옅은 선택 면). */
  density?: SideNavDensity;
  /** 부제를 그릴지. 기본값은 default 에서 true, compact 에서 false. */
  showDescription?: boolean;
  className?: string;
}) {
  const style = ITEM_STYLE[density];
  return (
    <div
      data-density={density}
      className={cn("flex flex-col", density === "compact" ? "gap-4" : "gap-5", className)}
    >
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
            className={GROUP_LABEL_STYLE[density]}
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
                    className={cn(style.base, style.disabled)}
                  >
                    <ItemBody item={item} showDescription={showDescription} />
                  </Item>
                ) : (
                  <Item
                    size="xs"
                    render={<Link href={item.href} />}
                    aria-current={item.current ? "page" : undefined}
                    className={cn(style.base, item.current ? style.current : style.idle)}
                  >
                    <ItemBody item={item} showDescription={showDescription} />
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
