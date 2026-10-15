"use client";

import Link from "next/link";
import { Item } from "@/components/ui/item";
import { cn } from "@/lib/utils";

/**
 * ChoiceCard — 설명이 붙은 선택지
 *
 * 바탕 primitive (shadcn/ui base-nova)
 *   카드 껍데기는 shadcn `Item`(variant="outline")이다. Item 은 Base UI `useRender` 로
 *   `render` 받은 요소를 그대로 그리므로 시맨틱은 진입점마다 네이티브로 남는다 —
 *   ChoiceCard 는 `<button>`, ChoiceCardLink 는 Next `<Link>`(`<a>`), RadioCard 는
 *   `<span aria-hidden>` 이다. `RadioGroup`/`RadioGroupItem` 은 쓰지 않는다: 그 primitive 는
 *   상태와 방향키를 스스로 쥐는데, 이 카드는 호출부가 선택을 들고(서버 렌더 값·URL)
 *   방향키는 RovingFocus 가 처리하며, `role="radio"` 버튼·링크 시맨틱을 e2e 가 질의한다.
 *   카드 안쪽(제목·설명·선택 기호)은 `<span>` 으로 둔다 — 버튼·라벨 안에는 구문 콘텐츠만
 *   들어갈 수 있어 ItemContent(div)·ItemDescription(p) 를 쓰지 않았다.
 *
 *   이 모듈은 "use client" 다. Item 의 useRender 가 서버 컴포넌트에서 쓸 수 없는 훅
 *   (useRef)을 쓰기 때문이다. 서버 컴포넌트는 지금처럼 <ChoiceCard>·<ChoiceCardLink> 를
 *   그대로 렌더하면 된다(함수 prop 을 넘기지 않는 한). 단, `choiceCardClass` 같은 일반
 *   함수는 클라이언트 모듈에서만 호출할 수 있다(radio-card.tsx 도 클라이언트 모듈이다).
 *
 * 근거: ADS 선택 카드 해부도(제목 + 설명이 하나의 선택 대상, 선택은 테두리 강조 +
 * 배경). 시각 값은 전부 design.md 토큰.
 *
 * OptionChip 과의 차이
 *   OptionChip 은 한 줄 라벨의 인라인 칩이다. ChoiceCard 는 **설명을 포함한 블록 선택지**로,
 *   결정을 요구하는 자리(역할 선택 · 정렬 기준 선택 · 보기 선택)에 쓴다.
 *
 * 해부도
 *   <Item render={button | Link | span}>
 *   ┌───────────────────────────────┐
 *   │ [media] [제목]        [선택✓] │
 *   │         [설명]                │
 *   └───────────────────────────────┘
 *   media 는 아바타·아이콘 자리다(선택). 없으면 텍스트만 남는다.
 *
 * 토큰
 *   곡률 --radius-lg (Item) · 패딩 p-3 · 간격 gap-3
 *   테두리 2px — 기본 --color-border, 선택 --color-primary (굵기 고정, 레이아웃 점프 없음)
 *   배경 기본 --color-background · 선택 --color-selected · hover --color-accent
 *   포커스 — Item: ring-3 --color-ring/50 (+ 미선택 테두리 --color-ring)
 *   제목 --text-base + font-semibold · 설명 --text-xs + --color-charcoal
 *
 * 상태
 *   미선택 / 선택 / hover / focus-visible / 비활성
 *   - active: `scale(0.95)` — design.md 가 규정한 시스템 전역 마이크로 인터랙션.
 *     button·icon-button·option-chip 과 같은 값이다(카드만 다른 값을 쓰지 않는다).
 *   - 선택 시각의 계산 방식은 두 가지다.
 *     `boolean` — React 가 상태를 들고 있는 자리(ChoiceCard·ChoiceCardLink).
 *     `"peer"`  — 네이티브 입력이 상태를 들고 있는 자리(RadioCard). 선택 시각을
 *                 `peer-checked:` 로만 계산해, 초기값이 박제돼 두 개가 선택된 것처럼
 *                 보이는 결함을 구조적으로 막는다.
 *
 * 키보드·ARIA
 *   - `mode="toggle"` : `<button aria-pressed>` — 켜고 끄는 선택
 *   - `mode="radio"`  : `<button role="radio" aria-checked>` — 여럿 중 하나.
 *     호출부가 `role="radiogroup"` + `aria-label` 로 감싼다.
 *   - `ChoiceCardLink`  : 고르는 순간 주소가 바뀌는 자리. 링크가 곧 카드다 —
 *     카드를 `<a>` 로 감싸면 링크 안의 버튼이 되어 마크업과 키보드 이동이 모두 깨진다.
 *     현재 선택은 `aria-current="page"`.
 *   폼으로 제출해야 하면 이 컴포넌트가 아니라 `RadioCard` 를 쓴다 — 라벨 안에
 *   버튼을 넣으면 클릭이 라디오에 닿지 않고 마크업도 잘못된다.
 *   설명은 제목과 같은 버튼 안에 있으므로 함께 읽힌다.
 *
 * 수용 기준
 *   - 선택 상태가 테두리 색과 배경 둘 다로 전달된다(포커스 중에도 선택 테두리 유지).
 *   - 선택돼도 크기가 변하지 않는다.
 */
/**
 * 카드의 선택 시각을 누가 계산하는가.
 *   boolean — 호출부(React 상태·서버 렌더 값)가 확정한다.
 *   "peer"  — 앞선 형제 `<input>` 의 실제 체크 상태가 확정한다(RadioCard).
 */
export type ChoiceCardSelection = boolean | "peer";

