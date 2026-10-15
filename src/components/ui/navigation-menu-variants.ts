import { cva } from "class-variance-authority"

/**
 * shadcn NavigationMenu 트리거 스타일 — 서버에서도 부를 수 있도록 navigation-menu.tsx("use client")에서 분리했다.
 * 서버 컴포넌트가 next/link 에 같은 pill 모양을 입힐 때 여기서 가져온다.
 * pill(rounded-full) · h-9 · hover/열림 bg-accent · 포커스 ring-2 ring-ring · 비활성 text-mute.
 */
export const navigationMenuTriggerStyle = cva(
  "group/navigation-menu-trigger inline-flex h-9 w-max items-center justify-center rounded-full px-4 py-1.5 text-sm font-medium transition-colors outline-none hover:bg-accent focus:bg-accent focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:text-mute data-popup-open:bg-accent data-open:bg-accent"
)
