import type { Metadata } from "next";
import { ProjectLibrary } from "./project-library";

export const metadata: Metadata = {
  title: "Folio · 나의 프로젝트",
  description: "아이디어부터 결과물까지, 작업을 차곡차곡 모으는 개인 프로젝트 라이브러리 목업.",
};

export default function MockupPage() {
  return <ProjectLibrary />;
}
