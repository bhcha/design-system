import { DatabaseIcon, FileCodeIcon, HistoryIcon, SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeViewer } from "@/components/ui/code-viewer";
import { DataTable } from "@/components/ui/data-table";
import { Density, type DensityValue } from "@/components/ui/density";
import { GlobalNav } from "@/components/ui/global-nav";
import { GraphView, type GraphEdge, type GraphNode } from "@/components/ui/graph-view";
import { Label } from "@/components/ui/label";
import { ModalDialog } from "@/components/ui/modal-dialog";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Section, Specimen } from "../_catalog";

/** 카탈로그 전시용 예시 — Text2SQL 워크벤치 모양을 흉내 낸 것이며 실제 엔진 산출물이 아니다. */
const SQL = `SELECT c.customer_state, COUNT(o.order_id) AS orders
FROM olist_orders_dataset AS o
JOIN olist_customers_dataset AS c ON c.customer_id = o.customer_id
WHERE o.order_status = 'delivered'
GROUP BY c.customer_state
ORDER BY orders DESC
LIMIT 5;`;

type Step = { id: string; step: string; detail: string; tokens: number };

const STEPS: Step[] = [
  { id: "link", step: "스키마 연결", detail: "주문 → olist_orders_dataset", tokens: 3 },
  { id: "filter", step: "조건 추출", detail: "배송 완료 → order_status = 'delivered'", tokens: 2 },
  { id: "group", step: "집계", detail: "주별 → GROUP BY customer_state", tokens: 2 },
];

const NODES: GraphNode[] = [
  { id: "select", label: "customer_state, COUNT", kind: "SELECT" },
  { id: "from", label: "orders ⋈ customers", kind: "FROM" },
  { id: "where", label: "order_status = 'delivered'", kind: "WHERE" },
];

const EDGES: GraphEdge[] = [
  { source: "select", target: "from" },
  { source: "select", target: "where" },
];

type Measure = { id: string; item: string; base: string; compact: string; reference: string };

/** 토큰 계산값. 실제 렌더링 값은 e2e/density.spec.ts 가 이 표본에서 실측한다. */
const MEASURES: Measure[] = [
  { id: "sidebar", item: "Sidebar 펼친 폭", base: "256px", compact: "204.8px", reference: "약 205px" },
  { id: "menu", item: "Sidebar 메뉴 높이 · 글자", base: "32px · 14px", compact: "25.6px · 12px", reference: "약 26px · 11.2px" },
  { id: "nav", item: "GlobalNav 높이 · 좌우 여백", base: "56px · 24px", compact: "44.8px · 19.2px", reference: "약 45px · 19px" },
  { id: "button", item: "Button sm 높이 · 글자", base: "32px · 14px", compact: "25.6px · 12px", reference: "약 26px" },
  { id: "tabs", item: "Tabs 목록 높이 · 글자", base: "32px · 14px", compact: "25.6px · 12px", reference: "11.2px" },
  { id: "textarea", item: "Textarea 글자 · 가로 여백", base: "16px · 16px", compact: "14px · 12.8px", reference: "12.8px" },
  { id: "select", item: "NativeSelect 높이 · 글자", base: "40px · 16px", compact: "32px · 14px", reference: "32px · 12.8px" },
  { id: "card", item: "Card 안쪽 간격 · 제목(sm)", base: "16px · 16px(14px)", compact: "12.8px · 14px(12px)", reference: "약 13px · 12.8px" },
  { id: "code", item: "CodeViewer 코드 · 행간", base: "14px / 20px", compact: "12px / 16px", reference: "11.2px / 16px" },
  { id: "graph", item: "GraphView 노드 폭 · 이름", base: "176px · 14px", compact: "140.8px · 12px", reference: "약 141px · 11.2px" },
  { id: "table", item: "DataTable 본문 · 셀 여백", base: "16px · 8px", compact: "14px · 6.4px", reference: "12.8px · 6.4px" },
  { id: "modal", item: "ModalDialog 제목 · 본문", base: "20px · 16px", compact: "18px · 14px", reference: "내부와 같은 밀도" },
];

const MENU = [
  { label: "질문", icon: FileCodeIcon, active: true },
  { label: "스키마", icon: DatabaseIcon },
  { label: "기록", icon: HistoryIcon },
  { label: "설정", icon: SettingsIcon, disabled: true },
];

