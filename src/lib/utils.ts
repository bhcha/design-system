import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * shadcn/ui 표준 클래스 결합 함수.
 *
 * 토큰 이름이 shadcn 규약(text-sm · bg-primary …)과 Tailwind 기본 타입 스케일을 그대로
 * 따르므로 tailwind-merge 기본 설정이 크기와 색을 올바르게 구분한다.
 * design.md 고유 색(charcoal · mute · on-dark …)은 tailwind-merge 가 색으로 취급한다.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
