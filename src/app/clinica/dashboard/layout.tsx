"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/src/common/components/ui/button";
import { Users, Settings, Menu, BarChart3, LogOutIcon, MessageSquare, Bell, Package, AlertCircle } from "lucide-react";
import { ThemeToggle } from "@/src/common/components/themeToggle";
import { AnimatedButton } from "@/src/common/components/motion/animated-button";
import { useCurrentUser } from "@/src/common/hooks/useUser";
import { useAuthActions } from "@/src/common/stores/useAuthStore";
import { Toaster } from "@/src/common/components/ui/toaster";
import { Skeleton } from "@/src/common/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/common/components/ui/avatar";
import { CombinedLogo } from "@/src/common/components/combinedLogo";

const navItems = [
  { href: "/clinica/dashboard", icon: BarChart3, label: "Dashboard" },
  { href: "/clinica/dashboard/pacientes", icon: Users, label: "Pacientes" },
  { href: "/clinica/dashboard/mensagens", icon: MessageSquare, label: "Mensagens" },
  { href: "/clinica/dashboard/notificacoes", icon: Bell, label: "Notificações" },
  { href: "/clinica/dashboard/configuracoes", icon: Settings, label: "Configurações" },
];

function SidebarContent() {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { logout } = useAuthActions();

  const handleSignOut = () => {
    logout();
    queryClient.clear();
    router.push("/login");
  };

  return (
    <nav className="flex flex-col h-full p-4">
      {navItems.map((item) => (
        <Link key={item.href} href={item.href} passHref>
          <AnimatedButton
            variant={pathname === item.href ? "secondary" : "ghost"}
            className={`shadow-none my-1 w-full justify-start ${pathname === item.href
                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/30"
                : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            whileHoverScale={1.02}
          >
            <item.icon className={`mr-3 h-5 w-5`} />
            {item.label}
          </AnimatedButton>
        </Link>
      ))}
      <div className="mt-auto">
        <AnimatedButton
          variant="ghost"
          className="shadow-none my-1 w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30"
          onClick={handleSignOut}
          whileHoverScale={1.02}
        >
          <LogOutIcon className="mr-3 h-5 w-5" />
          Sair
        </AnimatedButton>
      </div>
    </nav>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const { data: user, isLoading, isError } = useCurrentUser();

  useEffect(() => {
    if (!isLoading && isError) {
      router.push('/login');
    }
  }, [isLoading, isError, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Package className="h-10 w-10 text-emerald-500 animate-pulse" />
          <p className="text-muted-foreground">Carregando seu painel...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // ou um redirecionamento, pois o useEffect já cuidará disso
  }

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-background sm:flex">
        <div className="flex h-16 items-center border-b px-6">
          <CombinedLogo variant="default" />
        </div>
        <SidebarContent />
      </aside>

      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-72 w-full">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Button size="icon" variant="outline" className="sm:hidden" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
          <div className="relative ml-auto flex-1 md:grow-0">
             {/* Futuro Search Bar */}
          </div>
          <ThemeToggle />
          <div className="flex items-center gap-3">
            <div className="flex flex-col text-right text-sm">
                <span className="font-semibold">{user.name}</span>
                <span className="text-xs text-muted-foreground">{user.email}</span>
            </div>
            <Avatar className="h-9 w-9">
                <AvatarImage src={undefined} alt={`@${user.name}`} />
                <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:px-6 sm:py-0 md:gap-8">
            <AnimatePresence mode="wait">
                <motion.div
                    key={usePathname()}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {children}
                </motion.div>
            </AnimatePresence>
        </main>
      </div>
      <Toaster />
    </div>
  );
}