/** 워크벤치 한 벌 — 같은 조립을 기본·compact 범위에 각각 놓는다. */
function Workbench({ density }: { density: DensityValue }) {
  const name = density === "compact" ? "compact" : "기본";
  return (
    <Density value={density}>
      <Card className="h-160 w-full gap-0 py-0">
        <GlobalNav
          brand="Text2SQL Lab"
          label={`워크벤치 상단 (${name})`}
          className="static"
          actions={<Button size="sm">SQL 생성</Button>}
        />
        {/* translate 가 걸린 상자는 fixed 사이드바의 기준이 된다 — 표본 안에 가둔다. */}
        <div className="min-h-0 flex-1 translate-x-0 overflow-hidden">
          <SidebarProvider className="h-full min-h-0">
            <Sidebar collapsible="icon" aria-label={`워크벤치 메뉴 (${name})`}>
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel>작업</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {MENU.map((item) => (
                        <SidebarMenuItem key={item.label}>
                          <SidebarMenuButton
                            isActive={item.active}
                            disabled={item.disabled}
                            tooltip={item.label}
                          >
                            <item.icon aria-hidden="true" />
                            <span>{item.label}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
            </Sidebar>

            <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3 overflow-y-auto p-4">
              <div className="flex items-center gap-2">
                <SidebarTrigger />
                <p className="text-sm text-charcoal">사이드바 접기 — Ctrl/⌘+B</p>
              </div>

              <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>자연어 질문</CardTitle>
                    <CardDescription>Olist 주문 데이터</CardDescription>
                    <CardAction>
                      <ModalDialog
                        trigger={<Button variant="outline" size="sm">명세 보기</Button>}
                        title="Olist 데이터 명세"
                        description="워크벤치가 읽는 테이블과 규칙"
                        footer={<Button size="sm">확인</Button>}
                      >
                        <div className="flex flex-col gap-2">
                          <p className="text-base text-charcoal">
                            주문은 olist_orders_dataset, 고객은 olist_customers_dataset 에 있다.
                          </p>
                          <Label htmlFor={`density-${density}-dialog-rule`}>적용 규칙</Label>
                          <NativeSelect id={`density-${density}-dialog-rule`} size="sm">
                            <NativeSelectOption>배송 완료 주문만</NativeSelectOption>
                            <NativeSelectOption>모든 주문</NativeSelectOption>
                          </NativeSelect>
                        </div>
                      </ModalDialog>
                    </CardAction>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-2">
                    <Label htmlFor={`density-${density}-question`}>질문</Label>
                    <Textarea
                      id={`density-${density}-question`}
                      defaultValue="배송 완료된 주문이 가장 많은 주 다섯 곳은?"
                    />
                    <Label htmlFor={`density-${density}-db`}>데이터베이스</Label>
                    <NativeSelect id={`density-${density}-db`}>
                      <NativeSelectOption>olist (SQLite)</NativeSelectOption>
                      <NativeSelectOption>olist (PostgreSQL)</NativeSelectOption>
                    </NativeSelect>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm">변환</Button>
                      <Button size="sm" variant="outline">초기화</Button>
                      <Button size="sm" disabled>실행 결과</Button>
                    </div>
                  </CardContent>
                </Card>

                <CodeViewer
                  id={`density-${density}-sql`}
                  code={SQL}
                  language="sql"
                  filename="generated.sql"
                  highlight={[[4, 5]]}
                />
              </div>

              <Tabs defaultValue="steps">
                <TabsList aria-label={`변환 학습 (${name})`}>
                  <TabsTrigger value="steps">변환 단계</TabsTrigger>
                  <TabsTrigger value="graph">질의 트리</TabsTrigger>
                  <TabsTrigger value="evidence" disabled>근거</TabsTrigger>
                </TabsList>
                <TabsContent value="steps">
                  <DataTable
                    caption={`변환 단계 (${name})`}
                    captionHidden
                    columns={[
                      { key: "step", header: "단계", cell: (row) => row.step, rowHeader: true },
                      { key: "detail", header: "내용", cell: (row) => row.detail },
                      { key: "tokens", header: "토큰", cell: (row) => row.tokens, numeric: true },
                    ]}
                    rows={STEPS}
                    getRowId={(row) => row.id}
                  />
                </TabsContent>
                <TabsContent value="graph">
                  <GraphView label={`질의 트리 (${name})`} nodes={NODES} edges={EDGES} direction="TB" />
                </TabsContent>
              </Tabs>
            </div>
          </SidebarProvider>
        </div>
      </Card>
    </Density>
  );
}

export function DensitySection() {
  return (
    <Section
      id="density"
      title="밀도"
      note="Density 로 감싼 범위는 간격 토큰이 0.8배, 글자는 타입 스케일 한 단계 아래(최소 12px)가 된다. 브라우저 100% 배율에서의 실제 CSS 크기다. 768px 미만에서는 기본과 같다."
    >
      <Specimen
        name="density.tsx"
        state="크기 비교"
        span
        note="이슈 #10 의 80% 값은 시각 비교 기준이다. 글자는 0.8배 대신 기존 스케일 값을 쓰고, 12px 아래로 줄이지 않는다."
      >
        <DataTable
          caption="기본과 compact 의 크기"
          captionHidden
          columns={[
            { key: "item", header: "항목", cell: (row) => row.item, rowHeader: true },
            { key: "base", header: "기본", cell: (row) => row.base },
            { key: "compact", header: "compact", cell: (row) => row.compact },
            { key: "reference", header: "80% 비교 기준", cell: (row) => row.reference },
          ]}
          rows={MEASURES}
          getRowId={(row) => row.id}
          className="w-full"
        />
      </Specimen>
      <Specimen name="density.tsx" state="기본" span>
        <Workbench density="default" />
      </Specimen>
      <Specimen
        name="density.tsx"
        state="compact"
        span
        note="메뉴·탭·버튼·입력·카드·코드·표·관계도·대화상자가 같은 밀도다. 명세 보기 대화상자는 포털로 열려도 compact 를 따른다."
      >
        <Workbench density="compact" />
      </Specimen>
    </Section>
  );
}
