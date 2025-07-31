export interface IDealStage {
  id: string;
  name: string;
}

export const dealStagesData: IDealStage[] = [
  { id: "6", name: "Potenciais Clínicas"},
  { id: "7", name: "Com interesse"},
  { id: "8", name: "Docs. Solicitado"},
  { id: "9", name: "Enviar Contrato"},
  { id: "10", name: "Contrato Assinado"},
  { id: "11", name: "Ag. Assinatura"},
  { id: "12", name: "Planilha Enviada"},
  { id: "13", name: "Reunião Agendada"},
  { id: "14", name: "Sem interesse"},
  { id: "15", name: "Novas Cobranças"},
  { id: "16", name: "Iniciar Cobrança"},
  { id: "17", name: "Em negociação"},
  { id: "19", name: "APROVADO/CADASTRO HUB"},
  { id: "20", name: "Não Localizado"},
  { id: "21", name: "Enviado- T.I"},
  { id: "22", name: "Planilha processada"},
  { id: "23", name: "1º Contato"},
  { id: "24", name: "Ag. Aprovação da Clínica"},
  { id: "25", name: "Relatório mensal"},
  { id: "26", name: "Não cobrar"},
  { id: "27", name: "ADM VERIFICAR "},
  { id: "28", name: "ACOMPANHAR PARCELADO"},
  { id: "29", name: "PGTO PRIMEIRA PARCELA"},
  { id: "30", name: "Localizado sem interesse"},
];

export const dealStageMapper: Record<string, string> = dealStagesData.reduce((acc, stage) => {
  acc[stage.id] = stage.name;
  return acc;
}, {} as Record<string, string>);

export const getDealStageNameById = (id: string | number | null | undefined): string => {
  if (id === null || id === undefined) {
    return "Não definido";
  }
  return dealStageMapper[String(id)] || `Estágio Desconhecido (${id})`;
};