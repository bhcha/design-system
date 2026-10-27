import type { Metadata } from "next";
import { DocsReader } from "./docs-reader";

export const metadata: Metadata = {
  title: "Folio Docs · 문서 공간",
  description: "왼쪽 문서 메뉴, 본문 목차, 검색을 갖춘 문서 시스템 목업.",
};

export default function DocsMockupPage() {
  return <DocsReader />;
}
