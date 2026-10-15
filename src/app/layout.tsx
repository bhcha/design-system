import type { Metadata, Viewport } from "next";
import { Inter, Nunito } from "next/font/google";
import { THEME_COLOR } from "@/lib/design-tokens";
import "./globals.css";

/* design.md 의 공개 대체 서체 — Inter(ui-sans-serif 자리) · Nunito(SF Pro Rounded 자리).
   next/font 가 self-host 하고 CSS 변수만 <html> 에 심는다. 실제 font-family 결박은
   globals.css 의 --font-sans · --font-display 가 한다. */
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const nunito = Nunito({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Design System",
    template: "%s · Design System",
  },
  description: "개인 디자인 시스템 — shadcn/ui(Base UI) 컴포넌트와 Ollama 토큰, 디자인 시스템 lint.",
};

export const viewport: Viewport = {
  themeColor: THEME_COLOR,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`h-full ${inter.variable} ${nunito.variable}`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
