"use client"
import type React from "react"
import { ThemeScript } from "@/src/common/components/themeProvider"
import { MainHeader } from "@/src/common/components/shared/MainHeader";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeScript />
      <section className="flex flex-col min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <MainHeader />
        {children}
      </section>
    </>
  );
}