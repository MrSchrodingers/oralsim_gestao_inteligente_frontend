"use client"
import Link from "next/link"
import { Suspense } from "react"
import { Button } from "@/src/common/components/ui/button"
import { Home, LogOut, Settings, User, Menu, BarChart3, CreditCard, Bell } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/common/components/ui/dropdownMenu"
import { Avatar, AvatarFallback } from "@/src/common/components/ui/avatar"
import { Badge } from "@/src/common/components/ui/badge"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { Skeleton } from "@/src/common/components/ui/skeleton"
import { useAuthActions } from "../../stores/useAuthStore"
import { useCurrentUser } from "../../hooks/useUser"
import { CombinedLogo } from "../combinedLogo"
import { ThemeToggle } from "../themeToggle"

/**
 * Navegação Principal - Visível apenas para usuários logados
 */
function MainNavigation() {
  return (
    <nav className="hidden md:flex items-center space-x-1">
      <Button variant="ghost" size="sm" asChild className="text-sm font-medium">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Home className="h-4 w-4" />
          Dashboard
        </Link>
      </Button>
      <Button variant="ghost" size="sm" asChild className="text-sm font-medium">
        <Link href="/recebimentos" className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Recebimentos
        </Link>
      </Button>
      <Button variant="ghost" size="sm" asChild className="text-sm font-medium">
        <Link href="/relatorios" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Relatórios
        </Link>
      </Button>
    </nav>
  )
}

/**
 * Menu Mobile - Dropdown para navegação em dispositivos móveis
 */
function MobileMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="md:hidden">
        <Button variant="ghost" size="sm">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Navegação</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/dashboard" className="flex w-full items-center">
            <Home className="mr-3 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/recebimentos" className="flex w-full items-center">
            <CreditCard className="mr-3 h-4 w-4" />
            <span>Recebimentos</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/relatorios" className="flex w-full items-center">
            <BarChart3 className="mr-3 h-4 w-4" />
            <span>Relatórios</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/**
 * Menu do Usuário
 * - `isLoading`: Mostra um skeleton para uma melhor experiência de carregamento.
 * - `data: user`: Usa os dados do usuário diretamente do cache do React Query.
 * - `logout` do `useAuthActions`: Centraliza a lógica de logout, limpando o estado do Zustand e os caches.
 */
function UserMenu() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { logout } = useAuthActions()
  const { data: user, isLoading, isError } = useCurrentUser()

  const handleSignOut = () => {
    logout();
    queryClient.clear();
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="hidden sm:block">
          <Skeleton className="h-4 w-20 mb-1" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    )
  }

  if (isError || !user) {
    return (
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
          <Link href="/pricing">Planos</Link>
        </Button>
        <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2">
          <Link href="/login">Entrar</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      {/* Notificações */}
      <Button variant="ghost" size="sm" className="relative">
        <Bell className="h-4 w-4" />
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
        >
          3
        </Badge>
        <span className="sr-only">Notificações</span>
      </Button>

      {/* Menu do usuário */}
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-3 hover:bg-accent hover:text-accent-foreground rounded-md p-2 transition-colors">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-sm font-medium">
              {user.name ? user.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs text-muted-foreground mt-1">{user.email}</p>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Links principais */}
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/dashboard" className="flex w-full items-center py-2">
              <Home className="mr-3 h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/recebimentos" className="flex w-full items-center py-2">
              <CreditCard className="mr-3 h-4 w-4" />
              <span>Recebimentos</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/relatorios" className="flex w-full items-center py-2">
              <BarChart3 className="mr-3 h-4 w-4" />
              <span>Relatórios</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Configurações */}
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/configuracoes" className="flex w-full items-center py-2">
              <Settings className="mr-3 h-4 w-4" />
              <span>Configurações</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Logout */}
          <DropdownMenuItem
            onClick={handleSignOut}
            className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20 py-2"
          >
            <LogOut className="mr-3 h-4 w-4" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export function MainHeader() {
  const { data: user } = useCurrentUser()
  const isLoggedIn = !!user

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo e Navegação Principal */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center">
              <CombinedLogo variant="default" />
            </Link>

            {/* Navegação principal - apenas para usuários logados */}
            {isLoggedIn && <MainNavigation />}
          </div>

          {/* Menu Mobile e Ações do Usuário */}
          <div className="flex items-center gap-4">
            {/* Menu mobile - apenas para usuários logados */}
            {isLoggedIn && <MobileMenu />}

            {/* Toggle de tema */}
            <ThemeToggle />

            {/* Menu do usuário */}
            <Suspense
              fallback={
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="hidden sm:block">
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              }
            >
              <UserMenu />
            </Suspense>
          </div>
        </div>
      </div>
    </header>
  )
}
