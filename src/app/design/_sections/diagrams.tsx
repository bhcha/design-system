import { FlowSteps, type FlowStep } from "@/components/ui/flow-steps";
import { Lozenge } from "@/components/ui/lozenge";
import { MillerColumns, MillerItemLink, type MillerColumn } from "@/components/ui/miller-columns";
import { MillerNavigator } from "@/components/ui/miller-navigator";
import { SearchInput } from "@/components/ui/search-input";
import { StageFlow, type StageCard } from "@/components/ui/stage-flow";
import { Section, Specimen } from "../_catalog";

/** 카탈로그 전시용 가상 데이터 — 워크스페이스 "Sample" 의 프로젝트 → 마일스톤 → 작업. */

const RELEASE_STEPS: FlowStep[] = [
  { id: "f1", label: "MS-01", value: "요구사항", hint: "승인", tone: "neutral" },
  { id: "f2", label: "MS-02", value: "시안", hint: "검토 중", tone: "current" },
  { id: "f3", label: "MS-03", value: "구현", hint: "리뷰어 확인 필요", tone: "warn" },
  { id: "f4", label: "MS-04", value: "릴리스", hint: "아직 시작 전", tone: "dim" },
];

const STATUS_STEPS: FlowStep[] = [
  { id: "c1", label: "초안", count: 5 },
  { id: "c2", label: "검토 중", count: 2, tone: "current" },
  { id: "c3", label: "확인 필요", count: 1, tone: "warn" },
  { id: "c4", label: "승인", count: 8 },
  { id: "c5", label: "보관", count: 0, tone: "dim" },
];

const LINK_STEPS: FlowStep[] = [
  { id: "l1", label: "요구사항 정리", href: "/design#diagrams" },
  { id: "l2", label: "시안 작성", href: "/design#diagrams", tone: "current" },
  { id: "l3", label: "구현·리뷰", href: "/design#diagrams" },
];

const MILESTONE_CARDS: StageCard[] = [
  {
    id: "st1",
    overline: "01 · MS-01",
    title: "요구사항 정리",
    statuses: [{ label: "승인", tone: "ok" }],
    children: "작업 4 · 완료 조건: 요구사항 문서 확정",
  },
  {
    id: "st2",
    overline: "02 · MS-02",
    title: "시안 작성",
    statuses: [
      { label: "검토 중", tone: "info" },
      { label: "확인 필요 1", tone: "warn" },
    ],
    children: "작업 6 · 리뷰 대기 중",
    highlighted: true,
  },
  {
    id: "st3",
    overline: "03 · MS-03",
    title: "구현·리뷰",
    statuses: [{ label: "초안" }],
    children: "작업 9 · 시작 조건: 시안 승인",
  },
  {
    id: "st4",
    overline: "04 · MS-04",
    title: "릴리스",
    statuses: [{ label: "보관", tone: "neutral" }],
  },
];

const MILLER_COLUMNS: MillerColumn[] = [
  {
    id: "dg-col-project",
    title: "프로젝트",
    selectedId: "PRJ-02",
    items: [
      {
        id: "PRJ-01",
        overline: "PRJ-01",
        label: "웹 대시보드 개편",
        meta: "마일스톤 3",
        badge: <Lozenge>초안</Lozenge>,
      },
      {
        id: "PRJ-02",
        overline: "PRJ-02",
        label: "온보딩 흐름 개선",
        meta: "마일스톤 4",
        badge: <Lozenge tone="info">검토 중</Lozenge>,
      },
      {
        id: "PRJ-03",
        overline: "PRJ-03",
        label: "알림 설정 통합",
        meta: "마일스톤 2",
        badge: <Lozenge tone="warn">확인 필요</Lozenge>,
      },
    ],
  },
  {
    id: "dg-col-milestone",
    title: "마일스톤",
    selectedId: "MS-02",
    items: [
      {
        id: "MS-01",
        overline: "MS-01",
        label: "요구사항 정리",
        badge: <Lozenge tone="ok">승인</Lozenge>,
      },
      {
        id: "MS-02",
        overline: "MS-02",
        label: "시안 작성",
        badge: <Lozenge tone="info">검토 중</Lozenge>,
      },
    ],
  },
  {
    id: "dg-col-task",
    title: "작업",
    total: 6,
    search: (
      <SearchInput label="작업 검색" labelHidden defaultValue="시안" className="w-full" />
    ),
    items: [
      { id: "TSK-03", overline: "TSK-03", label: "홈 화면 시안", meta: "디자이너" },
      { id: "TSK-04", overline: "TSK-04", label: "설정 화면 시안", meta: "디자이너" },
    ],
  },
  {
    id: "dg-col-review",
    title: "리뷰",
    items: [],
    emptyMessage: "선택한 작업에 아직 리뷰가 없습니다.",
  },
];

