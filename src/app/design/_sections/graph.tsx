"use client";

import * as React from "react";
import { GraphView, type GraphEdge, type GraphNode } from "@/components/ui/graph-view";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Grid, Section, Specimen } from "../_catalog";

/** 카탈로그 전시용 예시 스키마(9개 테이블) — 실제 엔진 산출물이 아니다. */
const SCHEMA_NODES: GraphNode[] = [
  { id: "customers", label: "customers", kind: "테이블" },
  { id: "orders", label: "orders", kind: "테이블" },
  { id: "order_items", label: "order_items", kind: "테이블" },
  { id: "products", label: "products", kind: "테이블" },
  { id: "categories", label: "categories", kind: "테이블" },
  { id: "payments", label: "payments", kind: "테이블" },
  { id: "shipments", label: "shipments", kind: "테이블" },
  { id: "addresses", label: "customer_shipping_addresses", kind: "테이블" },
  { id: "regions", label: "regions", kind: "테이블", status: "unconfirmed" },
];

const SCHEMA_EDGES: GraphEdge[] = [
  { source: "customers", target: "orders", label: "customer_id" },
  { source: "orders", target: "order_items", label: "order_id" },
  { source: "order_items", target: "products", label: "product_id" },
  { source: "products", target: "categories", label: "category_id" },
  { source: "orders", target: "payments", label: "order_id" },
  { source: "orders", target: "shipments", label: "order_id" },
  { source: "customers", target: "addresses", label: "customer_id" },
  { source: "addresses", target: "regions", label: "region_code", status: "unconfirmed" },
];

const JOIN_PATH = ["customers", "orders", "order_items", "products"];

/** 질의 트리 예시 — SELECT … FROM … WHERE … GROUP BY. */
const TREE_NODES: GraphNode[] = [
  { id: "select", label: "c.name, COUNT(o.id)", kind: "SELECT" },
  { id: "from", label: "customers ⋈ orders", kind: "FROM" },
  { id: "where", label: "o.created_at ≥ 2026-09-01", kind: "WHERE" },
  { id: "group", label: "c.name", kind: "GROUP BY" },
  { id: "c", label: "customers", kind: "테이블" },
  { id: "o", label: "orders", kind: "테이블" },
];

const TREE_EDGES: GraphEdge[] = [
  { source: "select", target: "from" },
  { source: "select", target: "where" },
  { source: "select", target: "group" },
  { source: "from", target: "c" },
  { source: "from", target: "o", label: "customer_id" },
];

export function GraphSection() {
  const [selected, setSelected] = React.useState<string | null>("orders");
  const [treeSelected, setTreeSelected] = React.useState<string | null>(null);
  const node = SCHEMA_NODES.find((n) => n.id === selected);
  const related = SCHEMA_EDGES.filter((e) => e.source === selected || e.target === selected);

  return (
    <Section
      id="graph"
      title="관계도"
      note="GraphView 는 받은 노드·간선만 그린다. 렌더러 React Flow · 배치 dagre. 목록 보기가 같은 정보를 표로 준다."
    >
      <Grid>
        <Specimen
          name="graph-view.tsx"
          state="스키마 9개 테이블 · JOIN 경로 · 미확인 · 선택 상세"
          span
          note="Tab 으로 노드를 돌고 Enter 로 선택한다. 휠은 페이지 스크롤 — 확대는 버튼으로."
        >
          <div className="flex w-full flex-col gap-3 lg:flex-row">
            <GraphView
              label="스키마 관계"
              nodes={SCHEMA_NODES}
              edges={SCHEMA_EDGES}
              path={JOIN_PATH}
              selectedId={selected}
              onSelect={setSelected}
              className="min-w-0 flex-1"
            />
            <Card size="sm" className="w-full lg:w-64">
              <CardHeader>
                <CardTitle>{node ? node.label : "선택한 노드 없음"}</CardTitle>
              </CardHeader>
              <CardContent>
                {node ? (
                  <ul className="flex flex-col gap-1 text-sm text-charcoal">
                    {related.map((e) => (
                      <li key={`${e.source}-${e.target}`}>
                        {e.source} → {e.target} ({e.label}
                        {e.status === "unconfirmed" ? ", 미확인" : ""})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">노드를 고르면 연결이 보인다.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </Specimen>

        <Specimen name="graph-view.tsx" state="질의 트리 · 위→아래(TB)" span>
          <GraphView
            label="질의 트리"
            nodes={TREE_NODES}
            edges={TREE_EDGES}
            direction="TB"
            selectedId={treeSelected}
            onSelect={setTreeSelected}
            className="w-full"
          />
        </Specimen>

        <Specimen name="graph-view.tsx" state="빈 값 / 오류">
          <div className="flex w-full flex-col gap-3">
            <GraphView label="JOIN 경로" nodes={[]} edges={[]} />
            <GraphView
              label="JOIN 경로"
              nodes={[]}
              edges={[]}
              error="엔진 산출물을 읽지 못했다 — join_path.json 형식 오류."
            />
          </div>
        </Specimen>
      </Grid>
    </Section>
  );
}
