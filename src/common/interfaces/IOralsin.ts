export interface IOralsinClinic {
  idClinica: number;
  nomeClinica: string;
  razaoSocial: string;
  sigla: string;
  estado: string;
  idCidade: number;
  logradouro: string;
  CEP: string;
  ddd: string;
  telefone1: string | null;
  telefone2: string | null;
  bairro: string;
  cnpj: string;
  ativo: number;
  franquia: number;
  timezone: string | null;
  dataSafra: string | null;
  dataPrimeiroFaturamento: string | null;
  programaIndicaSin: number | null;
  exibeLPOralsin: number | null;
  urlLandpage: string | null;
  urlLPOralsin: string | null;
  urlFacebook: string | null;
  urlChatFacebook: string | null;
  urlWhatsapp: string | null;
  emailLead: string | null;
  nomeCidade: string | null;
}

export interface IOralsinPagedResponse {
  current_page: number;
  data: IOralsinClinic[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}