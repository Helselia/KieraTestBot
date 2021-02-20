export const toCodeBlock = (code: string, lang = '') => {
  return `${'```'}${lang}\n${code}\n${'```'}`
}
