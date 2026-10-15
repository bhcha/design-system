import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { NavItem } from "./global-nav";

/**
 * {component.sub-nav-frosted} — 스펙 시트 (앱 확장, design.md 밖)
 *
 * shadcn 기반
 *   인라인 링크는 shadcn `buttonVariants({ variant: "link" })` 를 입힌 next/link 다.
 *   포커스 링·전이를 Button 과 공유하고, 띠 안의 글자 링크 형태를 위해 크기 골격
 *   (h-auto border-0 px-0)과 밑줄을 덮는다 — 이 띠의 링크는 색·굵기로 현재 위치를 보인다.
 *
 * 해부도
 *   [ 카테고리명 ][ 인라인 링크 ... ][ 우측 고정 CTA ]
 *   global-nav 바로 아래에 붙어 스크롤에도 남는 반투명 유리 띠.
 *
 * 토큰
 *   높이 h-13(52px) · 배경 --color-muted 80% + backdrop-blur-frosted
 *   카테고리명 --text-2xl font-heading font-semibold · 링크 --text-base
 *   링크 기본 --color-charcoal · hover·현재 --color-primary
 *   구분선 --color-border 1px
 *
 * 반응형
 *   lg(850px) 미만: 인라인 링크를 숨기고 카테고리명 + CTA 만 남긴다.
 *
 * 상태
 *   링크 기본 / hover / focus-visible(Button 과 같은 ring) / 현재 위치(aria-current, font-medium)
 *
 * 키보드·ARIA
 *   - <nav aria-label> 로 전역 내비와 구분한다.
 *   - sticky 요소이므로 상단 오프셋은 global-nav 높이(56px, top-14)에 맞춘다.
 *
 * 수용 기준
 *   - 첫 안쪽 div 의 높이가 정확히 52px(선 포함), top 오프셋이 56px.
 *   - backdrop-filter 미지원 브라우저에서도 배경이 불투명하게 읽힌다
 *     (--color-muted 80% 위에 페이지 배경이 거의 같은 색이라 안전하다).
 */
export type SubNavProps = {
  /** 카테고리명. design.md 의 "iPhone / Store" 자리. */
  category: React.ReactNode;
  items?: readonly NavItem[];
  /** 우측 고정 CTA. */
  action?: React.ReactNode;
  label?: string;
  className?: string;
};

export function SubNav({
  category,
  items = [],
  action,
  label = "섹션",
  className,
}: SubNavProps) {
  return (
    <nav
      aria-label={label}
      className={cn(
        "sticky top-14 z-20",
        "bg-muted/80 backdrop-blur-frosted backdrop-saturate-180",
        className,
      )}
    >
      {/* 구분선은 **콘텐츠 락 밖**의 띠가 든다. 안쪽 max-w-app 상자에 걸면 1440px
          보다 넓은 화면에서 선이 가운데만 그어져 띠가 끊겨 보인다. 내용도 콘텐츠 락
          없이 전체 폭을 쓴다(작업 도구 계열 상단 띠). 띠가
          h-13 + border-b 를 함께 들고(box-sizing:border-box) 안쪽 행이 h-full 을
          차지하므로 선을 포함한 전체 높이는 52px 로 유지되고, 아래 sticky 열의
          오프셋 계산이 56 + 52 = 108px(top-27) 로 딱 떨어진다. */}
      <div className="h-13 w-full border-b border-border">
        <div className="flex h-full items-center gap-6 px-3">
          <span className="min-w-0 truncate text-2xl font-heading font-semibold text-foreground">
            {category}
          </span>

          {items.length > 0 ? (
            <ul className="hidden items-center gap-5 lg:flex">
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={item.current ? "page" : undefined}
                    className={cn(
                      buttonVariants({ variant: "link" }),
                      "h-auto border-0 px-0 text-base no-underline hover:text-primary",
                      item.current
                        ? "font-medium text-primary"
                        : "font-normal text-charcoal",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="ml-auto flex items-center gap-2">{action}</div>
        </div>
      </div>
    </nav>
  );
}
