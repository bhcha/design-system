"use client"

/**
 * shadcn/ui slider (base-nova, Base UI) — Ollama 테마. shadcn CLI 로 설치한 원본이다.
 *
 * 해부도
 *   Root ─ Control ─ Track(pill) ─ Indicator(채움) + Thumb(원) × 값 개수
 *
 * 토큰
 *   트랙 h-1 rounded-full bg-border(hairline) · 채움 bg-primary
 *   썸 size-4 rounded-full bg-background border-primary · 포커스 ring-2 ring-ring · 그림자 없음
 *
 * 상태
 *   기본 / 드래그 / focus-visible / disabled(채움 bg-mute · 썸 테두리 mute — opacity 아님)
 *
 * 키보드·ARIA
 *   Base UI Slider — 썸마다 input[type=range]. 화살표 ±step, PageUp/Down, Home/End.
 *   접근 가능한 이름은 `getAriaLabel={(i) => "…"}` 로 썸마다 준다(범위 슬라이더는 시작·끝을 구분).
 *
 * 수용 기준
 *   - 썸 하나하나에 이름이 있다.
 *   - 비활성은 opacity 가 아니라 토큰 색이다.
 *   - 색·곡률·크기는 globals.css 의 shadcn 시맨틱 토큰에서만 나온다.
 */
import { Slider as SliderPrimitive } from "@base-ui/react/slider"
import { cn } from "@/lib/utils"

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  getAriaLabel,
  ...props
}: SliderPrimitive.Root.Props &
  Pick<SliderPrimitive.Thumb.Props, "getAriaLabel">) {
  const _values = Array.isArray(value)
    ? value
    : Array.isArray(defaultValue)
      ? defaultValue
      : [min, max]

  return (
    <SliderPrimitive.Root
      className={cn("data-horizontal:w-full data-vertical:h-full", className)}
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      thumbAlignment="edge"
      {...props}
    >
      <SliderPrimitive.Control className="group/slider-control relative flex w-full touch-none items-center select-none data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col">
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="relative grow overflow-hidden rounded-full bg-border select-none data-horizontal:h-1 data-horizontal:w-full data-vertical:h-full data-vertical:w-1"
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className="bg-primary select-none group-data-disabled/slider-control:bg-mute data-horizontal:h-full data-vertical:w-full"
          />
        </SliderPrimitive.Track>
        {Array.from({ length: _values.length }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            index={index}
            getAriaLabel={getAriaLabel}
            className="relative block size-4 shrink-0 rounded-full border border-primary bg-background transition-colors select-none after:absolute after:-inset-2 has-focus-visible:ring-2 has-focus-visible:ring-ring data-disabled:pointer-events-none data-disabled:border-mute"
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}

export { Slider }
