import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * shadcn/ui Button (base-nova) — Ollama 테마 적용본
 *
 * 해부도
 *   [ 아이콘(data-icon="inline-start") ][ 라벨 ][ 아이콘(inline-end) ]
 *
 * 토큰 — design.md
 *   {component.button-primary}        → variant="default"  bg-primary · text-primary-foreground
 *   {component.button-primary-active} → :active            bg-primary-active(#090909)
 *   {component.button-secondary}      → variant="outline"  bg-background · 1px hairline-strong
 *   {component.button-pill-on-dark}   → variant="on-dark"  어두운 면 위의 흰 pill
 *   {component.button-disabled}       → disabled           bg-muted · text-mute
 *   곡률 {rounded.full} · 라벨 {typography.button-md} 14px/500
 *   size default 36px(px-5) · sm 32px(px-4, 작업 화면 compact — 적용 차이 5) · lg 40px
 *
 * 상태
 *   기본 / hover / active / focus-visible(ring 3px, ring/50 = design.md focus-ring) / disabled
 *
 * 키보드·ARIA
 *   Base UI Button. 링크로 렌더하려면 `render={<Link href />}` + `nativeButton={false}`
 *   (button-link.tsx 의 ButtonLink 가 감싼다). 아이콘만 있으면 aria-label 필수.
 *
 * 수용 기준
 *   - 기본 높이 36px · 곡률 9999px · 14px/500.
 *   - 비활성은 opacity 가 아니라 토큰(bg-muted · text-mute)이다.
 */
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-full border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:border-transparent disabled:bg-muted disabled:text-mute aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground active:bg-primary-active data-pressed:bg-primary-active",
        outline:
          "border-hairline-strong bg-background text-foreground hover:bg-muted active:bg-accent aria-expanded:bg-muted",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-accent aria-expanded:bg-accent",
        ghost: "text-foreground hover:bg-muted aria-expanded:bg-muted",
        destructive:
          "bg-status-danger-soft text-destructive hover:bg-status-danger-soft/80",
        link: "text-foreground underline underline-offset-4",
        "on-dark": "bg-background text-foreground hover:bg-muted active:bg-accent",
      },
      size: {
        default:
          "h-9 gap-2 px-5 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        xs: "h-6 gap-1 px-3 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        lg: "h-10 gap-2 px-6",
        icon: "size-9",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
