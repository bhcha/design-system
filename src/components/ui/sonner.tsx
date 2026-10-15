"use client"

/**
 * shadcn/ui sonner (base-nova, sonner) — Ollama 테마. shadcn CLI 로 설치한 원본이다.
 *
 * 해부도
 *   <Toaster /> 하나를 둔다 → toast() 가 오른쪽 아래(기본)에 쌓인다 ─ 아이콘 · 제목 · 설명 · 액션
 *
 * 토큰
 *   --normal-bg popover · --normal-text popover-foreground · --normal-border border(hairline) · --border-radius radius(12px)
 *   그림자 없음(shadow-none!) · 테마 light 고정(이 앱은 어두운 테마가 없다)
 *
 * 상태
 *   기본 / success / info / warning / error / loading
 *
 * 키보드·ARIA
 *   sonner — 알림 영역은 aria-live 로 읽힌다. Alt+T 로 알림 영역으로 포커스 이동.
 *   액션 버튼에는 동작이 드러나는 라벨을 쓴다.
 *
 * 수용 기준
 *   - 토스트에 그림자가 없다.
 *   - 알림은 스크린리더에 읽힌다.
 *   - 색·곡률·크기는 globals.css 의 shadcn 시맨틱 토큰에서만 나온다.
 */
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "shadow-none!",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
