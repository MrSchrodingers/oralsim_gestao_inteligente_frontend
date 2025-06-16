import { MessageTemplate, MessageChannel } from "@/src/common/interfaces/IMessage";
import { Mail, MessageSquare, Phone } from "lucide-react";
import { Badge } from "@common/components/ui/badge";

// Função pura para criar um novo template
export function createNewTemplate(
  activeTab: MessageTemplate["channel"]
): MessageTemplate {
  return {
    id: `new-${Date.now()}`,
    title: "",
    channel: activeTab,
    step: 1,
    content:
      activeTab === "email"
        ? "<p>Digite o conteúdo do email aqui...</p>"
        : "Digite sua mensagem aqui...",
    isActive: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    maxLength: activeTab === "sms" ? 160 : undefined,
    variables: ["nome"],
  };
}

// Função que executa a criação do template e atualiza os estados
export function handleCreateTemplate({
  activeTab,
  setEditingTemplate,
  setIsCreating,
}: {
  activeTab: MessageTemplate["channel"];
  setEditingTemplate: React.Dispatch<React.SetStateAction<MessageTemplate | null>>;
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const newTemplate = createNewTemplate(activeTab);
  setEditingTemplate(newTemplate);
  setIsCreating(true);
}

// Função pura para substituir variáveis no conteúdo
export function processContent(
  content: string,
  previewData: Record<string, string>
): string {
  let processedContent = content;
  Object.entries(previewData).forEach(([key, value]) => {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
    processedContent = processedContent.replace(regex, value);
  });
  return processedContent;
}

// Funções para obter ícone, cor e badge do canal
export function getChannelIcon(channel: MessageChannel) {
  switch (channel) {
    case "email":
      return <Mail className="h-5 w-5" />;
    case "whatsapp":
      return <MessageSquare className="h-5 w-5" />;
    case "sms":
      return <Phone className="h-5 w-5" />;
  }
}

export function getChannelColor(channel: MessageChannel) {
  switch (channel) {
    case "email":
      return "text-blue-600 dark:text-blue-400";
    case "whatsapp":
      return "text-green-600 dark:text-green-400";
    case "sms":
      return "text-purple-600 dark:text-purple-400";
  }
}

export function getChannelBadge(channel: MessageChannel) {
  switch (channel) {
    case "email":
      return <Badge className="bg-blue-600 dark:bg-blue-700">Email</Badge>;
    case "whatsapp":
      return <Badge className="bg-green-600 dark:bg-green-700">WhatsApp</Badge>;
    case "sms":
      return <Badge className="bg-purple-600 dark:bg-purple-700">SMS</Badge>;
  }
}
