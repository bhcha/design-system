"use client";

import { CountBadge } from "@/components/ui/count-badge";
import { type DataGridColumn } from "@/components/ui/data-grid";
import { SelectableDataGrid } from "@/components/ui/data-grid-selectable";
import { DataTable } from "@/components/ui/data-table";
import { DefinitionList } from "@/components/ui/definition-list";
import { EmptyState } from "@/components/ui/empty-state";
import { GapChecklist } from "@/components/ui/gap-checklist";
import { Lozenge } from "@/components/ui/lozenge";
import { Chip, ChipLink } from "@/components/ui/option-chip";
import { Grid, Section, Specimen } from "../_catalog";

type ProjectRow = {
  id: string;
  name: string;
  summary: string;
  open: number;
  status: { label: string; tone: "neutral" | "ok" | "info" | "warn" | "danger" };
  archived?: boolean;
};

const PROJECT_ROWS: ProjectRow[] = [
  {
    id: "PRJ-01",
    name: "웹 대시보드 개편",
    summary: "흩어진 지표 화면을 한 대시보드로 모은다",
    open: 2,
    status: { label: "초안", tone: "neutral" },
  },
  {
    id: "PRJ-02",
    name: "온보딩 흐름 개선",
    summary: "가입 후 첫 작업까지 걸리는 단계를 줄인다",
    open: 0,
    status: { label: "검토 중", tone: "info" },
  },
  {
    id: "PRJ-03",
    name: "알림 설정 통합",
    summary: "메일·앱 알림 설정을 한 화면으로 합친다",
    open: 4,
    status: { label: "확인 필요", tone: "warn" },
  },
  {
    id: "PRJ-09",
    name: "구 리포트 화면",
    summary: "보관됨 — 상태 변경이지 삭제가 아니다",
    open: 0,
    status: { label: "보관", tone: "neutral" },
    archived: true,
  },
];

const COLUMNS: DataGridColumn<ProjectRow>[] = [
  {
    key: "id",
    header: "ID",
    className: "w-20 shrink-0",
    cell: (row) => (
      <span className="text-xs font-semibold text-primary">{row.id}</span>
    ),
  },
  {
    key: "name",
    header: "이름 · 설명",
    cell: (row) => (
      <span className="flex min-w-0 flex-col">
        <span className="truncate font-medium">{row.name}</span>
        <span className="truncate text-xs text-charcoal">{row.summary}</span>
      </span>
    ),
  },
  {
    key: "open",
    header: "미결",
    className: "w-12 shrink-0 text-right",
    cell: (row) => <CountBadge value={row.open} />,
  },
  {
    key: "status",
    header: "상태",
    className: "w-28 shrink-0",
    cell: (row) => <Lozenge tone={row.status.tone}>{row.status.label}</Lozenge>,
  },
];

const RELATION_ROWS = [
  { id: "r1", subject: "프로젝트", verb: "포함한다", object: "마일스톤" },
  { id: "r2", subject: "마일스톤", verb: "묶는다", object: "작업" },
  { id: "r3", subject: "리뷰", verb: "승인한다", object: "마일스톤" },
  { id: "r4", subject: "담당자", verb: "맡는다", object: "작업" },
];

