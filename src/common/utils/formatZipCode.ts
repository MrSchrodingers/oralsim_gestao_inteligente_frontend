export const formatZipCode = (zipCode: string) => {
  return zipCode.replace(/^(\d{5})(\d{3})/, "$1-$2")
}
