import { Eye } from "lucide-react"
import { extractVariables } from "../../utils/extractVariables"
import { formatDate } from "../../utils/formatters"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Badge } from "../ui/badge"
import { getChannelBadge, getChannelIcon } from "../helpers/GetBadge"

export const MessagePreview = ({ message }: { message: any }) => {
  const variables = extractVariables(message.content)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getChannelIcon(message.type)}
            Visualizar Mensagem - Step {message.step}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Tipo</label>
              <div className="mt-1">{getChannelBadge(message.type)}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Step</label>
              <p className="mt-1 font-medium">Etapa {message.step}</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Variáveis Disponíveis</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {variables.map((variable, index) => (
                <Badge key={index} variant="outline">
                  {variable}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Conteúdo da Mensagem</label>
            <div className="mt-2 p-4 bg-muted rounded-lg">
              {message.type === "email" ? (
                <div dangerouslySetInnerHTML={{ __html: message.content }} />
              ) : (
                <p className="whitespace-pre-wrap">{message.content}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <span className="font-medium">Criado em:</span> {formatDate(message.created_at)}
            </div>
            <div>
              <span className="font-medium">Atualizado em:</span> {formatDate(message.updated_at)}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}