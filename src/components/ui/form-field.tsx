import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"

/**
 * FormField — 라벨·도움말·오류를 한 번에 받는 폼 행 (shadcn Field 조립)
 *
 * 해부도
 *   <Field>
 *     <FieldLabel>라벨 [필수]</FieldLabel>
 *     컨트롤(children)
 *     <FieldDescription>도움말</FieldDescription> | <FieldError>오류</FieldError>
 *   </Field>
 *   라벨이 컨트롤을 감싸므로(label 요소) id 없이도 접근 가능한 이름이 생긴다.
 *
 * 토큰
 *   shadcn Field 그대로 — 라벨 text-sm font-medium · 도움말 text-muted-foreground ·
 *   오류 text-destructive · 필수 표시 text-destructive
 *
 * 상태
 *   기본 / 필수 / 오류(data-invalid) / 비활성은 컨트롤이 가진다
 *
 * 키보드·ARIA
 *   오류가 있으면 Field 에 data-invalid, 오류 문구는 aria-live="polite".
 *   "필수"는 보이는 글자라 접근 가능한 이름에 포함된다.
 *
 * 수용 기준
 *   - 오류가 있으면 도움말 대신 오류만 보인다.
 */
export type FormFieldProps = {
  label: React.ReactNode
  required?: boolean
  hint?: React.ReactNode
  error?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function FormField({
  label,
  required = false,
  hint,
  error,
  children,
  className,
}: FormFieldProps) {
  // 라벨이 컨트롤을 감싼다 — 기존 화면과 접근 가능한 이름이 같다("라벨 필수").
  // 도움말·오류는 블록 요소(p·div)라 label 밖에 둔다(label 은 phrasing 콘텐츠만 허용).
  return (
    <Field data-invalid={error ? true : undefined} className={className}>
      <FieldLabel className="flex w-full flex-col items-stretch gap-1.5">
        <span className="flex flex-wrap items-baseline gap-2">
          <span className="text-sm font-medium text-charcoal">{label}</span>
          {required ? (
            <span className="text-sm font-medium text-destructive">필수</span>
          ) : null}
        </span>
        {children}
      </FieldLabel>
      {error ? (
        <FieldError aria-live="polite">{error}</FieldError>
      ) : hint ? (
        <FieldDescription>{hint}</FieldDescription>
      ) : null}
    </Field>
  )
}
