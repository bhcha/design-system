import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * {component.button-icon-circular} — 스펙 시트
 *
 * 바탕 primitive (shadcn/ui base-nova)
 *   shadcn `Button`(Base UI Button — 네이티브 `<button>`) 의 아이콘 크기를 쓴다.
 *     default → size="icon-lg" (size-11 = 44 × 44)
 *     compact → size="icon-sm" (size-8  = 32 × 32)
 *   variant 는 "secondary" 를 바탕으로 두고, design.md 가 지정한 반투명 회색 면만 덮는다.
 *   테두리는 Button 원본의 1px 투명 테두리 + bg-clip-padding 이라 크기에 포함된다
 *   (box-sizing: border-box) — 바깥 치수가 정확히 44 / 32px 다.
 *
 * 해부도
 *   44 × 44 원형. 사진 위에 떠 있는 반투명 회색 칩 + 잉크색 아이콘.
 *   캐러셀 컨트롤, 닫기, 이미지 썸네일 조작에 쓴다.
 *
 * 토큰
 *   크기      size-11 (44px — design.md 최소 터치 타깃) / compact size-8
 *   배경      --color-hairline-strong 을 64% 알파로 (design.md 원문 지정) · hover 불투명
 *   곡률      --radius-full (Button)
 *   아이콘색  --color-foreground
 *   포커스    ring-3 --color-ring/50 (Button)
 *   비활성    --color-muted 배경 + --color-mute 아이콘 (Button)
 *
 * design.md 와의 관계
 *   design.md 에 아이콘 전용 버튼은 없다(앱 확장). 상호작용 요소는 전부
 *   {rounded.full} 이라는 원문 규칙에 따라 원형이다.
 *
 * 상태
 *   기본 / hover / active(scale 0.95) / focus-visible / disabled
 *
 * 키보드·ARIA
 *   아이콘만 있으므로 `aria-label` 을 **타입 수준에서 필수**로 강제한다.
 *   자식 아이콘은 호출부에서 `aria-hidden` 처리한다.
 *   type 기본값은 "button" 이다(폼 안에서 의도치 않게 제출하지 않는다).
 *
 * 수용 기준
 *   - aria-label 없이 컴파일되지 않는다.
 *   - 정확히 44 × 44px (compact 32 × 32px).
 */
export type IconButtonProps = Omit<
  React.ComponentProps<"button">,
  "children"
> & {
  /** 아이콘만 있는 버튼이므로 접근 가능한 이름이 반드시 필요하다. */
  "aria-label": string;
  children: React.ReactNode;
  /**
   * default — 44 × 44 (design.md 원문, 사진 위 컨트롤·최소 터치 타깃)
   * compact — 32 × 32 (데이터 툴바처럼 밀도가 필요한 자리)
   *
   * compact 는 44px 최소 터치 타깃보다 작으므로 **포인터 정밀 조작이 전제된 데스크톱
   * 툴바에서만** 쓴다. 흔한 28px 툴바 아이콘 버튼 자리를 4px 그리드에
   * 맞춰 32px 로 올렸다.
   */
  size?: "default" | "compact";
};

/** 아이콘 버튼의 겉 — 버튼과 링크가 같은 한 벌을 쓴다. */
const ICON_SKIN =
  "bg-hairline-strong/64 text-foreground hover:bg-hairline-strong transition-transform duration-100 active:scale-95";

export function IconButton({
  className,
  type = "button",
  size = "default",
  children,
  ...props
}: IconButtonProps) {
  return (
    <Button
      type={type}
      variant="secondary"
      size={size === "compact" ? "icon-sm" : "icon-lg"}
      className={cn(ICON_SKIN, className)}
      {...props}
    >
      {children}
    </Button>
  );
}

/**
 * IconButtonLink — 아이콘만 있는 **이동**. IconButton 과 같은 모양(반투명 회색 원 · press 축소)의 <Link>.
 * 닫기·뒤로가기처럼 주소를 바꾸는 아이콘 버튼에 쓴다. 접근 가능한 이름(aria-label)이 필수다.
 */
export type IconButtonLinkProps = Omit<
  React.ComponentProps<typeof Link>,
  "children"
> & {
  "aria-label": string;
  children: React.ReactNode;
  size?: "default" | "compact";
};

export function IconButtonLink({
  className,
  size = "default",
  children,
  ...props
}: IconButtonLinkProps) {
  return (
    <Link
      data-slot="button"
      className={cn(
        buttonVariants({
          variant: "secondary",
          size: size === "compact" ? "icon-sm" : "icon-lg",
        }),
        ICON_SKIN,
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
