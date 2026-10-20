"use client"

import * as React from "react"

/**
 * Density — 밀도 범위. 안쪽 컴포넌트의 간격·글자 토큰을 compact 로 바꾼다 (이슈 #10).
 *
 * 컴포넌트마다 size 를 고르지 않는다. 범위 하나가 메뉴·탭·버튼·입력·카드·코드·표·대화상자까지
 * 같은 밀도로 잇는다. 값은 globals.css 의 "밀도" 절이 정한다 — 이 파일은 속성만 단다.
 *
 * 해부도
 *   <div data-ui-density="compact" class="contents">  ← 상자를 만들지 않는다(배치에 끼지 않음)
 *     children
 *   포털(Dialog·AlertDialog·Sheet·Drawer·Popover·Tooltip·Select·Combobox·DropdownMenu·
 *   HoverCard·NavigationMenu)은 useDensity() 로 같은 값을 자기 포털 요소에 단다.
 *
 * 토큰
 *   compact — --spacing 3.2px(0.8배) · 글자는 타입 스케일 한 단계 아래, 최소 12px(text-xs)
 *   default — 4px · 기본 스케일. compact 범위 안에서 기본으로 되돌릴 때.
 *   768px 미만(모바일)에서는 compact 도 기본값이다.
 *
 * 상태
 *   default / compact. 범위 밖 포털은 값이 없어 부모(html·body)를 따른다.
 *
 * 키보드·ARIA
 *   시맨틱 없음 — 역할·포커스 순서를 바꾸지 않는다.
 *
 * 수용 기준
 *   - CSS zoom · transform: scale() 을 쓰지 않는다. 실제 CSS 크기·간격이 바뀐다.
 *   - 포털로 열린 대화상자·팝오버도 연 곳의 밀도를 따른다.
 *   - SidebarProvider 처럼 크기 변수를 정하는 컴포넌트보다 바깥에 둔다(앱 셸 전체를 감싼다).
 *   - 색·곡률·크기는 globals.css 의 시맨틱 토큰에서만 나온다.
 */

export type DensityValue = "default" | "compact"

const DensityContext = React.createContext<DensityValue | undefined>(undefined)

function Density({
  value,
  children,
}: {
  value: DensityValue
  children: React.ReactNode
}) {
  return (
    <DensityContext.Provider value={value}>
      <div data-slot="density" data-ui-density={value} className="contents">
        {children}
      </div>
    </DensityContext.Provider>
  )
}

/** 가장 가까운 Density 의 값. 범위 밖이면 undefined — 포털에 속성을 달지 않는다. */
function useDensity() {
  return React.useContext(DensityContext)
}

export { Density, useDensity }
