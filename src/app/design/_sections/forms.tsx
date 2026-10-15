"use client";

import { useState } from "react";
import { TextLink } from "@/components/ui/text-link";
import { Button } from "@/components/ui/button";
import { ConfirmSubmit } from "@/components/ui/confirm-submit";
import { FocusRestorer } from "@/components/ui/focus-restorer";
import { RovingFocus } from "@/components/ui/roving-focus";
import { CheckboxList } from "@/components/ui/checkbox-list";
import { ChoiceCard } from "@/components/ui/choice-card";
import { FormField } from "@/components/ui/form-field";
import { HiddenField } from "@/components/ui/hidden-field";
import { RadioCard } from "@/components/ui/radio-card";
import { OptionChip } from "@/components/ui/option-chip";
import { OrderList } from "@/components/ui/order-list";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { SearchInput } from "@/components/ui/search-input";
import { TabPanel, LinkTabs } from "@/components/ui/link-tabs";
import { Select, Textarea, TextInput } from "@/components/ui/text-input";
import { Grid, Section, Specimen } from "../_catalog";

const STAGES = [
  {
    id: "s1",
    label: "요구사항 정리",
    seam: { ok: true, message: "완료 조건(요구사항 문서) = 다음 시작 조건" },
  },
  {
    id: "s2",
    label: "시안 작성",
    seam: { ok: false, message: "완료 조건이 확인 필요 — 다음 시작 조건과 대조 불가" },
  },
  { id: "s3", label: "구현·리뷰" },
];

