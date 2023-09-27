import primativesJSON from './primatives.json'

type FloatValue = number
type RefValue = string
interface ColorValue {
  r: number
  g: number
  b: number
  a: number
}
type ValueT = FloatValue | RefValue | ColorValue

interface ConvertedTokens {
  all: { [index: string]: ValueT }
  colors: string[]
  floats: string[]
}

const TYPES = {
  COLOR: 'COLOR',
  FLOAT: 'FLOAT',
}

function convertKeys(key: string, ns?: string) {
  if (ns) {
    return [ns, ...key.toLowerCase().split('/')].join('_')
  }
  return key.toLowerCase().split('/').join('_')
}

function convertTo255(val: number) {
  return val * 255
}

function convertRGBA(color: ColorValue): string {
  return `rgba(${convertTo255(color.r)}, ${convertTo255(
    color.g
  )}, ${convertTo255(color.b)}, ${color.a})`
}

function convertToCSSVar(key: string, value: string | number) {
  return `--${key}: ${value};`
}

/**
 * Convert the output JSON from the figma import/export plugin
 * https://www.figma.com/community/plugin/1256972111705530093/export-import-variables
 */
function convert(obj: typeof primativesJSON, ns?: string): ConvertedTokens {
  const m: { [index: string]: ValueT } = {}
  const refs: string[] = []
  const colors = []
  const floats = []

  for (let i = 0; i < obj.variables.length; i += 1) {
    const variable = obj.variables[i]

    const { name: origName, type } = variable
    const name = convertKeys(origName, ns)
    const value = variable.resolvedValuesByMode['1820:0'].resolvedValue
    const ref = variable.resolvedValuesByMode['1820:0'].aliasName

    if (ref) {
      refs.push(name)
      m[name] = convertKeys(ref, ns)
    } else {
      m[name] = value
    }

    if (type === TYPES.COLOR) {
      colors.push(name)
    }
    if (type === TYPES.FLOAT) {
      floats.push(name)
    }
  }

  const handler = {
    get(target: any, prop: any, receiver: any) {
      if (refs.includes(prop)) {
        return Reflect.get(target, target[prop], receiver)
      }
      return Reflect.get(target, prop, receiver)
    },
  }
  const modified = new Proxy(m, handler)

  return {
    all: modified,
    colors,
    floats,
  }
}

function getPrimatives() {
  return convert(primativesJSON, 'primatives')
}

export function loadCSS(styles: ConvertedTokens): string {
  const renderedAllCSSVarStr = Object.entries(styles.all)
    .map(([key, value]) => {
      let convertedValue = value
      if (styles.colors.includes(key)) {
        convertedValue = convertRGBA(convertedValue as ColorValue)
      }

      return convertToCSSVar(key, convertedValue as any)
    })
    .join('\n')

  return `<style>
    :root {
      ${renderedAllCSSVarStr}
    }
  </style>`
}

export function loadPrimatives() {
  return loadCSS(getPrimatives())
}

export const primatives = getPrimatives()
