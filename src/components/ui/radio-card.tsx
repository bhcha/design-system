"use client";

import { ChoiceCardBody, choiceCardClass } from "@/components/ui/choice-card";
import { Item } from "@/components/ui/item";
import { cn } from "@/lib/utils";

/**
 * RadioCard — 폼으로 제출되는 선택 카드
 * (예: 역할 선택 · 정렬 기준 선택처럼 폼으로 제출되는 선택지)
 *
 * 바탕 primitive (shadcn/ui base-nova)
 *   카드 그림은 shadcn `Item`(variant="outline", `render={<span aria-hidden>}`)이고,
 *   시각은 ChoiceCard 와 같은 `choiceCardClass("peer")` 다.
 *   컨트롤은 **네이티브 `<input type="radio">` 를 그대로 둔다.** shadcn `RadioGroup`/
 *   `RadioGroupItem`(Base UI Radio)으로 바꾸지 않은 이유:
 *     - Base UI Radio 는 `RadioGroup` 문맥 안에서만 동작하는데, RadioCard 는 호출부가
 *       같은 `name` 의 카드를 `<fieldset>` 안에 나란히 두는 API 다. 그룹 래퍼를 끼우면
 *       모든 호출부가 바뀐다(drop-in 아님).
 *     - 서버 액션 폼이 자바스크립트 없이 `name=value` 를 제출하고, e2e 가
 *       `getByRole("radio", { name })` · `toBeChecked()` 로 네이티브 라디오를 질의한다.
 *   모듈이 "use client" 인 것은 Item(useRender)과 choiceCardClass 를 클라이언트에서
 *   쓰기 위해서다. props 는 전부 직렬화 가능하므로 서버 컴포넌트가 그대로 렌더한다.
 *
 * ChoiceCard 와의 관계
 *   ChoiceCard 는 **버튼**이라 클라이언트 핸들러가 필요하다. RadioCard 는 같은
 *   시각을 **네이티브 라디오 입력** 위에 얹어 서버 액션 폼으로 제출되게 한다.
 *   시각(`choiceCardClass` · `ChoiceCardBody`)은 한 곳에서 오므로 갈라지지 않는다.
 *
 *   라벨 안에 ChoiceCard(버튼)를 넣지 않는다 — 상호작용 요소가 중첩돼 마크업이
 *   잘못되고, 클릭이 버튼에 먹혀 라디오가 선택되지 않는다(실제로 났던 결함이다).
 *
 * 해부도
 *   <label>
 *     [시각적으로 숨긴 radio]          ← 실제 컨트롤. 포커스와 선택을 담당한다.
 *     [Item 카드 <span aria-hidden>]   ← 그 상태를 비추는 그림.
 *   </label>
 *
 * 토큰
 *   자체 시각 값이 없다 — 전부 ChoiceCard(Item) 의 것이다.
 *   포커스는 라디오의 focus-visible 을 카드에 옮겨 그린다 — Item 과 같은
 *   ring-3 --color-ring/50 (`peer-focus-visible:`).
 *   비활성 배경 --color-muted · 글자 --color-mute
 *
 * 상태
 *   미선택 / 선택 / focus-visible / 비활성
 *   선택 시각은 **전부 `peer-checked:`** 가 계산한다(`choiceCardClass("peer")`).
 *   `defaultChecked` 는 브라우저의 초기값일 뿐이므로 시각 계산에 넣지 않는다.
 *   넣으면 사용자가 다른 라디오를 골라도 최초 카드의 선택 스타일이 남아 두 개가
 *   선택된 것처럼 보인다(역할 결정 화면에서 실제로 났던 결함이다).
 *
 * 키보드·ARIA
 *   같은 `name` 을 가진 RadioCard 들이 하나의 라디오 그룹이 된다. ↑↓ 이동과
 *   스페이스 선택은 브라우저가 처리한다. 그룹 이름은 감싸는
 *   `<fieldset>/<legend>` 가 만든다.
 *   카드는 `aria-hidden` 이라 라벨이 두 번 읽히지 않는다 — 접근 가능한 이름은
 *   숨은 라디오의 라벨 텍스트에서 온다.
 *
 * 수용 기준
 *   - 자바스크립트 없이 선택되고 제출된다.
 *   - 키보드 포커스가 카드에 보인다.
 *   - 같은 name 의 카드 중 **선택 스타일이 보이는 카드가 항상 정확히 하나**다.
 */
export function RadioCard({
  name,
  value,
  defaultChecked,
  disabled,
  title,
  description,
  className,
}: {
  name: string;
  value: string;
  defaultChecked?: boolean;
  disabled?: boolean;
  /** 스크린 리더가 읽을 이름이기도 하므로 문자열이다. */
  title: string;
  description?: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block cursor-pointer", className)}>
      <input
        type="radio"
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        disabled={disabled}
        className="peer sr-only"
      />
      <span className="sr-only">{title}</span>
      <Item
        variant="outline"
        render={<span aria-hidden="true" />}
        className={choiceCardClass(
          // 선택 시각은 defaultChecked(초기값)가 아니라 라디오의 현재 체크 상태가 정한다.
          "peer",
          cn(
            "peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50",
            disabled ? "border-border bg-muted text-mute" : undefined,
          ),
        )}
      >
        <ChoiceCardBody
          title={title}
          description={description}
          selected="peer"
        />
      </Item>
    </label>
  );
}
