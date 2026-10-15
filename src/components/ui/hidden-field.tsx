import type * as React from "react";

/**
 * HiddenField — 폼과 함께 실려가는 숨은 값.
 *
 * 컨트롤이 아니라 **폼 데이터의 일부**다. 서버 액션이 무엇을 대상으로 하는지
 * (`kind` · `id` · 현재 필터)를 전달한다.
 *
 * 바탕 primitive
 *   없다 — shadcn 에 숨은 값 primitive 는 없고, 시각이 없으므로 빌릴 스타일도 없다.
 *   네이티브 `<input type="hidden">` 하나를 그린다. 서버 컴포넌트에서 그대로 쓴다.
 *
 * 왜 컴포넌트인가
 *   화면에서 raw `<input>` 을 쓰지 못하게 막는 규칙이 있다. 숨은 값도 예외로
 *   두면 그 구멍으로 진짜 컨트롤이 새어 들어온다. 그래서 통로를 하나 만들고
 *   여기에만 남겼다.
 *
 * 해부도
 *   보이는 것이 없다. type="hidden" 이라 접근성 트리에도 나타나지 않는다.
 *
 * 토큰
 *   시각 값 없음.
 *
 * 상태
 *   상태 없음.
 *
 * 키보드·ARIA
 *   포커스를 받지 않으며 스크린 리더가 읽지 않는다. 사용자가 인지해야 하는
 *   값이라면 숨기지 말고 보이는 컨트롤로 만든다.
 *
 * 수용 기준
 *   - name 과 value 없이 컴파일되지 않는다.
 */
export function HiddenField({ name, value }: { name: string; value: string }): React.JSX.Element {
  return <input type="hidden" name={name} value={value} />;
}
