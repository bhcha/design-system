import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * {component.link-inline} / {component.link-mute} — 스펙 시트
 *
 * shadcn 기반 — 자체 cva 유지
 *   shadcn `buttonVariants({ variant: "link" })` 위에 올리지 **않는다**. 그 변형은
 *   버튼 골격(inline-flex · h-9 · px-5 · whitespace-nowrap · text-sm · underline-offset-4)을
 *   함께 들고 와서, 문단 안 인라인 링크가 줄바꿈되지 않고 주변 글자 크기(16px)를 14px 로
 *   깎으며 줄높이를 36px 로 벌린다. design.md link-inline 은 "본문 글자 그대로 + 밑줄"이라
 *   그 골격을 전부 덮어야 하고, 덮은 결과는 이 cva 와 같다.
 *   대신 같은 cva 패턴·같은 export 형태(textLinkVariants)로 shadcn 규약을 따른다.
 *   이 앱에서 Button 계열 "링크처럼 보이는 버튼"이 필요하면 Button variant="link" 를 쓴다.
 *
 * 해부도
 *   인라인 텍스트 링크. 기본 장식이 밑줄이다(design.md: "Default decoration is underline").
 *
 * 토큰
 *   tone=inline → --color-foreground (+ 어두운 면 surface=dark 는 --color-on-dark)
 *   tone=mute   → --color-muted-foreground (colors.body, 흰 면 4.7:1) — FAQ 답·푸터의 보조 링크
 *   글자 크기는 주변 글자를 따른다(link-mute 의 body-sm 은 호출부가 text-sm 으로 준다)
 *   밑줄 오프셋 2px
 *
 * 상태
 *   기본(밑줄) / hover(밑줄 유지, 색 ink) / focus-visible(전역 outline)
 *
 * 키보드·ARIA
 *   이동은 반드시 <a>/<Link> 다. Cmd·중클릭이 살아 있어야 한다.
 *   외부 링크는 호출부에서 rel="noreferrer" 를 준다.
 *
 * 수용 기준
 *   - 밑줄이 기본으로 보인다 — 색만으로 링크를 구분하지 않는다.
 *   - href 가 없으면 컴파일되지 않는다.
 */
const textLinkVariants = cva("rounded-sm underline underline-offset-2", {
  variants: {
    surface: {
      light: "",
      dark: "",
    },
    tone: {
      inline: "",
      mute: "",
    },
  },
  compoundVariants: [
    { surface: "light", tone: "inline", class: "text-foreground" },
    { surface: "light", tone: "mute", class: "text-muted-foreground hover:text-foreground" },
    { surface: "dark", tone: "inline", class: "text-on-dark" },
    { surface: "dark", tone: "mute", class: "text-on-dark-mute hover:text-on-dark" },
  ],
  defaultVariants: { surface: "light", tone: "inline" },
});

export type TextLinkProps = React.ComponentProps<typeof Link> &
  VariantProps<typeof textLinkVariants>;

export function TextLink({ className, surface, tone, ...props }: TextLinkProps) {
  return (
    <Link className={cn(textLinkVariants({ surface, tone }), className)} {...props} />
  );
}

export { textLinkVariants };
