import { CodeViewer, CodeViewerSkeleton } from "@/components/ui/code-viewer";
import { CopyButton } from "@/components/ui/copy-button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { TextLink } from "@/components/ui/text-link";
import { Card } from "@/components/ui/card";
import { Grid, Section, Specimen } from "../_catalog";

/** 카탈로그 전시용 예시 코드 — 실행 결과가 아니다. */
const SQL = `-- 지난달 주문이 가장 많은 고객 다섯 명
SELECT c.name, COUNT(o.id) AS orders
FROM customers AS c
JOIN orders AS o ON o.customer_id = c.id
WHERE o.created_at >= DATE '2026-09-01'
GROUP BY c.name
ORDER BY orders DESC
LIMIT 5;`;

const PYTHON = `def link_tokens(question: str, schema: dict) -> list[tuple[str, str]]:
    """질문의 단어를 스키마의 테이블·컬럼에 잇는다."""
    links = []
    for word in question.split():
        for table, columns in schema.items():
            if word.lower() in (c.lower() for c in columns):
                links.append((word, f"{table}.{word}"))  # 정확히 같은 이름만
    return links`;

const LONG_SQL = `SELECT o.id, o.created_at, c.name, c.email, p.title, p.category, oi.quantity, oi.unit_price, oi.quantity * oi.unit_price AS line_total FROM orders AS o JOIN customers AS c ON c.id = o.customer_id JOIN order_items AS oi ON oi.order_id = o.id JOIN products AS p ON p.id = oi.product_id WHERE o.status = 'paid';`;

const JSON_SAMPLE = `{
  "question": "지난달 주문이 가장 많은 고객 다섯 명",
  "tables": ["customers", "orders"],
  "confidence": 0.82
}`;

export function CodeSection() {
  return (
    <Section
      id="code"
      title="코드"
      note="CodeViewer 는 읽기 전용이다. 구문 강조는 Shiki 가 서버에서 하고, 색은 --color-syntax-* 토큰에서만 나온다."
    >
      <Grid>
        <Specimen
          name="code-viewer.tsx"
          state="SQL · 파일명 · 강조 줄 · 출처 슬롯"
          span
          note="줄 번호는 선택·복사에서 빠진다. 강조 줄은 #sample-sql-L5 같은 앵커로 이동한다."
        >
          <div className="flex w-full flex-col gap-3">
            <CodeViewer
              id="sample-sql"
              code={SQL}
              language="sql"
              filename="top_customers.sql"
              highlight={[[4, 5]]}
              footer={
                <>
                  생성 단계 3의 결과.{" "}
                  <TextLink href="#sample-sql-L5">JOIN 과 기간 조건(4–5행)으로 이동</TextLink>
                </>
              }
            />
          </div>
        </Specimen>

        <Specimen name="code-viewer.tsx" state="Python · 시작 줄 120 · wrap">
          <CodeViewer
            id="sample-py"
            code={PYTHON}
            language="python"
            filename="schema_linking.py"
            startLine={120}
            highlight={[126]}
            wrap
            className="w-full"
          />
        </Specimen>

        <Specimen name="code-viewer.tsx" state="긴 줄 — 가로 스크롤 · JSON">
          <div className="flex w-full flex-col gap-3">
            <CodeViewer id="sample-long" code={LONG_SQL} language="sql" />
            <CodeViewer id="sample-json" code={JSON_SAMPLE} language="json" filename="link.json" />
          </div>
        </Specimen>

        <Specimen name="code-viewer.tsx" state="빈 값 / 오류 / 로딩">
          <div className="flex w-full flex-col gap-3">
            <CodeViewer code="" language="sql" filename="generated.sql" />
            <CodeViewer
              code=""
              language="sql"
              filename="generated.sql"
              error="SQL 을 만들지 못했다 — 스키마에서 'region' 컬럼을 찾지 못함."
            />
            <CodeViewerSkeleton filename="generated.sql" lines={3} />
          </div>
        </Specimen>

        <Specimen
          name="code-viewer.tsx"
          state="fill — 분할 패널 안"
          span
          note="fill 이면 부모 높이를 채우고 본문만 스크롤한다. 문서 전체는 늘지 않는다."
        >
          <Card className="h-72 w-full gap-0 py-0">
            <ResizablePanelGroup orientation="horizontal">
              <ResizablePanel id="code-left" defaultSize="50%" minSize="25%">
                <CodeViewer id="sample-fill-sql" code={SQL} language="sql" filename="before.sql" fill />
              </ResizablePanel>
              <ResizableHandle aria-label="두 코드 사이 크기 조절" />
              <ResizablePanel id="code-right" minSize="25%">
                <CodeViewer id="sample-fill-py" code={PYTHON} language="python" filename="linker.py" fill />
              </ResizablePanel>
            </ResizablePanelGroup>
          </Card>
        </Specimen>

        <Specimen name="copy-button.tsx" state="대기 → 복사됨 / 복사 실패">
          <CopyButton value="SELECT 1;" label="예시 SQL 복사" />
        </Specimen>
      </Grid>
    </Section>
  );
}
