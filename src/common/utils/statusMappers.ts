import {
  AlertCircle,
  CheckCheck,
  CheckCircle2,
  Clock,
  HelpCircle,
  XCircle,
} from "lucide-react";
import type { LucideProps } from "lucide-react";
import type { FC } from "react";

interface IStatusConfig {
  label: string;
  color: "default" | "secondary" | "destructive" | "outline";
  icon: FC<LucideProps>;
}

export const syncStatusMapper: Record<string, IStatusConfig> = {
  pending: {
    label: "Pendente",
    color: "secondary",
    icon: Clock,
  },
  created: {
    label: "Criado",
    color: "default",
    icon: CheckCircle2,
  },
  updated: {
    label: "Atualizado",
    color: "default",
    icon: CheckCheck,
  },
  error: {
    label: "Erro",
    color: "destructive",
    icon: XCircle,
  },
  default: {
    label: "Desconhecido",
    color: "outline",
    icon: HelpCircle,
  },
};

export const dealStatusMapper: Record<string, IStatusConfig> = {
  open: {
    label: "Aberto",
    color: "destructive",
    icon: AlertCircle,
  },
  closed: {
    label: "Fechado",
    color: "default",
    icon: CheckCircle2,
  },
  default: {
    label: "Desconhecido",
    color: "outline",
    icon: HelpCircle,
  },
};