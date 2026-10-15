import * as React from "react"

const MOBILE_BREAKPOINT = 768
const QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(QUERY)
  mql.addEventListener("change", onChange)
  return () => mql.removeEventListener("change", onChange)
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches
}

/** 서버 렌더에서는 데스크톱으로 가정한다(하이드레이션 뒤 실제 값으로 바뀐다). */
function getServerSnapshot() {
  return false
}

/**
 * 뷰포트가 모바일 폭(768px 미만)인지 돌려준다.
 * effect 안에서 setState 하지 않도록 useSyncExternalStore 로 matchMedia 를 구독한다.
 */
export function useIsMobile() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
