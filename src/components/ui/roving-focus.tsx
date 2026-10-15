"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * RovingFocus — 목록 안에서 방향키로 포커스를 옮기는 껍데기
 * (↑↓←→ Home End)
 *
 * 왜 필요한가
 *   선택지가 열두 개인 목록을 Tab 만으로 지나가면 그다음 영역에 닿기까지 열두 번을
 *   눌러야 한다. 그래서 방향키로 목록 안을 돌고 Tab 은 목록을 통째로 넘긴다.
 *
 * 해부도
 *   없다 — `display: contents` 로 감싸기만 한다. 자식의 레이아웃(부모의 flex·grid)에
 *   끼어들지 않고 keydown 만 받는다.
 *
 * 토큰
 *   쓰지 않는다. 시각 요소가 없다.
 *
 * 링크 목록에서는 **옮기기만** 한다
 *   라디오 그룹이라면 방향키가 곧 선택이다. 여기서 선택지는 주소를 가진
 *   링크라, 방향키마다 화면이 이동하면 되돌아올 방법이 없다. 방향키는 포커스만
 *   옮기고 확정은 Enter 가 한다 — 링크의 표준 동작 그대로다.
 *
 * 위임만 한다
 *   자식은 서버에서 그려 넘긴 마크업이다. 이 껍데기는 keydown 을 받아 포커스를
 *   옮길 뿐 자식을 다시 만들지 않는다(DataGrid ↔ SelectableDataGrid 와 같은 구조).
 *
 * 상태
 *   포커스 없음 / 목록 안 포커스
 *
 * 키보드·ARIA
 *   세로 목록이면 ↑↓, 가로면 ←→ 를 쓰고 Home·End 는 양쪽 다 동작한다.
 *   `both` 는 네 방향을 모두 받는다. 목록의 이름·역할은 호출부(<nav>·<ul>)가 준다.
 *
 * 수용 기준
 *   - 마지막 항목에서 ↓ 를 누르면 첫 항목으로 돈다.
 *   - 비활성 항목은 건너뛴다.
 */
const NEXT_KEYS: Record<string, readonly string[]> = {
  vertical: ["ArrowDown"],
  horizontal: ["ArrowRight"],
  both: ["ArrowDown", "ArrowRight"],
};

const PREV_KEYS: Record<string, readonly string[]> = {
  vertical: ["ArrowUp"],
  horizontal: ["ArrowLeft"],
  both: ["ArrowUp", "ArrowLeft"],
};

export function RovingFocus({
  orientation = "vertical",
  children,
  className,
}: {
  orientation?: "vertical" | "horizontal" | "both";
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const next = NEXT_KEYS[orientation];
    const prev = PREV_KEYS[orientation];
    const isNext = next.includes(event.key);
    const isPrev = prev.includes(event.key);
    if (!isNext && !isPrev && event.key !== "Home" && event.key !== "End") return;

    const items = Array.from(
      ref.current?.querySelectorAll<HTMLElement>(
        "a[href], button:not(:disabled)",
      ) ?? [],
    );
    const at = items.indexOf(event.target as HTMLElement);
    if (at < 0 || items.length === 0) return;

    event.preventDefault();
    const target = isNext
      ? (at + 1) % items.length
      : isPrev
        ? (at - 1 + items.length) % items.length
        : event.key === "Home"
          ? 0
          : items.length - 1;
    items[target]?.focus();
  };

  return (
    <div ref={ref} onKeyDown={onKeyDown} className={cn("contents", className)}>
      {children}
    </div>
  );
}
