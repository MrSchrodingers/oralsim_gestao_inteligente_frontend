/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect, useMemo } from "react"
import { Loader2, Eye, EyeOff, CheckCircle, Shield, Clock, ArrowLeft } from "lucide-react"
import { Button } from "@/src/common/components/ui/button"
import { Input } from "@/src/common/components/ui/input"
import { Label } from "@/src/common/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/common/components/ui/card"
import { Separator } from "@/src/common/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/common/components/ui/select"
import { useToast } from "@/src/common/components/ui/use-toast"
import type { IRegistrationRequestCreateDTO, IUserCreateDTO } from "@/src/common/interfaces/IUser"
import { useCreateRegistrationRequest, useCurrentUser, useLogin } from "@/src/common/hooks/useUser"
import { ThemeToggle } from "@/src/common/components/themeToggle"
import { useSearchOralsinClinics } from "@/src/common/hooks/useOralsin"

type Props = {
  mode?: "signin" | "signup"
}

// utils simples
const onlyDigits = (s: string) => s.replace(/\D+/g, "")
const clamp = (s: string, max: number) => (s.length > max ? s.slice(0, max) : s)

/** Formata número BR local (sem 55) em exibição humana */
function formatBrLocalPhone(local: string): string {
  // local = AA + número (10 ou 11 no total)
  const v = onlyDigits(local)
  if (v.length <= 2) return v // DDD
  const ddd = v.slice(0, 2)
  const rest = v.slice(2)

  if (rest.length <= 4) return `(${ddd}) ${rest}`
  if (rest.length <= 8) return `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4)}`

  // 10 ou 11 dígitos
  if (rest.length === 9) {
    // celular (9 dígitos)
    return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5)}`
  }
  // rest.length >= 10 (garantimos no clamp)
  // quando 10: fixo (4+4)
  // quando 11: celular (5+4)
  if (rest.length === 10) return `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4)}`
  return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5)}`
}

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

  // Novo estado: telefone (armazenamos somente números SEM o 55; adicionamos o 55 no submit)
  const [contactPhoneLocal, setContactPhoneLocal] = useState("") // ex.: "11998765432" (DDD+numero, sem 55)
  const contactPhoneDisplay = useMemo(() => formatBrLocalPhone(clamp(contactPhoneLocal, 11)), [contactPhoneLocal])

  const { data: oralsinClinics, isLoading: isLoadingClinics } = useSearchOralsinClinics(clinicSearch)

  const redirect = searchParams.get("redirect") || "/clinica/dashboard"

  // Hooks de mutação
  const loginMutation = useLogin()
  const registrationMutation = useCreateRegistrationRequest()
  const { refetch } = useCurrentUser()

  const handleLoginSuccess = async () => {
    toast({
      title: "Login bem-sucedido!",
      description: `Bem-vindo(a) de volta.`,
    })

    const { data: user } = await refetch()
    const targetPath = user?.role === "admin" ? "/admin/pendentes" : "/clinica/dashboard"
    router.push(targetPath)
    router.refresh()
  }

  useEffect(() => {
    const loginError = loginMutation.error as any
    const registrationError = registrationMutation.error as any

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
        { onSuccess: handleLoginSuccess },
      )
    } else {
      // Monta o telefone apenas com dígitos, incluindo 55
      const localDigits = clamp(onlyDigits(contactPhoneLocal), 11) // DDD + número
      const digitsWith55 = `55${localDigits}`

      // validação rápida (55 + 10~11 dígitos => 12~13 no total)
      if (digitsWith55.length < 12 || digitsWith55.length > 13) {
        toast({
          title: "Telefone inválido",
          description: "Informe DDD + número (10 ou 11 dígitos).",
          variant: "destructive",
        })
        return
      }

      const registrationData: IRegistrationRequestCreateDTO = {
        email,
        password,
        name,
        clinic_name: clinicName,
        cordial_billing_config: cordialBillingConfig,
        contact_phone: digitsWith55,
      }

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
                      {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
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

                    {/* Telefone de contato */}
                    <div className="space-y-2">
                      <Label htmlFor="contact_phone" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Telefone de Contato
                      </Label>
                      <div className="relative">
                        {/* prefixo +55 com bandeira */}
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pr-2 pointer-events-none">
                          <span className="mr-1">🇧🇷</span>
                          <span className="text-gray-600 dark:text-gray-300 text-sm font-medium select-none">+55</span>
                        </div>
                        <Input
                          id="contact_phone"
                          type="tel"
                          inputMode="numeric"
                          placeholder="(11) 91234-5678"
                          value={contactPhoneDisplay}
                          onChange={(e) => {
                            const digits = onlyDigits(e.target.value)
                            // removemos qualquer 55 que a pessoa digite manualmente
                            const no55 = digits.startsWith("55") ? digits.slice(2) : digits
                            setContactPhoneLocal(clamp(no55, 11))
                          }}
                          className="h-11 text-base pl-20" /* espaço pro prefixo */
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        Inclua DDD. Salvaremos apenas números com o código do país (ex.: 5511998765432).
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cordialBillingConfig" className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">
                      {i === 0 ? "Automação Inteligente" : i === 1 ? "Dashboards em Tempo Real" : "Implementação Rápida"}
                    </h3>
                    <p className="text-emerald-100 text-sm">
                      {i === 0
                        ? "Notificações automáticas por e-mail, SMS e WhatsApp"
                        : i === 1
                        ? "Métricas completas de inadimplência e projeções"
                        : "Sistema funcionando em 24 horas com suporte completo"}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold">24h</div>
                <div className="text-emerald-200 text-sm">Implementação completa</div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl" />
        <div className="absolute bottom-20 right-32 w-24 h-24 bg-white/10 rounded-full blur-xl" />
      </div>
    </div>
  )
}
