"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/src/common/components/ui/button";
import { Users, Settings, Menu, BarChart3, LogOut, MessageSquare, Bell, Package, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/src/common/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { Toaster } from "@/src/common/components/ui/toaster";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/common/components/ui/dropdownMenu";
import { ThemeToggle } from "@/src/common/components/themeToggle";
import { CombinedLogo } from "@/src/common/components/combinedLogo";

import { useCurrentUser } from "@/src/common/hooks/useUser";
import { useAuthActions } from "@/src/common/stores/useAuthStore";

const navItems = [
  { href: "/clinica/dashboard", icon: BarChart3, label: "Painel Geral" },
  { href: "/clinica/pacientes", icon: Users, label: "Pacientes" },
  { href: "/clinica/mensagens", icon: MessageSquare, label: "Mensagens" },
  { href: "/clinica/notificacoes", icon: Bell, label: "Notificações" },
  { href: "/clinica/configuracoes", icon: Settings, label: "Configurações" },
];

function SidebarContent({ isCollapsed = false }: { isCollapsed?: boolean }) {
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
    <nav className="flex flex-col h-full">
      <div className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} passHref>
            <Button
              variant={pathname === item.href ? "secondary" : "ghost"}
              className={`w-full transition-all duration-200 ${
                pathname === item.href
                  ? "bg-primary/10 text-primary hover:bg-primary/15 border-l-2 border-primary"
                  : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
              } ${isCollapsed ? "px-2" : "justify-start px-4"}`}
            >
              <item.icon className={`h-5 w-5 ${isCollapsed ? "" : "mr-3"}`} />
              {!isCollapsed && <span className="font-medium">{item.label}</span>}
            </Button>
          </Link>
        ))}
      </div>
      
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className={`w-full text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30 transition-all duration-200 ${
            isCollapsed ? "px-2" : "justify-start px-4"
          }`}
          onClick={handleSignOut}
        >
          <LogOut className={`h-5 w-5 ${isCollapsed ? "" : "mr-3"}`} />
          {!isCollapsed && <span className="font-medium">Sair</span>}
        </Button>
      </div>
    </nav>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); // Added usePathname at the top level
  const { data: user, isLoading, isError } = useCurrentUser();

  useEffect(() => {
    if (!isLoading && isError) {
      router.push('/login');
    }
  }, [isLoading, isError, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <Package className="h-12 w-12 text-primary animate-pulse" />
            <div className="absolute inset-0 h-12 w-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
          <div className="text-center space-y-2">
            <p className="text-lg font-medium">Carregando seu painel...</p>
            <p className="text-sm text-muted-foreground">Aguarde um momento</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const sidebarWidth = isSidebarCollapsed ? "w-16" : "w-72";

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Desktop Sidebar */}
      <aside className={`inset-y-0 left-0 z-10 hidden ${sidebarWidth} flex-col border-r bg-card/50 backdrop-blur-sm sm:flex transition-all duration-300`}>
        <div className="flex h-16 items-center justify-between border-b px-4">
          {!isSidebarCollapsed && (
            <div className="flex items-center gap-2">
              <CombinedLogo variant="default" />
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8" 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          >
            {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
        <SidebarContent isCollapsed={isSidebarCollapsed} />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm sm:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-72 flex-col border-r bg-card sm:hidden"
            >
              <div className="flex h-16 items-center justify-between border-b px-4">
                <div className="flex items-center gap-2">
                  <CombinedLogo variant="default" />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSidebarOpen(false)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`flex flex-col sm:${sidebarWidth.replace('w-', 'pl-')} w-full transition-all duration-300`}>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:px-6">
          <Button 
            size="icon" 
            variant="ghost" 
            className="sm:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Abrir menu</span>
          </Button>
          
          <div className="flex-1" />
          
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-auto px-3 gap-3">
                <div className="flex flex-col text-right text-sm">
                  <span className="font-semibold">{user.name}</span>
                  <span className="text-xs leading-none text-muted-foreground">{user.email}</span>
                </div>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={"/placeholder.svg"} alt={`@${user.name}`} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {user.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  );
}
