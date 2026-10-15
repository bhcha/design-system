import type { Metadata, Viewport } from "next";
import { THEME_COLOR } from "@/lib/design-tokens";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

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
    <html lang="ko" className={`h-full ${fontVariables}`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
