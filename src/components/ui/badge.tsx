"use client"

/**
 * shadcn/ui badge (base-nova, Base UI) — Ollama 테마. shadcn CLI 로 설치한 원본이다.
 *
 * 해부도
 *   짧은 상태·수치 라벨
 *
 * 토큰
 *   rounded-full · text-xs font-medium · variant default/secondary/outline/destructive/ghost/link
 *
 * 상태
 *   정적 / 링크로 렌더 시 hover
 *
 * 키보드·ARIA
 *   장식이 아니면 텍스트로 읽힌다. 상태는 lozenge 가 감싼다
 *
 * 수용 기준
 *   - 한 줄을 넘지 않는다
 *   - 색·곡률·크기는 globals.css 의 shadcn 시맨틱 토큰에서만 나온다.
 */
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { type VariantProps } from "class-variance-authority"
import { badgeVariants } from "@/components/ui/badge-variants"
import { cn } from "@/lib/utils"

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
