import primatives from './generated/primatives'

interface ColorValue {
  r: number
  g: number
  b: number
  a: number
}

function convertTo255(val: number) {
  return val * 255
}

function convertRGBA(color: ColorValue): string {
  return `rgba(${convertTo255(color.r)}, ${convertTo255(
    color.g
  )}, ${convertTo255(color.b)}, ${color.a})`
}

export function loadCSS(styles: typeof primatives): string {
  const renderedAllCSSVarStr = Object.entries(styles.all)
    .map(([key, v]) => {
      let value
      if (v.ref) {
        value = `var(--${v.ref})`
      } else if (v.type === 'COLOR') {
        value = convertRGBA(v.value)
      } else {
        value = v.value
      }

      return `--${key}: ${value};`
    })
    .join('\n')

  return `<style>
    :root {
      ${renderedAllCSSVarStr}
    }
  </style>`
}

export function loadPrimatives() {
  return loadCSS(primatives)
}
