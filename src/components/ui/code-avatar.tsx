import { cva, type VariantProps } from "class-variance-authority"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

/**
 * CodeAvatar — 작업 공간·프로젝트 코드(PR · MS · WS)를 보여주는 마크 (shadcn Avatar 조립)
 *
 * 해부도
 *   <Avatar><AvatarFallback>코드</AvatarFallback></Avatar> — 이미지 없는 이니셜 아바타
 *
 * 토큰
 *   곡률 {rounded.full} · tone neutral = bg-muted text-charcoal · tone primary = bg-primary text-primary-foreground
 *   size sm 24px · md 32px · lg 40px · 글자 font-semibold uppercase
 *
 * 상태
 *   정적.
 *
 * 키보드·ARIA
 *   label 이 있으면 role="img" + aria-label, 없으면 장식(aria-hidden).
 *
 * 수용 기준
 *   - 코드가 길어도 원 밖으로 넘치지 않는다(truncate).
 */
const codeAvatarVariants = cva("font-semibold uppercase", {
  variants: {
    tone: {
      neutral: "bg-muted text-charcoal",
      primary: "bg-primary text-primary-foreground",
    },
    size: {
      sm: "text-xs",
      md: "text-xs",
      lg: "text-sm",
    },
  },
  defaultVariants: { tone: "neutral", size: "md" },
})

export type CodeAvatarProps = VariantProps<typeof codeAvatarVariants> & {
  initials: string
  label?: string
  className?: string
}

const SIZE = { sm: "sm", md: "default", lg: "lg" } as const

export function CodeAvatar({ initials, label, tone, size, className }: CodeAvatarProps) {
  return (
    <Avatar
      size={SIZE[size ?? "md"]}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={className}
    >
      <AvatarFallback className={cn(codeAvatarVariants({ tone, size }))}>
        <span className="truncate px-0.5">{initials}</span>
      </AvatarFallback>
    </Avatar>
  )
}
