import { cn } from "@/lib/utils"

/**
 * TokenSample — 디자인 토큰 견본 (색 · 간격 · 곡률). 문서·카탈로그 전용 컴포넌트.
 *
 * 해부도
 *   ColorSample  [ 색 면 ] — 1px hairline 테두리 사각형
 *   SpaceSample  [ 막대 ] — 토큰 폭만큼의 검정 막대
 *   RadiusSample [ 상자 ] — 토큰 곡률을 입힌 soft surface 상자
 *
 * 토큰
 *   색 면은 globals.css 의 --color-* 토큰 이름을 그대로 받는다. 클래스는 정적 표에서만
 *   고른다 — 동적 문자열(`bg-${x}`)은 Tailwind 가 생성하지 못하고 lint(require-static-classes)가 막는다.
 *
 * 상태
 *   정적.
 *
 * 키보드·ARIA
 *   견본은 장식(aria-hidden). 이름·값은 호출부가 텍스트로 옆에 적는다.
 *
 * 수용 기준
 *   - 존재하지 않는 토큰 이름은 타입 오류다.
 */
const COLOR = {
  background: "bg-background",
  foreground: "bg-foreground",
  card: "bg-card",
  "card-foreground": "bg-card-foreground",
  popover: "bg-popover",
  "popover-foreground": "bg-popover-foreground",
  primary: "bg-primary",
  "primary-foreground": "bg-primary-foreground",
  "primary-active": "bg-primary-active",
  secondary: "bg-secondary",
  "secondary-foreground": "bg-secondary-foreground",
  muted: "bg-muted",
  "muted-foreground": "bg-muted-foreground",
  accent: "bg-accent",
  "accent-foreground": "bg-accent-foreground",
  selected: "bg-selected",
  destructive: "bg-destructive",
  border: "bg-border",
  input: "bg-input",
  ring: "bg-ring",
  sidebar: "bg-sidebar",
  "sidebar-foreground": "bg-sidebar-foreground",
  "sidebar-primary": "bg-sidebar-primary",
  "sidebar-primary-foreground": "bg-sidebar-primary-foreground",
  "sidebar-accent": "bg-sidebar-accent",
  "sidebar-accent-foreground": "bg-sidebar-accent-foreground",
  "sidebar-border": "bg-sidebar-border",
  "sidebar-ring": "bg-sidebar-ring",
  black: "bg-black",
  white: "bg-white",
  charcoal: "bg-charcoal",
  mute: "bg-mute",
  "hairline-strong": "bg-hairline-strong",
  "surface-dark": "bg-surface-dark",
  nav: "bg-nav",
  "on-dark": "bg-on-dark",
  "on-dark-mute": "bg-on-dark-mute",
  "on-dark-border": "bg-on-dark-border",
  "terminal-red": "bg-terminal-red",
  "terminal-yellow": "bg-terminal-yellow",
  "terminal-green": "bg-terminal-green",
  "status-ok": "bg-status-ok",
  "status-ok-soft": "bg-status-ok-soft",
  "status-info": "bg-status-info",
  "status-info-soft": "bg-status-info-soft",
  "status-warn": "bg-status-warn",
  "status-warn-soft": "bg-status-warn-soft",
  "status-danger": "bg-status-danger",
  "status-danger-soft": "bg-status-danger-soft",
} as const

export type ColorToken = keyof typeof COLOR

export function ColorSample({
  token,
  size = "sm",
  className,
}: {
  token: ColorToken
  size?: "sm" | "lg"
  className?: string
}) {
  return (
    <span
      aria-hidden="true"
      data-slot="color-sample"
      className={cn(
        "block shrink-0 border border-border",
        size === "lg" ? "h-24 w-full" : "size-8 rounded-sm",
        COLOR[token],
        className,
      )}
    />
  )
}

const SPACE = {
  xxs: "w-0.5",
  xs: "w-1",
  sm: "w-2",
  md: "w-3",
  lg: "w-4",
  xl: "w-6",
  xxl: "w-8",
  section: "w-22",
} as const

export function SpaceSample({ step }: { step: keyof typeof SPACE }) {
  return <span aria-hidden="true" data-slot="space-sample" className={cn("block h-8 bg-foreground", SPACE[step])} />
}

const RADIUS = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
} as const

export function RadiusSample({ radius }: { radius: keyof typeof RADIUS }) {
  return (
    <span
      aria-hidden="true"
      data-slot="radius-sample"
      className={cn("block size-24 border border-border bg-muted", RADIUS[radius])}
    />
  )
}