/**
 * 카드의 시각. `<Item variant="outline">` 위에 덮는 클래스다.
 * 버튼(ChoiceCard)·링크(ChoiceCardLink)·라벨 안 그림(RadioCard)이 이 한 곳을 공유한다.
 */
export function choiceCardClass(
  selected: ChoiceCardSelection,
  className?: string,
): string {
  return cn(
    // Item 기본값(flex-wrap · 1px · px-3 py-2.5 · text-sm)을 카드 규격으로 덮는다.
    "flex-nowrap gap-3 border-2 p-3 text-left select-none",
    "transition-transform duration-100 active:scale-95 [a]:transition-transform",
    "disabled:pointer-events-none disabled:border-border disabled:bg-muted disabled:text-mute",
    selected === "peer"
      ? [
          // 정적 계산에는 선택 시각이 없다. 전부 peer-checked: 가 결정한다.
          // 글자색은 손자인 선택 기호(✓)가 물려받는 값이라, 미선택에서는 투명이다
          // — 흐린 ✓ 를 상시 그리면 선택 신호가 흐려진다(ChoiceCardBody 주석).
          "border-border bg-background text-transparent hover:bg-accent",
          "peer-checked:border-primary peer-checked:bg-selected peer-checked:text-primary",
          // hover 와 선택은 같은 특이도라 순서에 좌우된다. 선택 위에 hover 를
          // 겹쳐 써서(특이도 +1) 선택된 카드가 hover 색으로 덮이지 않게 고정한다.
          "peer-checked:hover:bg-selected",
        ].join(" ")
      : selected
        ? // Item 의 focus-visible:border-ring 이 선택 테두리를 지우지 않게 고정한다.
          "border-primary bg-selected focus-visible:border-primary [a]:hover:bg-selected"
        : "border-border bg-background hover:bg-accent [a]:hover:bg-accent",
    className,
  );
}

/** 카드 내용. 세 진입점이 같은 구성을 쓴다. */
export function ChoiceCardBody({
  media,
  title,
  description,
  selected,
}: {
  media?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  selected: ChoiceCardSelection;
}) {
  return (
    <>
      {media ? <span className="shrink-0">{media}</span> : null}

      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-base font-semibold break-words text-foreground">
          {title}
        </span>
        {description ? (
          <span className="text-xs text-charcoal">{description}</span>
        ) : null}
      </span>

      {/* 선택 표시는 색·테두리에 더해 기호로도 남긴다.
          "peer" 모드에서는 peer 형제가 아니라 손자라서 peer-checked: 가 닿지 않는다.
          그래서 색을 지정하지 않고 카드 컨테이너가 정한 색을 물려받는다.

          미선택에서는 기호를 **투명**으로 둔다(빈 원).
          흐린 회색 ✓ 를 상시 그리면 대비 1.2:1 로 읽히지도 않으면서 "선택됨"의
          잔상만 남아, 무엇이 골라졌는지가 카드 사이에서 흐려진다. 자리는 원형
          테두리가 지켜 선택해도 글자가 밀리지 않는다. */}
      <span
        aria-hidden="true"
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
          // peer 모드는 글자색만 물려받는다(테두리까지 물려받으면 미선택에서
          // 원까지 투명해져 자리 표시가 사라진다).
          selected === "peer"
            ? "border-border"
            : selected
              ? "border-primary text-primary"
              : "border-border text-transparent",
        )}
      >
        ✓
      </span>
    </>
  );
}

/**
 * 이동이 곧 선택인 자리의 카드 (보기 선택 등).
 *
 * 카드를 `<a>` 로 감싸고 그 안에 `<ChoiceCard>` 를 두면 **링크 안의 버튼**이 되어
 * 마크업이 잘못되고, 방향키 이동이 카드 안쪽 버튼에서 한 번 더 멈춘다. 그래서
 * 링크가 곧 카드다 — Item 이 `<Link>` 를 그리고 시각은 `choiceCardClass` 를 쓴다.
 */
export function ChoiceCardLink({
  href,
  className,
  title,
  description,
  selected = false,
  media,
  ...props
}: Omit<React.ComponentProps<typeof Link>, "className"> & {
  title: React.ReactNode;
  description?: React.ReactNode;
  selected?: boolean;
  media?: React.ReactNode;
  className?: string;
}) {
  return (
    <Item
      variant="outline"
      render={
        <Link
          href={href}
          aria-current={selected ? "page" : undefined}
          {...props}
        />
      }
      className={choiceCardClass(selected, className)}
    >
      <ChoiceCardBody
        media={media}
        title={title}
        description={description}
        selected={selected}
      />
    </Item>
  );
}

export type ChoiceCardProps = Omit<React.ComponentProps<"button">, "type"> & {
  title: React.ReactNode;
  description?: React.ReactNode;
  selected?: boolean;
  /** toggle = aria-pressed, radio = role="radio" + aria-checked */
  mode?: "toggle" | "radio";
  /** 좌측 시각 슬롯(Avatar 등). 장식이므로 접근 가능한 이름은 title 이 만든다. */
  media?: React.ReactNode;
};

export function ChoiceCard({
  className,
  title,
  description,
  selected = false,
  mode = "toggle",
  media,
  ...props
}: ChoiceCardProps) {
  return (
    <Item
      variant="outline"
      render={
        <button
          type="button"
          role={mode === "radio" ? "radio" : undefined}
          aria-checked={mode === "radio" ? selected : undefined}
          aria-pressed={mode === "toggle" ? selected : undefined}
          {...props}
        />
      }
      className={choiceCardClass(selected, className)}
    >
      <ChoiceCardBody
        media={media}
        title={title}
        description={description}
        selected={selected}
      />
    </Item>
  );
}
