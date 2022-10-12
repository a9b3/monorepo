export function instanceToJson(obj: any) {
  return JSON.parse(
    JSON.stringify(obj, (key, value) => {
      if (key.startsWith('_')) {
        return undefined
      }
      return value
    })
  )
}
