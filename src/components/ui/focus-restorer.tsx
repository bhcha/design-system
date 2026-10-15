"use client";

import { useEffect } from "react";

/**
 * FocusRestorer — 검색 뒤 포커스를 원래 자리로 되돌린다
 *
 * 왜 필요한가
 *   이 앱의 열 검색은 **주소를 바꾸는 폼 제출**이다(검색어가 URL 에 남아 딥링크·
 *   새로고침에서 살아남는다). 그 대가로 화면이 다시 그려지면서 포커스가 <body> 로
 *   떨어진다. 키보드만 쓰는 사람은 검색할 때마다 목록 맨 위에서 다시 Tab 을 눌러야
 *   한다. 클라이언트 렌더 검색이라면 입력 칸과 캐럿 위치가 그대로 유지됐을 자리다.
 *
 *   그래서 검색 결과가 그려진 직후 그 검색 칸에 포커스를 돌려주고 캐럿을 글자 끝에
 *   둔다. 지우기(초기화)로 들어온 경우에도 같은 칸으로 돌아온다 — 지우자마자
 *   다시 칠 수 있어야 한다.
 *
 * 해부도
 *   없다 — 아무것도 그리지 않는다(`return null`). 화면에 나타나는 요소가 아니라
 *   "그려진 뒤 한 번 일어나는 일"이다.
 *
 * 토큰
 *   쓰지 않는다. 시각 요소가 없다.
 *
 * 상태
 *   대상 있음(포커스를 옮긴다) / 대상 없음(아무 일도 하지 않는다)
 *
 * 키보드·ARIA
 *   포커스만 옮기고 DOM 은 건드리지 않는다. 옮겨 간 칸의 이름·역할은 그 칸이 갖는다.
 *
 * 아무 때나 포커스를 뺏지 않는다
 *   `target` 이 있을 때만 동작한다. 호출부는 "방금 검색·초기화가 일어난 열"에서만
 *   이 값을 넘긴다. 첫 진입처럼 사용자가 아무것도 하지 않은 화면에서는 포커스가
 *   움직이지 않는다.
 *
 * 같은 칸으로 두 번 돌아와야 할 때가 있다
 *   검색 → 지우기는 둘 다 같은 칸이 대상이라 `target` 만으로는 두 번째가 일어나지
 *   않는다(의존성이 그대로다). 그래서 호출부가 매 이동마다 달라지는 `token` 을 함께
 *   넘긴다 — 보통 그 칸의 현재 값이다.
 *
 * 수용 기준
 *   - 검색 제출 뒤 같은 검색 칸에 포커스가 있고 캐럿이 글자 끝에 있다.
 *   - target 이 없으면 아무 일도 하지 않는다.
 */
export function FocusRestorer({
  target,
  token,
}: {
  target?: string;
  /** 이동마다 달라지는 값. 같은 칸으로 다시 돌아와야 할 때 필요하다. */
  token?: string;
}) {
  useEffect(() => {
    if (!target) return;
    const element = document.querySelector<HTMLElement>(
      `[data-focus-key="${target}"]`,
    );
    if (!element) return;
    element.focus();
    if (element instanceof HTMLInputElement) {
      // 캐럿을 끝으로. 값을 다시 넣는 것이 브라우저 간 가장 확실한 방법이다.
      const value = element.value;
      element.value = "";
      element.value = value;
    }
  }, [target, token]);

  return null;
}
