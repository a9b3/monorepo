const camelToKebab = str =>
  str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)

export function objectToStyleStr(obj) {
  return Object.entries(obj)
    .map(([key, val]) => {
      return `${camelToKebab(key)}: ${val};`
    })
    .join(' ')
}

export const objectStyle = objectToStyleStr
