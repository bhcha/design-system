import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

/**
 * CheckboxList — 다중 선택 목록
 *
 * 바탕 primitive (shadcn/ui base-nova)
 *   각 행의 컨트롤은 shadcn `Checkbox`(Base UI Checkbox)다. Base UI Checkbox 는
 *   `<span role="checkbox" aria-checked>` 와 **같은 name·value 를 가진 숨은 네이티브
 *   `<input type="checkbox">`** 를 함께 그린다. 체크된 항목만 `name=value` 로 제출되므로
 *   서버 액션이 받는 폼 데이터(`formData.getAll(name)`)는 네이티브 체크박스 때와 같다.
 *   감싸는 `<label>` 만으로는 span 에 이름이 잡히지 않아, 라벨 글자 id 를 `aria-labelledby` 로 직접 잇는다 — 접근 가능한
 *   이름도 이전과 같다(라벨 + 보조 텍스트).
 *
 * 근거: ADS 체크박스 해부도(컨트롤 + 라벨이 하나의 히트 영역, 우측에 보조 정보).
 *
 * 해부도
 *   <fieldset><legend/>
 *     <label> [Checkbox] [라벨]                    [보조] </label>
 *     <label> [Checkbox] [라벨]                    [보조] </label>
 *   </fieldset>
 *
 * 토큰
 *   행 배경 --color-muted · hover --color-accent · 곡률 --radius-full · 패딩 px-2 py-1.5
 *   선택 행 --color-selected
 *   체크박스 — primitive: 테두리 --color-input · 체크 시 --color-primary 면 + --color-primary-foreground ✓
 *   포커스 — primitive: ring-3 --color-ring/50
 *   보조 --text-xs + --color-charcoal · 비활성 글자 --color-mute
 *
 * 상태
 *   미선택 / 선택 / hover / focus-visible / 비활성
 *   행 배경은 **안쪽 Checkbox 의 `data-checked` 로 현재 상태에서 계산**한다(`has-data-checked:`).
 *   두 모드가 같은 경로를 쓴다. `selected` 배열로 배경을 정하면 비제어 모드에서
 *   배경이 초기 선택에 고정돼, 체크는 토글되는데 행 색은 그대로인 결함이 난다.
 *
 * 제어 / 비제어
 *   `onToggle` 을 주면 `selected` 가 값을 지배한다(제어 — `checked` + `onCheckedChange`).
 *   주지 않으면 Checkbox 가 상태를 들고 `selected` 는 초기값이 된다(비제어 —
 *   `defaultChecked`) — 서버 액션 폼에서 이 모드를 쓴다. 서버 컴포넌트에서 이벤트
 *   핸들러를 만들 필요가 없다.
 *   비제어 모드에서는 초기값이 바뀌면(저장 후 재검증·다른 대상으로 이동) 그 행의
 *   Checkbox 를 새 초기값으로 다시 마운트한다(key 에 초기값 포함). 네이티브 체크박스가
 *   `defaultChecked` 변경을 따라가던 동작을 Base UI 의 내부 상태에서도 유지하기 위해서다.
 *
 * 키보드·ARIA
 *   라벨이 컨트롤을 감싸므로 **라벨과 체크박스가 하나의 히트 영역**이다(ADS 요구사항).
 *   Space 로 토글(primitive). 그룹 이름은 <fieldset>/<legend> 가 만든다.
 *   숨은 네이티브 input 은 aria-hidden 이라 체크박스가 두 번 읽히지 않는다.
 *
 * 수용 기준
 *   - 라벨 아무 곳이나 눌러도 토글된다.
 *   - 선택 상태가 체크 표시와 배경 **둘 다**로 보인다.
 *   - 제어·비제어 어느 모드에서든 토글 즉시 행 배경이 따라 바뀐다.
 *   - 체크한 값만 `name` 으로 제출된다(자바스크립트 없는 서버 액션 폼 포함).
 */
export type CheckboxOption = {
  value: string;
  label: React.ReactNode;
  /** 우측 보조 정보. */
  meta?: React.ReactNode;
  disabled?: boolean;
};

export function CheckboxList({
  legend,
  name,
  options,
  selected,
  onToggle,
  className,
}: {
  /** 그룹 이름. 시각적으로도 보인다. */
  legend: React.ReactNode;
  name: string;
  options: readonly CheckboxOption[];
  /** 제어 모드에서는 현재 선택, 비제어 모드에서는 초기 선택. */
  selected: readonly string[];
  onToggle?: (value: string, checked: boolean) => void;
  className?: string;
}) {
  return (
    <fieldset className={cn("flex flex-col gap-1.5", className)}>
      <legend className="mb-1 text-xs font-semibold text-charcoal">
        {legend}
      </legend>

      {options.map((option) => {
        const checked = selected.includes(option.value);
        // Base UI Checkbox 는 <span role="checkbox"> 라 감싸는 <label> 만으로는 이름이
        // 잡히지 않는다(axe aria-toggle-field-name). 라벨 글자에 id 를 주고 직접 잇는다.
        const labelId = `${name}-${option.value}-label`.replace(/[^A-Za-z0-9_-]/g, "_");
        return (
          <label
            key={option.value}
            className={cn(
              "flex cursor-pointer items-center gap-2 rounded-full px-2 py-1.5 text-base",
              "bg-muted text-foreground hover:bg-accent",
              // 행 배경은 안쪽 Checkbox 의 현재 상태(data-checked)를 따라간다.
              // hover 와 선택은 같은 특이도라 순서에 좌우된다. 선택 위에 hover 를
              // 겹쳐 써서(특이도 +1) 선택된 행이 hover 색으로 덮이지 않게 고정한다.
              "has-data-checked:bg-selected has-data-checked:hover:bg-selected",
              option.disabled ? "cursor-default text-mute" : undefined,
            )}
          >
            <Checkbox
              // 비제어 모드에서만 초기값이 바뀌면 다시 마운트한다(위 "제어 / 비제어").
              key={onToggle ? "controlled" : checked ? "on" : "off"}
              {...(onToggle
                ? {
                    checked,
                    onCheckedChange: (next: boolean) =>
                      onToggle(option.value, next),
                  }
                : { defaultChecked: checked })}
              name={name}
              value={option.value}
              disabled={option.disabled}
              aria-labelledby={labelId}
              className="data-disabled:bg-muted"
            />
            <span id={labelId} className="min-w-0 flex-1 truncate">
              {option.label}
            </span>
            {option.meta ? (
              <span className="shrink-0 text-xs text-charcoal">
                {option.meta}
              </span>
            ) : null}
          </label>
        );
      })}
    </fieldset>
  );
}
