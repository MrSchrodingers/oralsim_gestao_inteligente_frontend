import { Button } from "@/src/common/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/common/components/ui/card"
import { Badge } from "@/src/common/components/ui/badge"
import {
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Shield,
  Zap,
  BarChart3,
  MessageSquare,
  Database,
  Clock,
  Users,
  Target,
  Workflow,
  CreditCard,
  Activity,
  Star,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <main className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
            <div className="lg:col-span-6">
              <Badge className="mb-4 bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                Sistema de Gestão Inteligente
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Gerencie a inadimplência da sua
                <span className="block text-emerald-600 dark:text-emerald-400">clínica ortodôntica</span>
              </h1>
              <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Sistema completo de gestão de recebíveis com automação inteligente, notificações multicanal e dashboards
                em tempo real. Desenvolvido especificamente para clínicas ortodônticas.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link href="/demo" passHref>
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg">
                    Solicitar Demonstração
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/pricing" passHref>
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-8 py-4 text-lg border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                  >
                    Ver Preços
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <span>Implementação em 24h</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-emerald-600" />
                  <span>Dados 100% seguros</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-emerald-600" />
                  <span>Automação completa</span>
                </div>
              </div>
            </div>
            <div className="mt-12 lg:mt-0 lg:col-span-6">
              <div className="relative">
                <Image
                  src="/images/Dash_Demo.png?height=500&width=600"
                  alt="Dashboard do Sistema Oralsin"
                  width={600}
                  height={500}
                  className="rounded-xl shadow-2xl"
                />
                <div className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium">Sistema Online</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-emerald-600 dark:bg-emerald-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-3xl lg:text-4xl font-bold">24h</div>
              <div className="text-emerald-100 mt-2">Implementação completa</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold">3</div>
              <div className="text-emerald-100 mt-2">Canais de comunicação</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold">99.9%</div>
              <div className="text-emerald-100 mt-2">Uptime garantido</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problems & Solutions */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Problemas que resolvemos para sua clínica</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Desenvolvido especificamente para as necessidades de clínicas ortodônticas
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Alto índice de inadimplência</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Pacientes esquecem dos pagamentos e a cobrança manual é ineficiente
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Processos manuais demorados</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Tempo perdido com ligações, e-mails e controle manual de pagamentos
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Falta de visibilidade financeira</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Sem relatórios claros sobre recebíveis e projeções de fluxo de caixa
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center">
                  <Zap className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Automação inteligente</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Notificações automáticas por e-mail, SMS e WhatsApp com regras personalizáveis
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center">
                  <Activity className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Dashboards em tempo real</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Métricas completas de inadimplência, taxa de recuperação e projeções
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Foco no resultado</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Redução comprovada de até 70% na inadimplência em 30 dias
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Funcionalidades completas para sua clínica</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Tudo que você precisa para otimizar a gestão financeira da sua clínica ortodôntica
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-emerald-600" />
                </div>
                <CardTitle>Notificações Multicanal</CardTitle>
                <CardDescription>E-mail, SMS e WhatsApp automatizados com templates personalizáveis</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-emerald-600" />
                </div>
                <CardTitle>Dashboards Inteligentes</CardTitle>
                <CardDescription>Métricas em tempo real com Prometheus e Grafana integrados</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center mb-4">
                  <Database className="h-6 w-6 text-emerald-600" />
                </div>
                <CardTitle>Sincronização Automática</CardTitle>
                <CardDescription>Integração direta com sistemas existentes via API robusta</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center mb-4">
                  <Workflow className="h-6 w-6 text-emerald-600" />
                </div>
                <CardTitle>Fluxos Personalizáveis</CardTitle>
                <CardDescription>Configure regras de cobrança específicas para cada tipo de tratamento</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-emerald-600" />
                </div>
                <CardTitle>Segurança Avançada</CardTitle>
                <CardDescription>Arquitetura DDD/CQRS com observabilidade completa e backup automático</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center mb-4">
                  <CreditCard className="h-6 w-6 text-emerald-600" />
                </div>
                <CardTitle>Múltiplas Formas de Pagamento</CardTitle>
                <CardDescription>Suporte a cartões, boletos, PIX e transferências bancárias</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Tecnologia de Ponta
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">Arquitetura robusta e escalável</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                Desenvolvido com as melhores práticas de engenharia de software, garantindo performance, segurança e
                disponibilidade.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <span>Arquitetura DDD/CQRS para alta performance</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <span>Containerização com Docker para escalabilidade</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <span>Mensageria assíncrona com RabbitMQ</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <span>Observabilidade completa com Prometheus/Grafana</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <span>Backup automático e recuperação de desastres</span>
                </div>
              </div>
            </div>

            <div className="mt-12 lg:mt-0">
              <Image
                src="/placeholder.svg?height=400&width=500"
                alt="Arquitetura do Sistema"
                width={500}
                height={400}
                className="rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">O que nossos clientes dizem</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Resultados reais de clínicas que transformaram sua gestão financeira
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  "Reduzimos nossa inadimplência em 65% nos primeiros 2 meses. O sistema é intuitivo e a automação nos
                  poupou horas de trabalho manual."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Dr. Ana Silva</div>
                    <div className="text-sm text-gray-500">Clínica OrthoSmile</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  "Os dashboards em tempo real nos deram uma visão completa do nosso fluxo de caixa. Agora tomamos
                  decisões baseadas em dados reais."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Dr. Carlos Mendes</div>
                    <div className="text-sm text-gray-500">Centro Ortodôntico Avançado</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  "A implementação foi super rápida e o suporte é excepcional. Nossos pacientes adoraram receber
                  lembretes automáticos."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Dra. Marina Costa</div>
                    <div className="text-sm text-gray-500">Ortodontia Moderna</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Planos que se adaptam ao seu negócio</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Escolha o plano ideal para o tamanho da sua clínica
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 border-gray-200 dark:border-gray-700">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Starter</CardTitle>
                <CardDescription>Para clínicas pequenas</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">R$ 297</span>
                  <span className="text-gray-500">/mês</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span>Até 500 pacientes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span>Notificações por e-mail</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span>Dashboard básico</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span>Suporte por e-mail</span>
                  </li>
                </ul>
                <Button className="w-full mt-6" variant="outline">
                  Começar Teste Grátis
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-emerald-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-emerald-600 text-white">Mais Popular</Badge>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Professional</CardTitle>
                <CardDescription>Para clínicas em crescimento</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">R$ 497</span>
                  <span className="text-gray-500">/mês</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span>Até 2.000 pacientes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span>E-mail, SMS e WhatsApp</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span>Dashboard completo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span>Fluxos personalizáveis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span>Suporte prioritário</span>
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700">Começar Teste Grátis</Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200 dark:border-gray-700">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Enterprise</CardTitle>
                <CardDescription>Para grandes clínicas</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">R$ 897</span>
                  <span className="text-gray-500">/mês</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span>Pacientes ilimitados</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span>Todos os canais</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span>Analytics avançado</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span>API personalizada</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span>Suporte 24/7</span>
                  </li>
                </ul>
                <Button className="w-full mt-6" variant="outline">
                  Falar com Vendas
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Todos os planos incluem 14 dias de teste grátis • Sem compromisso • Cancele quando quiser
            </p>
            <div className="flex justify-center items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Dados seguros</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>99.9% uptime</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Suporte especializado</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-emerald-600 dark:bg-emerald-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Pronto para reduzir a inadimplência da sua clínica?
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Junte-se a centenas de clínicas que já transformaram sua gestão financeira com o Oralsin. Implementação em
            24 horas e resultados em 30 dias.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-4 text-lg">
              Solicitar Demonstração Gratuita
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-emerald-600 px-8 py-4 text-lg"
            >
              Falar com Especialista
            </Button>
          </div>
          <p className="text-emerald-100 text-sm mt-6">
            💡 Demonstração personalizada • 📞 Consultoria gratuita • ⚡ Implementação rápida
          </p>
        </div>
      </section>
    </main>
  )
}
