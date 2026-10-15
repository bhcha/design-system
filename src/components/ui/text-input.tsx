import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea as TextareaPrimitive } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

/**
 * TextInput · Textarea · Select — 기본 폼 컨트롤
 *
 * 바탕 primitive (shadcn/ui base-nova)
 *   TextInput → `Input`        (Base UI Input — 네이티브 `<input>` 을 그린다)
 *   Textarea  → `Textarea`     (네이티브 `<textarea>`)
 *   Select    → `NativeSelect` (네이티브 `<select>` + 표시자 아이콘)
 *   세 primitive 모두 네이티브 요소를 그대로 쓰므로 폼 제출(name/value)·역할
 *   (textbox·combobox)·라벨 연결이 이전과 같다. 이 파일은 그 위에 `invalid`·
 *   `size="compact"` 라는 기존 API 와 앱 규칙(비활성 전용 mute 등)만 얹는다.
 *
 * 근거: design.md {component.text-input} — 배경 canvas · 1px hairline · {rounded.full} ·
 * {typography.body-md} 16px · padding 8px 16px · 높이 40px. 포커스 시 1px ink 테두리 +
 * focus ring({component.text-input-focused}).
 *
 * 해부도
 *   [ 값 / placeholder ]  — 1px 테두리 pill (Input)
 *   Select 는 NativeSelect 가 오른쪽 끝에 [ ▾ 표시자 ] 를 하나 더 그린다(장식, aria-hidden).
 *   Textarea 는 여러 줄이라 pill 대신 {rounded.lg} 를 쓴다(design.md 적용 차이 6).
 *
 * 토큰 (primitive 기본값 + 이 파일의 보정)
 *   배경 --color-background · 테두리 --color-input(=hairline, 포커스 --color-foreground) · 곡률 --radius-full
 *   포커스 링 ring-3 --color-ring/50 (primitive)
 *   텍스트 --text-base + --color-foreground · placeholder --color-muted-foreground(body)
 *   Select 표시자 --color-muted-foreground
 *   오류 테두리 --color-destructive(= status-danger 값) — `aria-invalid` 로 primitive 가 그린다
 *   비활성 배경 --color-muted + --color-mute(placeholder 포함) · 읽기 전용 배경 --color-muted
 *
 * 상태
 *   기본 / focus-visible(ink 테두리 + ring) / 오류(aria-invalid) / 비활성 / 읽기 전용
 *
 * 키보드·ARIA
 *   접근 가능한 이름은 Field(FormField)가 라벨로 감싸서 만든다. 여기서 aria-label 을
 *   강제하지 않는 이유는 라벨 없는 사용을 막는 책임이 Field 에 있기 때문이다.
 *   `invalid` 를 주면 `aria-invalid` 가 붙고, primitive 가 그 속성으로 오류 테두리를 그린다.
 *   붙여넣기를 막지 않는다.
 *
 * primitive 와 다르게 둔 점
 *   - Textarea: shadcn 원본의 `field-sizing-content` 는 `rows` 를 무시하고 내용 높이로
 *     줄어든다. 기존 API 의 `rows`(기본 4)가 높이를 정하도록 `field-sizing-fixed` 로 되돌린다.
 *   - Select: NativeSelect 의 바깥 상자는 `w-fit` 이다. 기존 Select 는 폭이 꽉 찼으므로
 *     `w-full` 을 기본으로 둔다. `className` 은 이전처럼 그 바깥 상자에 붙는다.
 *     안쪽 `<select>` 의 비활성 배경은 바깥 상자에서 자손 선택자로 준다.
 *   - size: 기존 "compact" 는 NativeSelect 의 "sm"(h-8) 에 대응한다.
 *
 * 수용 기준
 *   - 기본 높이 40px, compact 32px(design.md 적용 차이 5), 곡률 9999px.
 *   - 오류 상태가 테두리 색 **하나에만** 기대지 않는다(Field 의 오류 문구와 함께 쓴다).
 *   - Select 가 TextInput 과 시각적으로 구별된다(드롭다운 표시자가 보인다).
 *   - --color-mute 는 비활성 상태에서만 나타난다.
 *   - 세 컨트롤 모두 네이티브 요소라 자바스크립트 없이 폼으로 제출된다.
 */

/** 앱 규칙 보정 — placeholder 는 비활성일 때만 mute 로, 읽기 전용은 soft 배경. */
const CONTROL_EXTRA =
  "text-foreground disabled:placeholder:text-mute read-only:bg-muted";

export type TextInputProps = Omit<React.ComponentProps<"input">, "size"> & {
  invalid?: boolean;
  size?: "default" | "compact";
};

export function TextInput({
  className,
  invalid,
  size = "default",
  type = "text",
  ...props
}: TextInputProps) {
  return (
    <Input
      type={type}
      aria-invalid={invalid || undefined}
      className={cn(
        CONTROL_EXTRA,
        size === "compact" ? "h-8 px-3 text-sm" : undefined,
        className,
      )}
      {...props}
    />
  );
}

export type TextareaProps = React.ComponentProps<"textarea"> & {
  invalid?: boolean;
};

export function Textarea({ className, invalid, rows = 4, ...props }: TextareaProps) {
  return (
    <TextareaPrimitive
      rows={rows}
      aria-invalid={invalid || undefined}
      className={cn(CONTROL_EXTRA, "field-sizing-fixed", className)}
      {...props}
    />
  );
}

export type SelectProps = Omit<React.ComponentProps<"select">, "size"> & {
  invalid?: boolean;
  size?: "default" | "compact";
};

/**
 * shadcn `NativeSelect` 위의 Select. 커스텀 리스트박스(Base UI Select)보다 모바일·
 * 스크린 리더 동작이 확실하고, 네이티브 폼 제출이 그대로 유지돼 서버 액션 폼에서 쓴다.
 * 표시자는 NativeSelect 가 그리며 장식(aria-hidden)이고 클릭을 가로채지 않는다.
 */
export function Select({
  className,
  invalid,
  size = "default",
  children,
  ...props
}: SelectProps) {
  return (
    <NativeSelect
      size={size === "compact" ? "sm" : "default"}
      aria-invalid={invalid || undefined}
      className={cn(
        "w-full text-foreground",
        // 안쪽 <select> 의 비활성 배경 — 바깥 상자에서 자손으로 준다.
        "[&_select:disabled]:bg-muted",
        className,
      )}
      {...props}
    >
      {children}
    </NativeSelect>
  );
}