export function DataSection() {
  return (
    <Section
      id="data"
      title="데이터 표시"
      note="행 클릭형 목록은 DataGrid 하나뿐이다. 목록 행 · 카드 행 · 노드 버튼처럼 갈라지기 쉬운 구현을 하나로 모았다."
    >
      <Specimen
        name="data-grid.tsx"
        state="기본 / hover / 선택 / 물러남"
        span
        note="마우스는 pointerdown 에서 선택이 확정된다 — 길게 눌렀다 떼도 선택이 사라지지 않는다. ↑↓ Home End Enter 로 키보드 조작."
      >
        <SelectableDataGrid
          label="프로젝트 목록"
          columns={COLUMNS}
          rows={PROJECT_ROWS}
          getRowId={(row) => row.id}
          defaultSelectedId="PRJ-02"
          isDimmed={(row) => Boolean(row.archived)}
          className="w-full"
        />
      </Specimen>

      <Specimen name="data-grid.tsx" state="빈 목록" span>
        <SelectableDataGrid
          label="빈 프로젝트 목록"
          columns={COLUMNS}
          rows={[]}
          getRowId={(row: ProjectRow) => row.id}
          empty={
            <EmptyState
              title="아직 만든 프로젝트가 없습니다"
              description="프로젝트를 만들면 여기에 나타납니다."
            />
          }
          className="w-full"
        />
      </Specimen>

      <Specimen name="data-table.tsx" state="정적 표" span>
        <DataTable
          caption="워크스페이스 관계 — 주어 · 동사 · 목적어"
          columns={[
            { key: "s", header: "주어", cell: (row) => row.subject, rowHeader: true },
            { key: "v", header: "동사", cell: (row) => row.verb },
            { key: "o", header: "목적어", cell: (row) => row.object },
          ]}
          rows={RELATION_ROWS}
          getRowId={(row) => row.id}
        />
      </Specimen>

      <Grid>
        <Specimen name="lozenge.tsx" state="5톤">
          <Lozenge>초안</Lozenge>
          <Lozenge tone="ok">승인</Lozenge>
          <Lozenge tone="info">검토 중</Lozenge>
          <Lozenge tone="warn">확인 필요 2</Lozenge>
          <Lozenge tone="danger">충돌</Lozenge>
        </Specimen>

        <Specimen name="count-badge.tsx" state="0 / 값 있음">
          <CountBadge value={0} />
          <CountBadge value={9} />
          <CountBadge value={128} label="개" />
        </Specimen>

        <Specimen name="definition-list.tsx" state="stacked / 누락">
          <DefinitionList
            className="w-full"
            items={[
              { term: "목표", description: "흩어진 지표 화면을 한 대시보드로 모은다" },
              { term: "담당", description: "프론트엔드" },
              {
                term: "리뷰어",
                description: "확인 필요 — 아직 지정되지 않았다",
                aside: "3쪽",
                missing: true,
              },
            ]}
          />
        </Specimen>

        <Specimen name="definition-list.tsx" state="inline">
          <DefinitionList
            className="w-full"
            layout="inline"
            items={[
              { term: "마일스톤", description: "MS-02" },
              { term: "워크스페이스", description: "Sample" },
              { term: "담당", description: "디자이너" },
            ]}
          />
        </Specimen>

        <Specimen name="gap-checklist.tsx" state="미해소 / 해소">
          <GapChecklist
            className="w-full"
            items={[
              {
                id: "g1",
                label: "리뷰어 미지정",
                hint: "누가 이 마일스톤을 승인하는지 정해야 한다",
              },
              {
                id: "g2",
                label: "완료 기준 미확인",
                hint: "무엇이 되면 끝났다고 보는지",
              },
              { id: "g3", label: "이름 확정", resolved: true },
            ]}
          />
        </Specimen>

        <Specimen name="option-chip.tsx · Chip" state="읽기 전용 값 칩">
          <Chip>디자인</Chip>
          <Chip>프론트엔드</Chip>
          <Chip>백엔드</Chip>
          <Chip>QA</Chip>
        </Specimen>

        <Specimen name="option-chip.tsx · ChipLink" state="이동 칩 / 현재 항목">
          <ChipLink href="/design#data">요구사항 정리</ChipLink>
          <ChipLink href="/design#data" selected aria-current="true">
            시안 작성
          </ChipLink>
        </Specimen>

        <Specimen name="empty-state.tsx" state="neutral / error / note">
          <div className="flex w-full flex-col gap-3">
            <EmptyState
              title="일치하는 프로젝트가 없습니다"
              description="검색어를 지우고 다시 시도하세요."
            />
            <EmptyState
              tone="error"
              title="선택한 프로젝트를 찾을 수 없습니다"
              description="프로젝트 목록으로 돌아가 다시 선택해 주세요."
            />
            <EmptyState
              tone="note"
              description="담당자가 없는 작업은 진행률에 포함되지 않습니다."
            />
          </div>
        </Specimen>
      </Grid>
    </Section>
  );
}
