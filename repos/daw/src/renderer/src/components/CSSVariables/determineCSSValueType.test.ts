import { determineCssValueType, CSSValueType } from './determineCSSValueType'

describe('determineCssValueType', () => {
  const testCases: [string, CSSValueType][] = [
    ['#ff0000', 'color'],
    ['rgb(255, 0, 0)', 'color'],
    ['rgba(255, 0, 0, 0.5)', 'color'],
    ['hsl(0, 100%, 50%)', 'color'],
    ['hsla(0, 100%, 50%, 0.5)', 'color'],
    ['red', 'color'],
    ['10px', 'length'],
    ['2.5em', 'length'],
    ['-50%', 'percentage'],
    ['500ms', 'time'],
    ['90deg', 'angle'],
    ['0.8', 'number'],
    ['"Hello, world!"', 'string'],
    ['var(--custom-property)', 'custom property'],
    ['calc(100% - 20px)', 'function'],
    ['url("image.jpg")', 'function'],
    ['linear-gradient(to right, red, blue)', 'function'],
    ['invalid-value', 'unknown']
  ]

  test.each(testCases)('determineCssValueType("%s") should return %s', (input, expectedOutput) => {
    expect(determineCssValueType(input)).toBe(expectedOutput)
  })

  test('should handle whitespace', () => {
    expect(determineCssValueType('  10px  ')).toBe('length')
  })

  test('should be case-insensitive', () => {
    expect(determineCssValueType('RGB(255, 0, 0)')).toBe('color')
  })

  test('should correctly identify custom properties', () => {
    expect(determineCssValueType('var(--custom-property)')).toBe('custom property')
    expect(determineCssValueType('var(--another-prop)')).toBe('custom property')
    expect(determineCssValueType('var(--123)')).toBe('custom property')
  })
})
