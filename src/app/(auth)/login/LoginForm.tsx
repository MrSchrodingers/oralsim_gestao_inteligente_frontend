"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Loader2, Eye, EyeOff, CheckCircle, Shield, Clock, ArrowLeft} from "lucide-react"
import { Button } from "@/src/common/components/ui/button"
import { Input } from "@/src/common/components/ui/input"
import { Label } from "@/src/common/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/common/components/ui/card"
import { Separator } from "@/src/common/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/common/components/ui/select"
import { useToast } from "@/src/common/components/ui/use-toast"
import type { IRegistrationRequestCreateDTO, IUser, IUserCreateDTO } from "@/src/common/interfaces/IUser"
import { useCreateRegistrationRequest, useCreateUser, useCurrentUser, useLogin } from "@/src/common/hooks/useUser"
import { ThemeToggle } from "@/src/common/components/themeToggle"
import { useSearchOralsinClinics } from "@/src/common/hooks/useOralsin"

type Props = {
  mode?: "signin" | "signup"
}

/**
 * LoginForm Component
 * Gerencia tanto o login quanto o cadastro de forma centralizada.
 * A lógica de estado assíncrono (loading, error) é gerenciada pelos hooks.
 */
export default function LoginForm({ mode = "signin" }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // Estados locais para os campos do formulário
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [role, setRole] = useState<IUserCreateDTO["role"]>("clinic")
  const [clinicName, setClinicName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [clinicSearch, setClinicSearch] = useState("")
  const [cordialBillingConfig, setCordialBillingConfig] = useState<number>(90)

  const { data: oralsinClinics, isLoading: isLoadingClinics } = useSearchOralsinClinics(clinicSearch)

  const redirect = searchParams.get("redirect") || "/clinica/dashboard"

  // Hooks de mutação do TanStack Query
  const loginMutation = useLogin()
  const registrationMutation = useCreateRegistrationRequest()
  const { refetch } = useCurrentUser();

  const handleLoginSuccess = async () => {
    toast({
      title: "Login bem-sucedido!",
      description: `Bem-vindo(a) de volta.`,
    });

    const { data: user } = await refetch(); 

    const targetPath = user?.role === "admin" ? "/admin/pendentes" : "/clinica/dashboard";
    router.push(targetPath);
    router.refresh();
  };

  useEffect(() => {
    const loginError = loginMutation.error as any
    const registrationError = registrationMutation.error as any // Observar erro da nova mutação

    if (loginError || registrationError) {
      const errorMessage =
        loginError?.response?.data?.detail ||
        registrationError?.response?.data?.detail ||
        "Ocorreu um erro. Verifique seus dados."
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }, [loginMutation.error, registrationMutation.error, toast])

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (mode === "signin") {
      loginMutation.mutate(
        { email, password },
        {
          onSuccess: handleLoginSuccess,
        },
      )
    } else {
      const registrationData: IRegistrationRequestCreateDTO = {
        email,
        password,
        name,
        clinic_name: clinicName,
        cordial_billing_config: cordialBillingConfig,
      }

      // Chamar a nova mutação
      registrationMutation.mutate(registrationData, {
        onSuccess: () => {
          toast({
            title: "Solicitação enviada com sucesso!",
            description: "Seu cadastro está pendente de aprovação. Entraremos em contato em breve.",
          })
          router.push("/login")
        },
      })
    }
  }

  const isPending = loginMutation.isPending || registrationMutation.isPending

  return (
    <div className="min-h-screen flex">
      {/* Lado esquerdo - Formulário */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 xl:px-12 bg-white dark:bg-gray-950">
        {/* Header com navegação */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Link>
          </Button>
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md mx-auto">
          {/* Logo e título */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Image
                  src="/images/OralsinGestaoInteligenteLogo.png?height=64&width=64"
                  alt="Oralsin Logo"
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-xl shadow-lg"
                />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {mode === "signin" ? "Bem-vindo de volta!" : "Crie sua conta"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {mode === "signin"
                ? "Acesse seu sistema de gestão de recebíveis"
                : "Comece a reduzir a inadimplência da sua clínica"}
            </p>
          </div>

          {/* Formulário */}
          <Card className="border-0 shadow-xl bg-white dark:bg-gray-900">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-xl font-semibold text-center">
                {mode === "signin" ? "Fazer login" : "Solicitar cadastro"}
              </CardTitle>
              {mode === "signup" && (
                <div className="flex items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Shield className="h-4 w-4 text-emerald-600" />
                    <span>Dados seguros</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-emerald-600" />
                    <span>Setup em 2 min</span>
                  </div>
                </div>
              )}
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleFormSubmit} className="space-y-5">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={50}
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 text-base"
                  />
                </div>

                {/* Senha */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Senha
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={mode === "signup" ? 8 : 1}
                      maxLength={100}
                      placeholder={mode === "signup" ? "Mínimo 8 caracteres" : "Digite sua senha"}
                      autoComplete={mode === "signin" ? "current-password" : "new-password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 text-base pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-11 px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  {mode === "signup" && (
                    <p className="text-xs text-gray-500">Use pelo menos 8 caracteres com letras e números</p>
                  )}
                </div>

                {/* Campos adicionais para cadastro */}
                {mode === "signup" && (
                  <>
                    <Separator className="my-6" />

                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Nome Completo
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        required
                        placeholder="Dr. João Silva"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-11 text-base"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Período mínimo para Cobrança Amigável
                      </Label>
                      <Input
                        id="cordialBillingConfig"
                        type="number"
                        required
                        placeholder="90"
                        value={cordialBillingConfig}
                        onChange={(e) => setCordialBillingConfig(Number(e.target.value))}
                        className="h-11 text-base"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Tipo de Conta
                      </Label>
                      <Select value={role} onValueChange={(value) => setRole(value as IUserCreateDTO["role"])}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Selecione o tipo de conta" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="clinic">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                              <span>Clínica Ortodôntica</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {role === "clinic" && (
                      <div className="space-y-2">
                      <Label htmlFor="clinic_name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Nome da Clínica
                      </Label>
                      <Input
                        id="clinic_search"
                        type="text"
                        placeholder="Digite para buscar sua clínica..."
                        value={clinicSearch}
                        onChange={(e) => setClinicSearch(e.target.value)}

                        className="h-11 text-base"
                      />
                      <Select
                        value={clinicName}
                        onValueChange={setClinicName}
                        disabled={isLoadingClinics || !oralsinClinics?.data}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Selecione sua clínica" />
                        </SelectTrigger>
                        <SelectContent>
                          {isLoadingClinics ? (
                            <div className="flex items-center justify-center p-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                            </div>
                          ) : (
                            oralsinClinics?.data.map((clinic) => (
                              <SelectItem key={clinic.idClinica} value={clinic.nomeClinica}>
                                {clinic.nomeClinica}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    )}
                  </>
                )}

                {/* Botão de submit */}
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full h-11 text-base font-medium bg-emerald-600 hover:bg-emerald-700 text-white"
                  size="lg"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      {mode === "signin" ? "Entrando..." : "Enviando solicitação..."}
                    </>
                  ) : mode === "signin" ? (
                    "Entrar na conta"
                  ) : (
                    "Solicitar Cadastro"
                  )}
                </Button>
              </form>

              {/* Link para alternar entre login/cadastro */}
              <div className="text-center pt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {mode === "signin" ? "Ainda não tem conta?" : "Já tem uma conta?"}
                  <Link
                    href={mode === "signin" ? `/cadastro?redirect=${redirect}` : `/login?redirect=${redirect}`}
                    className="ml-1 font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300"
                  >
                    {mode === "signin" ? "Solicitar registro" : "Fazer login"}
                  </Link>
                </p>
              </div>

              {/* Termos e política (apenas para cadastro) */}
              {mode === "signup" && (
                <div className="text-center pt-4 border-t">
                  <p className="text-xs text-gray-500">
                    Ao criar uma conta, você concorda com nossos{" "}
                    <Link href="/termos" className="text-emerald-600 hover:text-emerald-500">
                      Termos de Uso
                    </Link>{" "}
                    e{" "}
                    <Link href="/privacidade" className="text-emerald-600 hover:text-emerald-500">
                      Política de Privacidade
                    </Link>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Lado direito - Informações e benefícios */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-emerald-600 to-teal-700 relative overflow-hidden">
        {/* Padrão de fundo */}
        <div className="absolute inset-0 opacity-10" />

        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 text-white">
          <div className="max-w-md">
            <h2 className="text-4xl font-bold mb-6">
              {mode === "signin" ? "Continue sua jornada" : "Transforme sua gestão financeira"}
            </h2>
            <p className="text-xl text-emerald-100 mb-8">
              {mode === "signin"
                ? "Acesse seus dashboards, relatórios e automações de cobrança."
                : "Junte-se a centenas de clínicas que reduziram sua inadimplência em até 70%."}
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Automação Inteligente</h3>
                  <p className="text-emerald-100 text-sm">Notificações automáticas por e-mail, SMS e WhatsApp</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Dashboards em Tempo Real</h3>
                  <p className="text-emerald-100 text-sm">Métricas completas de inadimplência e projeções</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Implementação Rápida</h3>
                  <p className="text-emerald-100 text-sm">Sistema funcionando em 24 horas com suporte completo</p>
                </div>
              </div>
            </div>

            {/* Estatísticas */}
            <div className="mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold">24h</div>
                <div className="text-emerald-200 text-sm">Implementação completa</div>
              </div>
            </div>
          </div>
        </div>

        {/* Elementos decorativos */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl" />
        <div className="absolute bottom-20 right-32 w-24 h-24 bg-white/10 rounded-full blur-xl" />
      </div>
    </div>
  )
}
