import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Footer, Header } from "@/components/platform-ui";
import { PlatformStateProvider } from "@/state/platform-state";
import "./globals.css";

export const metadata: Metadata = {
  title: "Funeral Platform | 상조·장례식장 비교",
  description: "상조 상품과 장례식장 정보를 객관적인 기준으로 비교합니다.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className="min-h-full antialiased">
      <body className="min-h-screen flex flex-col font-sans">
        <PlatformStateProvider>
          <Header />
          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-10 lg:px-8">{children}</main>
          <Footer />
        </PlatformStateProvider>
      </body>
    </html>
  );
}
