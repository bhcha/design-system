"use client"

/**
 * shadcn/ui input-otp (base-nova, input-otp) — Ollama 테마. shadcn CLI 로 설치한 원본이다.
 *
 * 해부도
 *   InputOTP(숨은 input) ─ Group(pill 묶음) ─ Slot × n · Separator(–)
 *
 * 토큰
 *   슬롯 size-10 · 1px border-input · bg-background · text-base · 묶음 양 끝 rounded-full
 *   활성 슬롯 border-foreground + ring-2 ring-ring
 *
 * 상태
 *   빈칸 / 입력됨 / 활성(가짜 캐럿) / aria-invalid / disabled(bg-muted text-mute)
 *
 * 키보드·ARIA
 *   input-otp — 실제 입력은 하나의 input 이다. 이름은 InputOTP 에 aria-label 로 준다.
 *   붙여넣기·자동완성(one-time-code)을 지원한다. Separator 는 role=separator.
 *
 * 수용 기준
 *   - 슬롯 하나가 한 글자다.
 *   - 비활성은 opacity 가 아니라 bg-muted · text-mute 다.
 *   - 색·곡률·크기는 globals.css 의 shadcn 시맨틱 토큰에서만 나온다.
 */
import * as React from "react"
import { cn } from "@/lib/utils"
import { OTPInput, OTPInputContext } from "input-otp"
import { MinusIcon } from "lucide-react"

function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string
}) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        "flex items-center gap-2 has-disabled:[&_[data-slot=input-otp-slot]]:bg-muted has-disabled:[&_[data-slot=input-otp-slot]]:text-mute",
        containerClassName
      )}
      spellCheck={false}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  )
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn(
        "flex items-center rounded-full has-aria-invalid:border-destructive has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number
}) {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {}

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        "relative flex size-10 items-center justify-center border-y border-r border-input bg-background text-base transition-all outline-none first:rounded-l-full first:border-l last:rounded-r-full aria-invalid:border-destructive data-[active=true]:z-10 data-[active=true]:border-foreground data-[active=true]:ring-2 data-[active=true]:ring-ring data-[active=true]:aria-invalid:border-destructive data-[active=true]:aria-invalid:ring-destructive/20 dark:bg-input/30 dark:data-[active=true]:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  )
}

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-separator"
      className="flex items-center [&_svg:not([class*='size-'])]:size-4"
      role="separator"
      {...props}
    >
      <MinusIcon
      />
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
