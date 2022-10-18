/**
 * Turn a class instance into a JSON object. Use this to save into database or
 * copy pasting or sending data to others.
 *
 * The classes should be wrtten in a way they can be instantiated using the JSON
 * object that they produce.
 */
export function toJSON(obj: object) {
  return JSON.parse(
    JSON.stringify(obj, (key, value) => {
      if (key.startsWith('_')) {
        return undefined
      }
      return value
    })
  )
}
