"use client"

import { Button } from "@/src/common/components/ui/button"
import { ArrowRight, Loader2 } from "lucide-react"
import { useFormStatus } from "react-dom"

interface SubmitButtonProps {
  planName?: string
  isEnterprise?: boolean
}

export function SubmitButton({ planName = "plano", isEnterprise = false }: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={pending}
      size="lg"
      className={`w-full ${isEnterprise ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}
      variant={isEnterprise ? "default" : "outline"}
    >
      {pending ? (
        <>
          <Loader2 className="animate-spin mr-2 h-4 w-4" />
          Processando...
        </>
      ) : (
        <>
          {isEnterprise ? "Falar com Vendas" : `Começar Teste Grátis - ${planName}`}
          <ArrowRight className="ml-2 h-4 w-4" />
        </>
      )}
    </Button>
  )
}
