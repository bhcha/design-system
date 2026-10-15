import { redirect } from "next/navigation";

/** 이 프로젝트의 첫 화면은 디자인 시스템 카탈로그다. */
export default function Home() {
  redirect("/design");
}
