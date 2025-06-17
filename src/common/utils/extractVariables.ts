export const extractVariables = (content: string) => {
  const matches = content.match(/\{\{\s*\w+\s*\}\}/g)
  return matches ? [...new Set(matches)] : []
}