export function FormsSection() {
  const [checked, setChecked] = useState<string[]>(["task-1"]);
  const [decision, setDecision] = useState("existing");
  const [filter, setFilter] = useState("draft");
  const [order, setOrder] = useState(STAGES);

  function move(id: string, direction: -1 | 1) {
    setOrder((current) => {
      const index = current.findIndex((item) => item.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  return (
    <Section
      id="forms"
      title="입력·편집"
      note="한 줄 컨트롤은 design.md pill(입력 40px · 검색 36px · 버튼 36px), 여러 줄 영역은 rounded.lg. 값은 전부 design.md 토큰."
    >
      <Grid>
        <Specimen name="field.tsx · text-input.tsx" state="기본 / 필수 / 오류 / 비활성">
          <div className="flex w-full flex-col gap-3">
            <FormField label="프로젝트 이름" hint="동사-명사로 짧게 적습니다.">
              <TextInput placeholder="예: 웹 대시보드 개편…" />
            </FormField>
            <FormField label="담당" required>
              <TextInput placeholder="이 프로젝트를 맡는 역할…" />
            </FormField>
            <FormField label="완료 기준" required error="입력되지 않았습니다. 확인 필요로 남깁니다.">
              <TextInput invalid defaultValue="" />
            </FormField>
            <FormField label="프로젝트 ID">
              <TextInput defaultValue="PRJ-01" disabled />
            </FormField>
          </div>
        </Specimen>

        <Specimen name="text-input.tsx" state="Textarea / Select / compact">
          <div className="flex w-full flex-col gap-3">
            <FormField label="설명">
              <Textarea placeholder="이 프로젝트가 무엇을 하는지…" />
            </FormField>
            <FormField label="소속 프로젝트" required>
              <Select defaultValue="PRJ-02">
                <option value="PRJ-01">PRJ-01 웹 대시보드 개편</option>
                <option value="PRJ-02">PRJ-02 온보딩 흐름 개선</option>
              </Select>
            </FormField>
            <FormField label="코드 (compact)">
              <TextInput size="compact" defaultValue="TSK-03" />
            </FormField>
          </div>
        </Specimen>

        <Specimen
          name="search-input.tsx · {component.search-input}"
          state="기본 / 값 있음 / 비활성"
        >
          <SearchInput
            label="프로젝트 검색"
            placeholder="이름이나 코드로 검색…"
            className="w-64"
          />
          <SearchInput
            label="검색 (값 있음)"
            labelHidden
            defaultValue="온보딩"
            className="w-64"
          />
          <SearchInput
            label="검색 (비활성)"
            labelHidden
            placeholder="검색…"
            disabled
            className="w-64"
          />
        </Specimen>

        <Specimen
          name="option-chip.tsx · {component.configurator-option-chip} · {component.configurator-option-chip-selected}"
          state="기본 / 선택 / compact + 카운트 / 비활성"
        >
          <div className="flex w-full flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              <OptionChip>디자인 팀</OptionChip>
              <OptionChip selected>디자인 팀</OptionChip>
              <OptionChip disabled>디자인 팀</OptionChip>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "draft", label: "초안", count: 5 },
                { id: "ready", label: "승인", count: 1 },
                { id: "archived", label: "보관", count: 2 },
              ].map((item) => (
                <OptionChip
                  key={item.id}
                  size="compact"
                  count={item.count}
                  selected={filter === item.id}
                  onClick={() => setFilter(item.id)}
                >
                  {item.label}
                </OptionChip>
              ))}
            </div>
          </div>
        </Specimen>

        <Specimen name="checkbox-list.tsx" state="선택 / 미선택 / 비활성">
          <CheckboxList
            className="w-full"
            legend="이 마일스톤에 포함할 작업"
            name="design-tasks"
            options={[
              { value: "task-1", label: "요구사항 정리", meta: "TSK-01" },
              { value: "task-2", label: "시안 작성", meta: "TSK-02" },
              { value: "task-3", label: "릴리스 노트", meta: "TSK-03", disabled: true },
            ]}
            selected={checked}
            onToggle={(value, isChecked) =>
              setChecked((current) =>
                isChecked
                  ? [...current, value]
                  : current.filter((item) => item !== value),
              )
            }
          />
        </Specimen>

        <Specimen
          name="radio-card.tsx"
          state="폼 제출용 라디오 · 선택 / 미선택 / 비활성"
          note="ChoiceCard 의 시각을 네이티브 라디오 위에 얹은 것. 라벨 안에 버튼을 넣으면 클릭이 라디오에 닿지 않아 이 형태가 필요하다."
        >
          <fieldset className="flex w-full flex-col gap-2">
            <legend className="mb-1 text-xs font-semibold text-charcoal">
              이 작업의 다음 단계
            </legend>
            <RadioCard
              name="design-next"
              value="undecided"
              defaultChecked
              title="미정"
              description="이 작업을 다음에 어떻게 처리할지 아직 정하지 않았습니다."
            />
            <RadioCard
              name="design-next"
              value="archive"
              title="보관"
              description="작업을 닫고 기록으로 남깁니다. 언제든 다시 열 수 있습니다."
            />
            <RadioCard
              name="design-next"
              value="review"
              disabled
              title="리뷰 요청 (비활성 예시)"
              description="리뷰어를 지정해야 요청할 수 있습니다."
            />
          </fieldset>
        </Specimen>

        <Specimen
          name="hidden-field.tsx"
          state="보이지 않음"
          note="폼과 함께 실려가는 값. 화면에서 raw <input> 을 쓰지 못하게 막는 규칙의 유일한 통로다."
        >
          <div className="w-full text-xs text-charcoal">
            아래에 <code className="font-mono">kind=project</code> 값이 숨어 있다 —
            시각적으로도 접근성 트리에도 나타나지 않는다.
            <HiddenField name="design-kind" value="project" />
          </div>
        </Specimen>

        <Specimen name="choice-card.tsx" state="radio · 선택 / 미선택 / 비활성">
          <div
            role="radiogroup"
            aria-label="마일스톤 연결 방식"
            className="flex w-full flex-col gap-2"
          >
            <ChoiceCard
              mode="radio"
              selected={decision === "existing"}
              onClick={() => setDecision("existing")}
              title="기존 마일스톤에 연결"
              description="이미 승인된 마일스톤 아래에 작업을 둡니다."
            />
            <ChoiceCard
              mode="radio"
              selected={decision === "none"}
              onClick={() => setDecision("none")}
              title="연결하지 않음 — 확인 필요로 기록"
              description="맞는 마일스톤이 아직 없음을 상태로 남깁니다. 빈 마일스톤을 임시로 만들지 않습니다."
            />
            <ChoiceCard
              mode="radio"
              disabled
              title="자동 배정"
              description="화면은 연결 방식을 자동으로 고르지 않습니다."
            />
          </div>
        </Specimen>
      </Grid>

      <Specimen
        name="order-list.tsx"
        state="첫·마지막 비활성 / 이음매 일치·불일치"
        span
        note="앞 단계의 완료 조건 = 다음 단계의 시작 조건. 불일치는 오류가 아니라 확인이 필요한 자리라 warn 톤이다."
      >
        <OrderList className="w-full" items={order} onMove={move} />
      </Specimen>

      <Specimen
        name="tabs.tsx"
        state="선택 / 미선택"
        span
        note="useState 가 아니라 링크다. ?tab= 이 URL 에 남아 새로고침·딥링크·중클릭이 모두 동작한다."
      >
        <div className="w-full">
          <LinkTabs
            label="프로젝트 상세 보기"
            current="over"
            items={[
              { value: "over", label: "개요", href: "/design?tab=over#forms" },
              { value: "diagram", label: "다이어그램", href: "/design?tab=diagram#forms" },
            ]}
          />
          <TabPanel value="over">
            <p className="text-base text-charcoal">
              선택된 탭의 콘텐츠가 tabpanel 시맨틱으로 감싸진다.
            </p>
          </TabPanel>
        </div>
      </Specimen>

      <Specimen
        name="confirm-submit.tsx"
        state="기본 / 비활성"
        span
        note="승인·보관처럼 상태를 바꾸는 제출 앞에만 쓴다. 확인 버튼은 폼 밖(Portal)에 있어 requestSubmit() 으로 제출한다."
      >
        <div className="flex flex-wrap gap-2">
          <ConfirmSubmit
            formId="design-confirm-demo"
            label="리뷰 요청 — 검토 중"
            title="MS-02 를 리뷰에 올릴까요?"
            description="리뷰 요청은 검토 시작이지 승인이 아닙니다."
            confirmLabel="요청한다"
          >
            <p>요청하면 리뷰 대기열에 오릅니다. 승인은 리뷰어만 할 수 있습니다.</p>
          </ConfirmSubmit>
          <ConfirmSubmit
            formId="design-confirm-demo"
            label="리뷰 요청 — 확인 필요 남음"
            disabled
            title="요청할 수 없습니다"
            confirmLabel="요청한다"
          >
            <p>확인 필요 항목이 0이 될 때까지 요청할 수 없습니다.</p>
          </ConfirmSubmit>
        </div>
      </Specimen>

      <Specimen
        name="roving-focus.tsx"
        state="세로 목록"
        span
        note="↑↓ Home End 로 목록 안을 돌고 Tab 은 목록을 통째로 넘긴다. 링크 목록이라 방향키는 포커스만 옮기고 확정은 Enter 가 한다."
      >
        <RovingFocus>
          <nav aria-label="팀 선택 예시" className="flex flex-col gap-2">
            <TextLink href="/design#forms">
              전체 팀
            </TextLink>
            <TextLink href="/design#forms">
              디자인 팀
            </TextLink>
            <TextLink href="/design#forms">
              프론트엔드 팀
            </TextLink>
          </nav>
        </RovingFocus>
      </Specimen>

      <Specimen
        name="focus-restorer.tsx"
        state="대상 없음"
        note="검색 제출로 화면이 다시 그려진 직후 그 검색 칸으로 포커스를 돌려준다. 아무것도 그리지 않는 컴포넌트라 여기서는 대상 없이 전시한다."
      >
        <div className="flex flex-col gap-1">
          <FocusRestorer />
          <p className="text-xs text-charcoal">
            target 이 없으면 포커스를 건드리지 않는다.
          </p>
        </div>
      </Specimen>

      <Specimen
        name="rich-text-editor.tsx"
        state="기본"
        span
        note="문서 구조 6종만 지원한다. 색·크기 서식은 토큰을 우회하는 통로라 넣지 않았다."
      >
        <div className="w-full">
          <RichTextEditor
            aria-label="리뷰 노트 본문"
            defaultValue="<h3>MS-02 리뷰 노트</h3><ol><li>이 작업은 무엇으로 시작합니까?</li><li>끝났다는 것은 무엇으로 압니까?</li></ol>"
          />
          <div className="mt-3 flex gap-2">
            <Button>노트 저장</Button>
            <Button variant="outline">취소</Button>
          </div>
        </div>
      </Specimen>
    </Section>
  );
}
