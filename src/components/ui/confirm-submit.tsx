"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type ButtonProps = React.ComponentProps<typeof Button>;

/**
 * ConfirmSubmit — 되돌리기 어려운 제출 앞의 확인 (`window.confirm` 대체)
 *
 * 왜 있는가
 *   승인 · 보관 · 삭제처럼 **상태를 바꾸는 제출**은 실행 전에 "무엇이 일어나는지"를
 *   문장으로 먼저 읽게 해야 한다. `window.confirm` 으로도 되지만 브라우저 기본 대화상자는 문구 서식도,
 *   포커스 반환도, 토큰도 우리 것이 아니므로 shadcn AlertDialog 로 대체한다.
 *
 * 폼 밖에서 폼을 제출한다
 *   확인 버튼은 Portal 안(폼 바깥)에 그려진다. `form` 속성으로 잇는 대신
 *   `requestSubmit()` 을 직접 부른다 — 확인 버튼을 누르는 순간 다이얼로그가 닫히면서
 *   버튼이 사라지는데, 그때 브라우저의 암시적 제출은 이미 취소된 뒤이기 때문이다.
 *   제출을 먼저 보내고 그다음에 닫는다.
 *
 * 해부도
 *   [트리거 버튼]  →  ┌ AlertDialog ─────────────────┐
 *                     │ [제목]                      │
 *                     │ [설명 · 무엇이 일어나는가]  │
 *                     │ [확인] [취소]               │
 *                     └─────────────────────────────┘
 *
 * 토큰
 *   전시 요소가 없다 — 트리거는 shadcn Button, 껍데기는 shadcn AlertDialog 토큰을 그대로 쓴다.
 *   확인 버튼의 variant 를 트리거와 맞춰 "무엇을 확정하는 버튼인지"가 이어지게 한다.
 *
 * 취소가 기본이다
 *   ESC · 백드롭 · [취소] 어느 쪽으로 닫아도 아무 일도 일어나지 않는다.
 *
 * 상태
 *   닫힘 / 열림 / 비활성(트리거가 disabled — 필수 항목이 비어 있는 승인 등)
 *
 * 키보드·ARIA
 *   Base UI AlertDialog 가 포커스 트랩과 트리거 포커스 반환을 처리한다(role="alertdialog"). 확인 버튼이 위험한 쪽이면
 *   호출부가 `confirmVariant` 로 구분한다.
 *
 * 수용 기준
 *   - 확인을 눌러야만 폼이 제출된다.
 *   - 취소하면 상태가 그대로다.
 */
export function ConfirmSubmit({
  formId,
  label,
  title,
  description,
  children,
  confirmLabel = "확인",
  cancelLabel = "취소",
  variant = "default",
  size,
  disabled,
}: {
  /** 제출할 `<form>` 의 id. */
  formId: string;
  /** 트리거 버튼 라벨. */
  label: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** 무엇이 일어나는지 풀어 쓴 본문. */
  children: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);

  const submit = () => {
    const form = document.getElementById(formId);
    if (form instanceof HTMLFormElement) form.requestSubmit();
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button type="button" variant={variant} size={size} disabled={disabled}>
            {label}
          </Button>
        }
      />
      <AlertDialogContent className="sm:max-w-reading">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description ? (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          ) : null}
        </AlertDialogHeader>
        <div className="flex flex-col gap-2 text-base text-charcoal">{children}</div>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction type="button" variant={variant} onClick={submit}>
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
