import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * {component.product-tile-light} / -parchment / -dark / -dark-2 / -dark-3
 * — 스펙 시트
 *
 * 구현 — shadcn primitive 없이 네이티브 <section> 으로 둔다(의도)
 *   타일은 카드가 아니라 화면 끝까지 닿는 띠다(곡률 0 · 테두리 0 · 타일 사이 간격 0).
 *   shadcn Card 의 겉모습(곡률 · ring · 안쪽 여백 · overflow-hidden)을 전부 덮어야 해서
 *   Card 위에 올리면 얻는 것 없이 덮어쓰기만 늘어난다. 내부 CTA 는 호출부가 Button/ButtonLink
 *   (shadcn Button)로 넣는다.
 *
 * 해부도 (세로 중앙 정렬 스택)
 *   [ 제목 ]
 *   [ 한 줄 태그라인 ]
 *   [ CTA 두 개 ]
 *   [ 제품 이미지 슬롯 ]
 *
 * 토큰
 *   곡률   --radius-* 없음 (rounded-none) — 타일은 화면 끝까지 닿는다
 *   패딩   py-20(80px), 736px 미만에서 py-12(48px)
 *   제목   --text-4xl font-heading(40px/1.10) · font-semibold
 *   태그라인 --text-3xl font-heading(28px/1.14/+0.196px) · font-normal
 *   surface=light     --color-background
 *   surface=parchment --color-muted
 *   surface=dark      --color-surface-dark   (#171717)
 *   surface=dark-2    --color-surface-dark (#171717)
 *   surface=dark-3    --color-surface-dark (#171717)
 *
 * design.md 원칙
 *   타일 사이에 간격도 테두리도 없다. **표면 색 변화 자체가 구분선**이다.
 *   타일에도 이미지 슬롯에도 그림자가 없다 — 이 앱에는 그림자 토큰이 하나도 없다.
 *   design.md 의 {elevation.product-shadow} 는 실제 제품 이미지를 쓰는 화면이
 *   생길 때 globals.css 에 되살린다.
 *
 * 상태
 *   상태 없음(표시용 컨테이너). 내부 CTA 가 자기 상태를 가진다.
 *
 * 키보드·ARIA
 *   제목은 <h2> 고정이다 — 이 타일은 화면의 한 구획이지 문서 최상위가 아니다.
 *   <section> 에 랜드마크 이름이 필요하면 호출부가 `aria-label` 을 준다
 *   (props 는 그대로 <section> 으로 전달된다). 제목 id 를 만들지 않으므로
 *   aria-labelledby 로 자동 연결되지는 않는다.
 *
 * 수용 기준
 *   - 어두운 변형에서 본문이 --color-on-dark 다.
 *   - 곡률 0, 그림자 0.
 */
const productTileVariants = cva(
  "w-full rounded-none px-4 py-12 text-center md:py-20",
  {
    variants: {
      surface: {
        light: "bg-background text-foreground",
        parchment: "bg-muted text-foreground",
        dark: "bg-surface-dark text-on-dark",
        "dark-2": "bg-surface-dark text-on-dark",
        "dark-3": "bg-surface-dark text-on-dark",
      },
    },
    defaultVariants: { surface: "light" },
  },
);

export type ProductTileProps = React.ComponentProps<"section"> &
  VariantProps<typeof productTileVariants> & {
    title: React.ReactNode;
    tagline?: React.ReactNode;
    /** CTA 슬롯 — Button 두 개까지가 design.md 의 기본형이다. */
    actions?: React.ReactNode;
    /** 제품 이미지 슬롯. 그림자 없이 그대로 놓는다(시스템에 그림자 토큰이 없다). */
    children?: React.ReactNode;
  };

export function ProductTile({
  className,
  surface,
  title,
  tagline,
  actions,
  children,
  ...props
}: ProductTileProps) {
  return (
    <section
      className={cn(productTileVariants({ surface }), className)}
      {...props}
    >
      <div className="mx-auto flex max-w-reading flex-col items-center gap-4">
        <h2 className="text-4xl font-heading font-semibold">{title}</h2>

        {tagline ? <p className="text-3xl font-heading font-normal">{tagline}</p> : null}

        {actions ? (
          <div className="flex flex-wrap items-center justify-center gap-3">
            {actions}
          </div>
        ) : null}

        {children ? <div className="mt-6 w-full">{children}</div> : null}
      </div>
    </section>
  );
}

export { productTileVariants };
