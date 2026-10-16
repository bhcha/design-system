"use client"

import * as React from "react"
import "@xyflow/react/dist/style.css"
import {
  Handle,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react"
import dagre from "@dagrejs/dagre"
import { MaximizeIcon, ZoomInIcon, ZoomOutIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

/**
 * GraphView — 노드·간선 관계도, 읽기 전용 (이슈 #4).
 * 렌더러 React Flow(@xyflow/react) · 자동 배치 dagre(계층형).
 *
 * 받은 데이터만 그린다. 노드·간선을 추정하거나 만들어 내지 않는다 — 입력이 없으면 빈 상태다.
 *
 * 해부도
 *   Card
 *     [ 보기 전환 Tabs(그래프 | 목록) ··· 확대 · 축소 · 처음 위치로 ]
 *     ─ Separator ─
 *     그래프: React Flow 캔버스 — 노드 = 버튼(유형 · 이름 · 미확인 배지), 간선 = 선 + 라벨
 *     목록: 노드 표 + 관계 표 (같은 정보를 표로 — 대체 보기)
 *     [ 범례: 굵은 선 = 강조 경로 · 점선 = 미확인 ]
 *
 * 토큰
 *   노드 bg-background · border --color-border · rounded-lg · 이름 text-sm · 유형 text-xs muted-foreground
 *   선택 ring-2 --color-foreground · 포커스 outline-2 --color-ring(불투명 파랑) — 둘은 따로 보인다
 *   경로 노드 bg --color-status-info-soft · border --color-status-info · 경로 간선 --color-foreground 2px
 *   일반 간선 --color-hairline-strong 1px · 미확인 노드·간선 점선 + "미확인" 글자
 *   간선 라벨 text-xs --color-charcoal 바탕 --color-background. 그림자 없음.
 *   React Flow 출처 표시는 숨기지 않는다(라이선스 요청) — 글자만 --color-muted-foreground 로 대비를 맞춘다.
 *
 * 상태
 *   기본 / 선택(selectedId) / 경로 강조(path) / 미확인(status="unconfirmed") / focus-visible
 *   빈 값(nodes 없음) / 오류(error). 로딩은 Skeleton 으로 호출부가 감싼다.
 *   fill — 부모 높이를 채운다(ResizablePanel 안). 끄면 높이 24rem.
 *
 * 키보드·ARIA
 *   노드는 <button aria-pressed>. Tab 으로 노드를 차례로 돌고 Enter·Space 로 선택한다(onSelect).
 *   접근 가능한 이름 = "이름, 유형, 미확인, 경로에 포함" — 색만으로 의미를 전하지 않는다.
 *   간선 관계는 "목록" 보기의 관계 표로 읽는다. 확대·축소·처음 위치로는 이름 있는 버튼이다.
 *   마우스 휠은 페이지 스크롤에 양보한다(캔버스가 휠을 가로채지 않는다). 확대는 버튼·핀치로 한다.
 *
 * 수용 기준
 *   - 입력이 없으면 아무 관계도 그리지 않고 빈 상태 문구를 보인다.
 *   - 9개 안팎의 테이블에서 dagre 배치로 노드가 겹치지 않는다.
 *   - 긴 이름은 노드 폭에서 말줄임되고 전체 이름은 접근 가능한 이름과 title 에 남는다.
 *   - 그래프 없이 목록 보기만으로 같은 정보를 모두 읽을 수 있다.
 */

export type GraphStatus = "confirmed" | "unconfirmed"

export type GraphNode = {
  id: string
  label: string
  /** 노드 유형 — 예: "테이블", "컬럼", "SELECT". */
  kind?: string
  status?: GraphStatus
}

export type GraphEdge = {
  source: string
  target: string
  /** 관계 이름 — 예: "customer_id". */
  label?: string
  status?: GraphStatus
}

export type GraphViewProps = {
  /** 그래프 이름 — 보기 전환·캔버스의 접근 가능한 이름에 쓴다. 예: "스키마 관계". */
  label: string
  nodes: readonly GraphNode[]
  edges: readonly GraphEdge[]
  /** LR 왼쪽→오른쪽(스키마 관계), TB 위→아래(질의 트리). */
  direction?: "LR" | "TB"
  /** 강조 경로 — 노드 id 를 순서대로. 이웃한 두 노드를 잇는 간선이 경로 간선이 된다. */
  path?: readonly string[]
  selectedId?: string | null
  onSelect?: (id: string) => void
  error?: string
  fill?: boolean
  className?: string
}

const NODE_WIDTH = 176
const NODE_HEIGHT = 60

type EntityData = {
  node: GraphNode
  selected: boolean
  inPath: boolean
  direction: "LR" | "TB"
  onSelect?: (id: string) => void
}

function nodeName(node: GraphNode, inPath: boolean) {
  return [
    node.label,
    node.kind,
    node.status === "unconfirmed" ? "미확인" : undefined,
    inPath ? "경로에 포함" : undefined,
  ]
    .filter(Boolean)
    .join(", ")
}

function EntityNode({ data }: NodeProps<Node<EntityData>>) {
  const { node, selected, inPath, direction, onSelect } = data
  const unconfirmed = node.status === "unconfirmed"
  return (
    <>
      <Handle
        type="target"
        position={direction === "LR" ? Position.Left : Position.Top}
        isConnectable={false}
        className="opacity-0!"
      />
      <button
        type="button"
        aria-pressed={selected}
        aria-label={nodeName(node, inPath)}
        title={node.label}
        onClick={() => onSelect?.(node.id)}
        className={cn(
          "flex w-44 flex-col items-start gap-0.5 rounded-lg border bg-background px-3 py-2 text-left outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          unconfirmed ? "border-dashed border-hairline-strong" : "border-border",
          inPath && "border-status-info bg-status-info-soft",
          selected && "ring-2 ring-foreground"
        )}
      >
        <span className="flex w-full items-center gap-1.5 text-xs text-muted-foreground">
          <span className="truncate">{node.kind ?? "노드"}</span>
          {unconfirmed ? <span className="ml-auto shrink-0">미확인</span> : null}
        </span>
        <span className="w-full truncate text-sm font-medium text-foreground">
          {node.label}
        </span>
      </button>
      <Handle
        type="source"
        position={direction === "LR" ? Position.Right : Position.Bottom}
        isConnectable={false}
        className="opacity-0!"
      />
    </>
  )
}

const NODE_TYPES = { entity: EntityNode }

function pathEdgeKeys(path: readonly string[] | undefined) {
  const keys = new Set<string>()
  for (let i = 1; i < (path?.length ?? 0); i++) {
    keys.add(`${path![i - 1]}->${path![i]}`)
    keys.add(`${path![i]}->${path![i - 1]}`)
  }
  return keys
}

function layout({
  nodes,
  edges,
  direction,
  path,
  selectedId,
  onSelect,
}: Pick<GraphViewProps, "nodes" | "edges" | "path" | "selectedId" | "onSelect"> & {
  direction: "LR" | "TB"
}): { nodes: Node<EntityData>[]; edges: Edge[] } {
  const g = new dagre.graphlib.Graph()
  // LR 은 간선 라벨이 열 사이에 놓이므로 열 간격을 라벨 폭만큼 넓힌다.
  g.setGraph({ rankdir: direction, nodesep: 32, ranksep: direction === "LR" ? 120 : 72, marginx: 16, marginy: 16 })
  g.setDefaultEdgeLabel(() => ({}))
  for (const node of nodes) g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT })
  for (const edge of edges) g.setEdge(edge.source, edge.target)
  dagre.layout(g)

  const inPath = new Set(path ?? [])
  const pathEdges = pathEdgeKeys(path)

  return {
    nodes: nodes.map((node) => {
      const { x, y } = g.node(node.id)
      return {
        id: node.id,
        type: "entity",
        position: { x: x - NODE_WIDTH / 2, y: y - NODE_HEIGHT / 2 },
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        data: {
          node,
          selected: node.id === selectedId,
          inPath: inPath.has(node.id),
          direction,
          onSelect,
        },
      }
    }),
    edges: edges.map((edge, i) => {
      const onPath = pathEdges.has(`${edge.source}->${edge.target}`)
      return {
        id: `e${i}-${edge.source}-${edge.target}`,
        source: edge.source,
        target: edge.target,
        label: edge.label,
        // 라벨 글자 크기도 레이어 밖 규칙(10px)이 이겨서 토큰 변수로 직접 준다.
        labelStyle: { fontSize: "var(--text-xs)" },
        // 임의 선택자 안의 `_` 는 Tailwind 가 공백으로 바꾼다 — React Flow 클래스(`react-flow__…`)는 [class*=…] 로 집는다.
        // React Flow 스타일시트는 레이어 밖이라 유틸리티로 덮을 수 없다 — 그것이 읽는 CSS 변수를 바꾼다.
        className: cn(
          onPath && "[--xy-edge-stroke:var(--color-foreground)] [--xy-edge-stroke-width:2]",
          edge.status === "unconfirmed" && "[&_[class*=edge-path]]:[stroke-dasharray:4_4]"
        ),
      }
    }),
  }
}

