import { Inter, Nunito } from "next/font/google";

/* design.md 의 공개 대체 서체 — Inter(ui-sans-serif 자리) · Nunito(SF Pro Rounded 자리).
   next/font 가 self-host 하고 CSS 변수만 <html> 에 심는다. 실제 font-family 결박은
   globals.css 의 --font-sans · --font-display 가 한다. 한글은 globals.css 가 불러오는
   Pretendard Variable(npm pretendard)로 떨어진다.

   쓰는 법: <html className={fontVariables}> */
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const nunito = Nunito({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-nunito",
  display: "swap",
});

export const fontVariables = `${inter.variable} ${nunito.variable}`;
