"use client";

import { useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { cn } from "@/lib/utils";

/**
 * RichTextEditor — 문서 본문 편집기
 *
 * 근거: 최소 WYSIWYG 편집기 패턴. ADS 에 대응 패턴이 없다. 시각 값은 design.md 토큰.
 *
 * 바탕 primitive (shadcn/ui base-nova)
 *   도구 모음 → `ButtonGroup`(role 을 "toolbar" 로 덮어 씀) + `Button`(variant="outline" size="sm").
 *   도구는 **동작**(execCommand 한 번)이지 켜고 끄는 상태가 아니므로 Toggle 이 아니라
 *   Button 이다 — 현재 서식 상태를 추적하지 않는데 aria-pressed 를 붙이면 거짓 상태가 된다.
 *   편집 영역은 primitive 가 없다(contenteditable). Textarea 와 같은 테두리·곡률 토큰을 쓴다.
 *
 * 범위 제한
 *   **문서 구조 6종**(굵게 · 기울임 · 소제목 · 글머리 · 번호 · 인용)만
 *   지원한다. 색·크기 같은 시각 서식은 넣지 않는다 — 서식이 토큰을 우회하는 통로가
 *   되기 때문이다. 본문은 Markdown 으로 저장하는 것을 전제로 하므로 구조만 있으면 충분하다.
 *
 * 해부도
 *   ButtonGroup( [굵게][기울임][소제목][글머리][번호][인용] )   ← 도구 모음(이어 붙인 pill)
 *   ┌──────────────────────────────────────┐
 *   │ [편집 영역 — contenteditable]        │
 *   └──────────────────────────────────────┘
 *
 * 토큰
 *   도구 버튼 — Button outline sm: 32px · 14px/500 · 1px --color-hairline-strong · hover --color-muted
 *   도구 모음 양 끝 곡률 --radius-full — ButtonGroup 원본은 마지막 버튼 오른쪽을
 *   rounded-lg 로 깎는데, 첫 버튼(왼쪽)이 pill 이라 양 끝이 어긋나므로 pill 로 맞춘다.
 *   편집 영역 배경 --color-background · 테두리 --color-border · 곡률 --radius-lg(여러 줄 영역 — design.md 적용 차이 6)
 *   최소 높이 min-h-64(256px) · 패딩 p-4 · 본문 --text-base
 *
 * 상태
 *   기본 / focus-visible(도구: ring-3 --color-ring/50 · 편집 영역: 전역 outline) / 비활성
 *
 * 키보드·ARIA
 *   편집 영역은 `role="textbox" aria-multiline="true"` 이고 `aria-label` 이 필수다.
 *   도구 모음은 `role="toolbar"` + `aria-label="문서 서식"`(ButtonGroup 의 role="group" 을 덮는다).
 *   각 버튼에 텍스트 라벨이 있어 아이콘만인 버튼이 없다.
 *   붙여넣기를 막지 않는다.
 *
 * 알려진 제약
 *   `document.execCommand` 는 비표준이지만 브라우저가 모두 구현하고 있어
 *   가장 작은 구현으로 충분하다. 저장 형식이 확정되면(Markdown 직렬화) 이 부분을 교체한다.
 *
 * 수용 기준
 *   - aria-label 없이 컴파일되지 않는다.
 *   - 도구 버튼이 편집 영역의 포커스를 뺏지 않는다(mousedown 기본 동작 차단).
 */
const COMMANDS = [
  { id: "bold", label: "굵게", command: "bold", value: undefined },
  { id: "italic", label: "기울임", command: "italic", value: undefined },
  { id: "h3", label: "소제목", command: "formatBlock", value: "h3" },
  { id: "ul", label: "글머리", command: "insertUnorderedList", value: undefined },
  { id: "ol", label: "번호", command: "insertOrderedList", value: undefined },
  { id: "quote", label: "인용", command: "formatBlock", value: "blockquote" },
] as const;

export type RichTextEditorProps = {
  /** 편집 영역의 접근 가능한 이름. */
  "aria-label": string;
  /** 초기 HTML. 이후 값은 편집기가 직접 들고 있다(비제어). */
  defaultValue?: string;
  onInput?: (html: string) => void;
  /**
   * 주면 같은 이름의 숨은 input 을 함께 그려 폼 전송에 값이 실린다.
   * contentEditable 은 폼 데이터에 잡히지 않으므로 이 다리가 필요하다.
   */
  name?: string;
  className?: string;
};

export function RichTextEditor({
  "aria-label": ariaLabel,
  defaultValue = "",
  onInput,
  name,
  className,
}: RichTextEditorProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const mirrorRef = useRef<HTMLInputElement>(null);

  const sync = useCallback(
    (html: string) => {
      if (mirrorRef.current) mirrorRef.current.value = html;
      onInput?.(html);
    },
    [onInput],
  );

  const runCommand = useCallback(
    (command: string, value?: string) => {
      bodyRef.current?.focus();
      document.execCommand(command, false, value);
      sync(bodyRef.current?.innerHTML ?? "");
    },
    [sync],
  );

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <ButtonGroup
        role="toolbar"
        aria-label="문서 서식"
        // 마지막 버튼 오른쪽도 pill — 원본의 rounded-r-lg! 를 같은 선택자로 덮는다.
        className="[&>[data-slot]:not(:has(~[data-slot]))]:rounded-r-full!"
      >
        {COMMANDS.map((item) => (
          <Button
            key={item.id}
            variant="outline"
            size="sm"
            // 도구를 눌러도 편집 영역의 선택 영역이 유지돼야 한다.
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => runCommand(item.command, item.value)}
          >
            {item.label}
          </Button>
        ))}
      </ButtonGroup>

      <div
        ref={bodyRef}
        role="textbox"
        aria-multiline="true"
        aria-label={ariaLabel}
        contentEditable
        suppressContentEditableWarning
        onInput={(event) => sync(event.currentTarget.innerHTML)}
        dangerouslySetInnerHTML={{ __html: defaultValue }}
        className={cn(
          "min-h-64 w-full overflow-y-auto rounded-lg border border-border bg-background p-4",
          "text-base text-foreground",
        )}
      />

      {name ? (
        <input type="hidden" name={name} defaultValue={defaultValue} ref={mirrorRef} />
      ) : null}
    </div>
  );
}