function ZoomControls() {
  const flow = useReactFlow()
  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="icon-sm" aria-label="확대" onClick={() => flow.zoomIn()}>
        <ZoomInIcon aria-hidden="true" />
      </Button>
      <Button variant="ghost" size="icon-sm" aria-label="축소" onClick={() => flow.zoomOut()}>
        <ZoomOutIcon aria-hidden="true" />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="처음 위치로"
        onClick={() => flow.fitView({ padding: 0.15 })}
      >
        <MaximizeIcon aria-hidden="true" />
      </Button>
    </div>
  )
}

function statusText(status: GraphStatus | undefined) {
  return status === "unconfirmed" ? "미확인" : "확인"
}

function GraphList({ nodes, edges, path }: Pick<GraphViewProps, "nodes" | "edges" | "path">) {
  const byId = new Map(nodes.map((n) => [n.id, n.label]))
  const inPath = new Set(path ?? [])
  const pathEdges = pathEdgeKeys(path)
  return (
    <div className="flex flex-col gap-4 p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>노드</TableHead>
            <TableHead>유형</TableHead>
            <TableHead>상태</TableHead>
            <TableHead>경로</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {nodes.map((node) => (
            <TableRow key={node.id}>
              <TableCell>{node.label}</TableCell>
              <TableCell>{node.kind ?? "—"}</TableCell>
              <TableCell>{statusText(node.status)}</TableCell>
              <TableCell>{inPath.has(node.id) ? "포함" : "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>출발</TableHead>
            <TableHead>관계</TableHead>
            <TableHead>도착</TableHead>
            <TableHead>상태</TableHead>
            <TableHead>경로</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {edges.map((edge, i) => (
            <TableRow key={`${edge.source}-${edge.target}-${i}`}>
              <TableCell>{byId.get(edge.source) ?? edge.source}</TableCell>
              <TableCell>{edge.label ?? "—"}</TableCell>
              <TableCell>{byId.get(edge.target) ?? edge.target}</TableCell>
              <TableCell>{statusText(edge.status)}</TableCell>
              <TableCell>
                {pathEdges.has(`${edge.source}->${edge.target}`) ? "포함" : "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export function GraphView(props: GraphViewProps) {
  return (
    <ReactFlowProvider>
      <GraphViewInner {...props} />
    </ReactFlowProvider>
  )
}

function GraphViewInner({
  label,
  nodes,
  edges,
  direction = "LR",
  path,
  selectedId = null,
  onSelect,
  error,
  fill = false,
  className,
}: GraphViewProps) {
  const [view, setView] = React.useState("graph")
  const flow = React.useMemo(
    () => layout({ nodes, edges, direction, path, selectedId, onSelect }),
    [nodes, edges, direction, path, selectedId, onSelect]
  )
  const empty = nodes.length === 0

  return (
    <Card
      data-slot="graph-view"
      className={cn("gap-0 py-0", fill && "h-full", className)}
    >
      {error || empty ? (
        <p
          role={error ? "alert" : undefined}
          className={cn("px-4 py-6 text-sm", error ? "text-status-danger" : "text-muted-foreground")}
        >
          {error ?? `${label} — 관계 데이터가 없다. 입력이 없으면 관계를 추정해 그리지 않는다.`}
        </p>
      ) : (
        <Tabs
          value={view}
          onValueChange={(v) => setView(String(v))}
          className={cn("gap-0", fill && "min-h-0 flex-1")}
        >
          <div className="flex items-center gap-2 px-3 py-2">
            <TabsList aria-label={`${label} 보기 방식`}>
              <TabsTrigger value="graph">그래프</TabsTrigger>
              <TabsTrigger value="list">목록</TabsTrigger>
            </TabsList>
            <div className="ml-auto">{view === "graph" ? <ZoomControls /> : null}</div>
          </div>
          <Separator />
          <TabsContent value="graph" className={cn("flex flex-col", fill && "min-h-0 flex-1")}>
            <div
              className={cn(
                "w-full [--xy-edge-label-background-color:var(--color-background)] [--xy-edge-label-color:var(--color-charcoal)] [--xy-edge-stroke:var(--color-hairline-strong)] [&_[class*=attribution]_a]:text-muted-foreground!",
                fill ? "min-h-0 flex-1" : "h-96"
              )}
            >
              <ReactFlow
                aria-label={label}
                nodes={flow.nodes}
                edges={flow.edges}
                nodeTypes={NODE_TYPES}
                fitView
                fitViewOptions={{ padding: 0.15 }}
                minZoom={0.3}
                maxZoom={2}
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable={false}
                nodesFocusable={false}
                edgesFocusable={false}
                zoomOnScroll={false}
                preventScrolling={false}
                colorMode="light"
              />
            </div>
            <p className="px-4 py-2 text-xs text-muted-foreground">
              굵은 선 = 강조 경로 · 점선 = 미확인 · 노드를 누르면 선택한다
            </p>
          </TabsContent>
          <TabsContent value="list" className={cn(fill && "min-h-0 flex-1 overflow-auto")}>
            <GraphList nodes={nodes} edges={edges} path={path} />
          </TabsContent>
        </Tabs>
      )}
    </Card>
  )
}
