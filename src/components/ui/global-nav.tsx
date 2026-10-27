import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * {component.primary-nav} — 스펙 시트
 *
 * shadcn 기반
 *   링크는 shadcn `buttonVariants({ variant: "link" })` 를 입힌 next/link 다.
 *   포커스 링·글자 크기(14px/500)·전이를 Button 과 공유하고, 텍스트 링크 형태를 위해
 *   크기 골격만 덮는다(h-auto border-0 px-0 — 띠 안의 링크는 pill 이 아니라 글자다).
 *   좁은 폭 트레이는 Collapsible 이 아니라 네이티브 <details>/<summary> 로 **남긴다** —
 *   JS 없이 동작하고 서버 컴포넌트로 남아야 하기 때문이다(Collapsible 은 클라이언트).
 *
 * 해부도
 *   [ 브랜드 ][ 링크 행 ......................... ][ 액션 클러스터 ]
 *   높이 56px. 콘텐츠 락 없이 화면 전체 폭을 쓰고 좌우 여백은 24px 이다.
 *   layout="docs"는 60px 상단바 + 최대 1440px 안쪽 행이다(적용 차이 10).
 *
 * 토큰 — design.md {component.primary-nav}
 *   높이 h-14(56px) · 링크 {typography.body-sm-strong} 14px/500 · 링크 간격 gap-6(24px)
 *   tone="light" (기본) — 배경 --color-background(canvas) · 하단 1px --color-border · 텍스트 --color-foreground
 *   tone="dark"        — 배경 --color-nav · 텍스트 --color-on-dark
 *                        (design.md 밖 — 어두운 면 위 크롬이 필요할 때만)
 *   접이식 트레이의 구분선: light 는 --color-border, dark 는 --color-on-dark-border.
 *   docs 배치는 h-15 · max-w-app · px-4.5 sm:px-6이며 색·서체는 공유한다.
 *
 * 반응형 (design.md Collapsing Strategy)
 *   ≥ 850px(lg): 링크 행 전개.
 *   < 850px    : 링크 행을 접고 디스클로저로 내린다. 브랜드와 액션은 남는다.
 *
 * 상태
 *   링크 기본(밑줄 없음) / hover(밑줄) / focus-visible(Button 과 같은 ring) /
 *   현재 위치(aria-current="page", 밑줄 고정 — 색 하나에 기대지 않는다)
 *
 * 키보드·ARIA
 *   - <nav aria-label> 로 랜드마크를 구분한다.
 *   - 이동은 전부 <Link>. 현재 항목은 aria-current="page".
 *   - <summary> 는 기본으로 포커스를 받고 Enter/Space 로 열린다.
 *
 * 수용 기준
 *   - 첫 안쪽 div 의 높이가 정확히 56px(선 포함).
 *   - 링크가 14px/500 · ink 다.
 *   - 링크 행이 850px 미만에서 사라지고 디스클로저가 나타난다.
 *   - docs 배치는 60px 높이이며 넓은 화면에서 문서 셸과 중앙 정렬된다.
 */
export type NavItem = {
  label: string;
  href: string;
  /** 현재 위치면 aria-current="page" 가 붙는다. */
  current?: boolean;
};

export type GlobalNavProps = {
  /** 왼쪽 브랜드 자리 — 텍스트나 로고 마크. */
  brand: React.ReactNode;
  items?: readonly NavItem[];
  /**
   * 브랜드 오른쪽 경로 슬롯. 작업 도구형 상단바는 여기에 브레드크럼을 둔다.
   * 링크 행과 함께 쓰지 않는다 — 둘 다 있으면 상단바가 읽기 어려워진다.
   */
  breadcrumb?: React.ReactNode;
  /** 오른쪽 액션 클러스터(검색·계정 등). */
  actions?: React.ReactNode;
  /** 랜드마크 이름. 한 페이지에 nav 가 여럿이므로 항상 구분한다. */
  label?: string;
  /** 놓이는 면. 기본은 밝은 면(작업 도구), design.md 원문은 dark. */
  tone?: "light" | "dark";
  /** 문서 셸은 60px 상단바와 1440px 콘텐츠 락을 쓴다. */
  layout?: "app" | "docs";
  className?: string;
};

function NavLinks({
  items,
  dark,
  className,
}: {
  items: readonly NavItem[];
  dark: boolean;
  className?: string;
}) {
  return (
    <ul className={cn("flex items-center gap-6", className)}>
      {items.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            aria-current={item.current ? "page" : undefined}
            className={cn(
              buttonVariants({ variant: "link" }),
              "h-auto border-0 px-0 no-underline hover:underline",
              dark ? "text-on-dark" : "text-foreground",
              item.current ? "underline" : undefined,
            )}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function GlobalNav({
  brand,
  items = [],
  breadcrumb,
  actions,
  label = "전역",
  tone = "light",
  layout = "app",
  className,
}: GlobalNavProps) {
  const dark = tone === "dark";
  return (
    <nav
      aria-label={label}
      className={cn(
        "sticky top-0 z-30",
        dark ? "bg-nav text-on-dark" : "bg-background text-foreground",
        className,
      )}
    >
      {/* 기본 작업 도구의 상단바는 콘텐츠 락 없이 **화면 전체 폭**을 쓴다(작업 도구 계열).
          max-w-app 으로 가운데 정렬하면 넓은 화면에서 좌우 여백이 수백 px 씩 생겨
          브랜드·경로가 화면 모서리에서 떨어져 보인다. 여백은 px-6(24px)이다.
          띠가 h-14 + border-b 를 함께 들고(box-sizing:border-box) 안쪽 행이 h-full 을
          차지하므로, 선을 포함한 전체 높이는 정확히 56px — 아래 sticky 열의 오프셋이
          여기에 결박돼 있다. */}
      <div
        className={cn(
          "w-full",
          layout === "docs" ? "h-15" : "h-14",
          dark ? undefined : "border-b border-border",
        )}
      >
        <div className={cn("flex h-full items-center gap-6", layout === "docs" ? "mx-auto max-w-app px-4.5 sm:px-6" : "px-6")}>
          <span className="shrink-0 text-sm font-semibold">{brand}</span>

          {breadcrumb ? (
            <div className="min-w-0 flex-1">{breadcrumb}</div>
          ) : null}

          {items.length > 0 ? (
            <NavLinks items={items} dark={dark} className="hidden lg:flex" />
          ) : null}

          <div className="ml-auto flex shrink-0 items-center gap-2">
            {actions}
          </div>
        </div>
      </div>

      {/* 850px 미만 — 접히는 링크 트레이 */}
      {items.length > 0 ? (
        <details
          className={cn(
            "group border-t lg:hidden",
            dark ? "border-on-dark-border" : "border-border",
          )}
        >
          <summary
            className={cn(
              "flex h-9 cursor-pointer items-center px-6 text-sm font-medium select-none",
              dark ? "text-on-dark-mute" : "text-charcoal",
            )}
          >
            메뉴
          </summary>
          <NavLinks
            items={items}
            dark={dark}
            className="flex-wrap gap-x-6 gap-y-4 px-6 pb-4"
          />
        </details>
      ) : null}
    </nav>
  );
}
