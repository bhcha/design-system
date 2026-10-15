import Link from "next/link"
import type { VariantProps } from "class-variance-authority"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * ButtonLink — 버튼처럼 보이는 **이동** (shadcn Button + next/link)
 *
 * 해부도
 *   shadcn `buttonVariants` 를 그대로 쓰는 <Link>. 시각이 Button 과 갈라질 수 없다.
 *
 * 토큰
 *   Button 과 같다(variant · size).
 *
 * 상태
 *   링크 / 비활성 — 비활성 링크는 표준이 없어 **비활성 shadcn Button** 을 렌더한다.
 *   aria-disabled + pointer-events-none 은 키보드 Enter 이동을 막지 못한다.
 *
 * 키보드·ARIA
 *   이동은 반드시 <a>(next/link). Cmd·중클릭·새 탭이 동작한다.
 *
 * 수용 기준
 *   - disabled 이면 링크가 아니라 disabled <button> 이다.
 */
export type ButtonLinkProps = React.ComponentProps<typeof Link> &
  VariantProps<typeof buttonVariants> & {
    disabled?: boolean
  }

export function ButtonLink({
  className,
  variant,
  size,
  disabled = false,
  children,
  ...props
}: ButtonLinkProps) {
  if (disabled) {
    return (
      <Button variant={variant} size={size} className={className} disabled>
        {children}
      </Button>
    )
  }
  return (
    <Link
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </Link>
  )
}
