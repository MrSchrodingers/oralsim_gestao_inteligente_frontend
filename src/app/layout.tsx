import type { Metadata } from "next";
import { Manrope as FontSans } from "next/font/google";
import "./globals.css";

import { cn } from "@/src/common/utils/utils";
import { Toaster } from "@/src/common/components/ui/toaster";
import { QueryClientProvider } from "@/src/common/providers/QueryClientProvider";
import { ThemeProvider } from "../common/components/themeProvider";

// Configura os interceptors do Axios uma única vez quando o módulo é carregado.
// Isso é mais eficiente do que usar um useEffect no layout.

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "OralSin Gestão",
    template: "%s | OralSin Gestão",
  },
  description: "Plataforma inteligente para gestão de recebíveis da OralSin.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryClientProvider>
            {children}
            <Toaster />
          </QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
