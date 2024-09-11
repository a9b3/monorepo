export type CSSValueType =
  | 'color'
  | 'length'
  | 'time'
  | 'angle'
  | 'number'
  | 'string'
  | 'percentage'
  | 'function'
  | 'custom property'
  | 'unknown'

export function determineCssValueType(value: string): CSSValueType {
  // Remove leading and trailing whitespace
  value = value.trim().toLowerCase()

  // Check for custom properties
  if (/^var\(--[a-zA-Z0-9-]+\)$/.test(value)) {
    return 'custom property'
  }

  // Check for color values
  if (
    /^#([0-9a-f]{3}){1,2}$/.test(value) ||
    /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/.test(value) ||
    /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*(?:0?\.\d+|1|0)\s*\)$/.test(value) ||
    /^hsl\(\s*\d+\s*,\s*\d+%?\s*,\s*\d+%?\s*\)$/.test(value) ||
    /^hsla\(\s*\d+\s*,\s*\d+%?\s*,\s*\d+%?\s*,\s*(?:0?\.\d+|1|0)\s*\)$/.test(value) ||
    ['black', 'white', 'red', 'green', 'blue', 'yellow', 'purple', 'gray', 'orange'].includes(value)
  ) {
    return 'color'
  }

  // Check for length values
  if (/^-?\d+(?:\.\d+)?(?:px|em|rem|vh|vw|vmin|vmax|ch|ex|cm|mm|in|pt|pc)$/.test(value)) {
    return 'length'
  }

  // Check for percentage values
  if (/^-?\d+(?:\.\d+)?%$/.test(value)) {
    return 'percentage'
  }

  // Check for time values
  if (/^-?\d+(?:\.\d+)?(?:s|ms)$/.test(value)) {
    return 'time'
  }

  // Check for angle values
  if (/^-?\d+(?:\.\d+)?(?:deg|rad|grad|turn)$/.test(value)) {
    return 'angle'
  }

  // Check for number values
  if (/^-?\d+(?:\.\d+)?$/.test(value)) {
    return 'number'
  }

  // Check for string values (anything in quotes)
  if (/^["'].+["']$/.test(value)) {
    return 'string'
  }

  // Check for function values
  if (/^[a-z-]+\(.*\)$/.test(value)) {
    return 'function'
  }

  // If none of the above, it's an unknown type
  return 'unknown'
}
