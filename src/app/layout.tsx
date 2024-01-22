import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Header from "@/components/Header";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "메뉴 정하는 페이지",
  description: "메뉴 고르기용 페이지",
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
        {modal}
      </body>
    </html>
  );
}
