"use client"

/**
 * shadcn/ui switch (base-nova, Base UI) — Ollama 테마. shadcn CLI 로 설치한 원본이다.
 *
 * 해부도
 *   [ 트랙(pill) [썸(원)] ] — 켜면 썸이 오른쪽으로 간다
 *
 * 토큰
 *   트랙 rounded-full · 켜짐 bg-primary · 꺼짐 bg-hairline-strong · 썸 bg-background
 *   size default 20×36px(h-5 w-9) · sm 16×28px(h-4 w-7) — 간격 토큰만 쓴다
 *   포커스 ring-2 ring-ring(불투명, 적용 차이 2) · 그림자 없음
 *
 * 상태
 *   꺼짐 / 켜짐 / focus-visible / aria-invalid / disabled(트랙 bg-muted · 썸 bg-mute — opacity 아님)
 *
 * 키보드·ARIA
 *   Base UI Switch — role="switch" · aria-checked · Space 로 전환.
 *   Root 가 span 이라 `Label htmlFor` 로 이름이 붙지 않는다 → aria-label 또는
 *   aria-labelledby(라벨 텍스트의 id)로 이름을 준다.
 *
 * 수용 기준
 *   - 트랙·썸 모두 곡률 9999px.
 *   - 비활성은 opacity 가 아니라 토큰(bg-muted · bg-mute)이다.
 *   - 색·곡률·크기는 globals.css 의 shadcn 시맨틱 토큰에서만 나온다.
 */
import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import { cn } from "@/lib/utils"

function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-full p-0.5 transition-colors outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:ring-2 focus-visible:ring-ring aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-[size=default]:h-5 data-[size=default]:w-9 data-[size=sm]:h-4 data-[size=sm]:w-7 data-checked:bg-primary data-unchecked:bg-hairline-strong data-disabled:cursor-not-allowed data-disabled:bg-muted data-disabled:ring-1 data-disabled:ring-border",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block rounded-full bg-background transition-transform group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 group-data-[size=default]/switch:data-checked:translate-x-4 group-data-[size=sm]/switch:data-checked:translate-x-3 data-unchecked:translate-x-0 group-data-disabled/switch:bg-mute"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
