import { TextLink } from "@/components/ui/text-link";
import { cn } from "@/lib/utils";

/**
 * {component.footer-section} — 스펙 시트
 *
 * shadcn 기반
 *   footer 자체에 대응하는 shadcn 프리미티브는 없다. 링크는 TextLink tone="mute"
 *   ({component.link-mute}) 한 벌을 쓴다 — 푸터가 링크 색·밑줄을 따로 적지 않는다.
 *   고지 행 위 구분선은 1px border-t 로 둔다(shadcn Separator 는 클라이언트 프리미티브라
 *   서버 컴포넌트인 푸터에 장식선 하나를 위해 경계를 만들지 않는다).
 *
 * 해부도 — 두 형태
 *   full (columns 있음)          notice (columns 없음)
 *   [ 컬럼 1 ][ 2 ][ 3 ][ ... ]   [ 고지 한 줄 ]
 *   ────────────────────────
 *   [ 고지 행 ]
 *
 * 토큰 — design.md {component.footer-section}
 *   배경 --color-background(canvas) · 상단 1px --color-border(hairline)
 *   padding 32px 24px(py-8 px-6) · 고지 {typography.caption-sm} 12px
 *   컬럼 제목 --text-sm + font-medium + --color-foreground
 *   링크 {component.link-mute} — --text-sm + --color-muted-foreground
 *   고지 색 --color-muted-foreground — design.md 는 footer 를 {colors.body} 로 규정한다.
 *
 * 상태
 *   full / notice · 링크 기본 / hover / focus-visible
 *
 * 키보드·ARIA
 *   <footer> 랜드마크. 컬럼 제목과 링크 목록을 <nav aria-labelledby> 로 묶는다.
 *
 * 수용 기준
 *   - 링크가 전부 <Link>(TextLink tone="mute") 다(중클릭·Cmd 클릭 동작).
 *   - 컬럼이 좁은 폭에서 1열로 접힌다.
 *   - 배경이 canvas 이고 위쪽에 hairline 이 하나 있다.
 */
export type FooterColumn = {
  /** 컬럼 제목. aria-labelledby 의 대상이 되므로 고유해야 한다. */
  id: string;
  title: string;
  links: readonly { label: string; href: string }[];
};

export type SiteFooterProps = React.ComponentProps<"footer"> & {
  /**
   * 링크 컬럼. 비우면 고지 한 줄만 남는 **notice 형**이 된다 —
   * 작업 도구형 화면의 하단 고지가 이 형태다.
   */
  columns?: readonly FooterColumn[];
  /** 하단 법적 고지 행. */
  legal?: React.ReactNode;
};

export function SiteFooter({
  className,
  columns = [],
  legal,
  ...props
}: SiteFooterProps) {
  const notice = columns.length === 0;
  return (
    <footer
      className={cn(
        "border-t border-border bg-background px-6 py-8 text-muted-foreground",
        className,
      )}
      {...props}
    >
      <div className="mx-auto max-w-app">
        {notice ? null : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {columns.map((column) => (
            <nav key={column.id} aria-labelledby={column.id}>
              <h2
                id={column.id}
                className="text-sm font-medium text-foreground"
              >
                {column.title}
              </h2>
              <ul className="mt-2 flex flex-col gap-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <TextLink href={link.href} tone="mute" className="text-sm">
                      {link.label}
                    </TextLink>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        )}

        {legal ? (
          <p
            className={cn(
              "text-xs text-muted-foreground",
              notice ? undefined : "mt-8 border-t border-border pt-6",
            )}
          >
            {legal}
          </p>
        ) : null}
      </div>
    </footer>
  );
}