const NAV_COLUMNS: MillerColumn[] = MILLER_COLUMNS.map((column) => ({
  ...column,
  id: `${column.id}-nav`,
  search: undefined,
  total: undefined,
}));

export function DiagramsSection() {
  return (
    <Section
      id="diagrams"
      title="흐름·계층 다이어그램"
      note="순서가 있는 단계는 FlowSteps(한두 줄) · StageFlow(카드), 계층 탐색은 MillerColumns 다. 다이어그램은 좁은 폭에서 목록으로 접히지 않고 가로 스크롤한다."
    >
      <Specimen
        name="flow-steps.tsx"
        state="full · 기본 / 강조 / 경고 / 흐림"
        span
        note="현재 단계는 aria-current 로 알린다 — 색에만 기대지 않는다."
      >
        <FlowSteps label="Sample 웹 개편 마일스톤" steps={RELEASE_STEPS} className="w-full" />
      </Specimen>

      <Specimen
        name="flow-steps.tsx"
        state="compact · 카운트 · 구분자 변경"
        span
      >
        <FlowSteps
          label="상태별 작업 수"
          density="compact"
          separator="→"
          steps={STATUS_STEPS}
          className="w-full"
        />
      </Specimen>

      <Specimen
        name="flow-steps.tsx"
        state="compact · 링크 단계 / 현재 위치"
        span
        note="href 가 있으면 단계 상자 전체가 링크다. 현재 단계는 aria-current=&quot;page&quot;."
      >
        <FlowSteps
          label="마일스톤 이동"
          density="compact"
          steps={LINK_STEPS}
          className="w-full"
        />
      </Specimen>

      <Specimen
        name="stage-flow.tsx"
        state="기본 / 강조 / 상태 여럿 / 본문 없음"
        span
        note="카드 폭은 고정이고 영역 전체가 키보드로 스크롤된다."
      >
        <StageFlow label="Sample 웹 개편 마일스톤 카드" stages={MILESTONE_CARDS} />
      </Specimen>

      <Specimen
        name="miller-columns.tsx"
        state="선택 / 열 검색(보이는/전체) / 빈 열"
        span
        note="기본 렌더러는 표시 전용이다. 선택의 정본은 URL 이고, 이동은 호출부가 renderItem 으로 넣는다."
      >
        <MillerColumns label="프로젝트 계층 (표시 전용)" columns={MILLER_COLUMNS} />
      </Specimen>

      <Specimen
        name="miller-navigator.tsx"
        state="열 너비 손잡이 / 초기화 / 좁은 화면 이동 바"
        span
        note="xl 이상에서는 열 사이 손잡이를 끌거나 ←→ 로 열 너비를 바꾸고, 그 아래 폭에서는 이동 바로 열을 넘긴다. 항목은 MillerItemLink(링크)라 ↑↓ 로 열 안을, ←→ 로 열 사이를 이동한다."
      >
        <MillerNavigator titles={NAV_COLUMNS.map((column) => column.title)} className="w-full">
          <MillerColumns
            label="프로젝트 계층 (탐색)"
            columns={NAV_COLUMNS}
            renderItem={(item, column) => (
              <MillerItemLink
                href={`/design?item=${item.id}#diagrams`}
                item={item}
                selected={item.id === column.selectedId}
              />
            )}
          />
        </MillerNavigator>
      </Specimen>
    </Section>
  );
}
