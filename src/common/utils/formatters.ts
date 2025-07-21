import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatCPF(cpf: string): string {
  const cleaned = cpf.replace(/\D/g, "");
  if (cleaned.length === 11) {
    return `${cleaned.substring(0, 3)}.${cleaned.substring(3, 6)}.${cleaned.substring(6, 9)}-${cleaned.substring(9, 11)}`;
  }
  return cpf;
}

export const formatPhone = (phone?: string | null ) => {
  if (!phone) return "N/A"
  const cleaned = phone.replace(/\D/g, "")
  if (cleaned.length === 13) {
    return `+${cleaned.slice(0, 2)} (${cleaned.slice(2, 4)}) ${cleaned.slice(4, 9)}-${cleaned.slice(9)}`
  }
  return phone
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 11) {
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7, 11)}`;
  } else if (cleaned.length === 10) {
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 6)}-${cleaned.substring(6, 10)}`;
  }
  return phone;
}

export function formatDate(dateString?: string | null): string {
  if (!dateString) {
    return ""
  }

  const date = parseISO(dateString)
  if (Number.isNaN(date.getTime())) {
    return ""
  }

  return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
}

export function formatDateTime(dateString?: string | null): string {
  if (!dateString) {
    return ""
  }

  try {
    return format(parseISO(dateString), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
  } catch (error) {
    return dateString;
  }
}

export function formatCurrency(value?: string | number | null): string {
  let amount = 0;

  if (value == null) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(0);
  }

  if (typeof value === "number") {
    amount = value;
  } else {
    const str = value.trim();

    if (str.includes(",")) {
      // Se vier “1.234,56” (BR), remove pontos de milhar e troca vírgula por ponto
      const normalized = str.replace(/\./g, "").replace(/,/g, ".");
      amount = parseFloat(normalized) || 0;
    } else {
      // Se vier “1234.56” (EN), deixa o ponto como decimal
      amount = parseFloat(str) || 0;
    }
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);
}


export const formatDateOnly = (dateStr?: string | null) => {
  if (!dateStr) return "N/A"
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(dateStr))
}

export const calculateSubscriptionDays = (startDate: string, endDate: string) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const now = new Date()

  const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  const remainingDays = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  return { totalDays, remainingDays }
}

export const formatDuration = (durationMs: number | null) => {
  if (!durationMs) return null
  const seconds = Math.floor(durationMs / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}
