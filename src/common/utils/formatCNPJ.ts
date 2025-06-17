export const formatCNPJ = (cnpj?: string | null): string => {
  if (!cnpj) return "";
  
  const digits = cnpj.replace(/\D/g, ""); // remove tudo que não é número

  if (digits.length !== 14) return cnpj; // retorna original se não for um CNPJ válido

  return digits.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
};
