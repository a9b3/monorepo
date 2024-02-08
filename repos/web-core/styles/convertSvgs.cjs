/**
 * Run this script to generate ./src/svgData.json which will contain the path d
 * value for each svg this can be used to build a customized icon component.
 *
 *    node ./convertSvgs.cjs
 */
const fs = require('fs')
const path = require('path')
const cheerio = require('cheerio')

const GENERATED_DIR = path.join(__dirname, './src/generated')
const PRIMATIVES_JSON_PATH = path.join(__dirname, './exports/primatives.json')
const PRIMATIVES_TS_OUTPUT_PATH = path.join(GENERATED_DIR, 'primatives.ts')
const PRIMATIVES_CSS_OUTPUT_PATH = path.join(GENERATED_DIR, 'primatives.css')
const SVG_STROKE_DIRECTORY = path.join(__dirname, './exports/svgs/stroke')
const SVG_DATA_OUTPUT_PATH = path.join(GENERATED_DIR, 'svgData.ts')

function generateSVG() {
  const svgs = fs.readdirSync(SVG_STROKE_DIRECTORY)

  const output = {
    stroke: {},
    fill: {},
  }

  for (let i = 0; i < svgs.length; i += 1) {
    const svgName = path.parse(svgs[i]).name
    const svgFilePath = path.join(SVG_STROKE_DIRECTORY, svgs[i])

    const content = fs.readFileSync(svgFilePath)
    const html = cheerio.load(content.toString())
    const dValue = html('path').attr('d')
    const isFill = Boolean(html('path').attr('fill'))
    const isStroke = Boolean(html('path').attr('stroke'))

    output.stroke[svgName] = {
      d: dValue,
      isFill,
      isStroke,
    }
  }

  fs.writeFileSync(
    SVG_DATA_OUTPUT_PATH,
    `export default Object.freeze(${JSON.stringify(output)})`
  )
}

function convertKeys(key, namespace) {
  if (namespace) {
    return [namespace, ...key.toLowerCase().split('/')].join('_')
  }
  return key.toLowerCase().split('/').join('_')
}

function generatePrimatives() {
  const primJson = require(PRIMATIVES_JSON_PATH)
  const namespace = 'pv'

  const output = {
    all: {},
    color: {},
    float: {},
  }

  for (let i = 0; i < primJson.variables.length; i += 1) {
    const variable = primJson.variables[i]
    const { name: origName, type } = variable
    const name = convertKeys(origName, namespace)
    const value = variable.resolvedValuesByMode['1820:0'].resolvedValue
    const ref =
      variable.resolvedValuesByMode['1820:0'].aliasName &&
      convertKeys(variable.resolvedValuesByMode['1820:0'].aliasName, namespace)

    output.all[name] = {
      name,
      value,
      ref,
      type,
    }

    if (type === 'COLOR') {
      output.color[name] = true
    }
    if (type === 'FLOAT') {
      output.float[name] = true
    }
  }

  fs.writeFileSync(
    PRIMATIVES_TS_OUTPUT_PATH,
    `export default Object.freeze(${JSON.stringify(output)})
  `
  )
  fs.writeFileSync(
    path.join(GENERATED_DIR, 'primatives.json'),
    JSON.stringify(output)
  )
}

function convertTo255(val) {
  return val * 255
}

function convertRGBA(color) {
  return `rgba(${convertTo255(color.r)}, ${convertTo255(
    color.g
  )}, ${convertTo255(color.b)}, ${color.a})`
}

function loadCSS(styles) {
  const baseSpacing = styles.all['pv_spacing_1'].value
  const renderedAllCSSVarStr = Object.entries(styles.all)
    .map(([key, v]) => {
      let value
      if (v.ref) {
        value = `var(--${v.ref})`
      } else if (v.type === 'COLOR') {
        value = convertRGBA(v.value)
      } else if (v.type === 'FLOAT') {
        value = `${v.value / baseSpacing}em`
      } else {
        value = v.value
      }

      return `--${key}: ${value};`
    })
    .sort()
    .join('\n')

  const outputContent = `:root {
    ${renderedAllCSSVarStr}
  }`
  fs.writeFileSync(PRIMATIVES_CSS_OUTPUT_PATH, outputContent)
}

function main() {
  console.log(`removing ${path.relative(__dirname, GENERATED_DIR)}`)
  fs.rmSync(GENERATED_DIR, { recursive: true })
  console.log(`creating ${path.relative(__dirname, GENERATED_DIR)}`)
  fs.mkdirSync(GENERATED_DIR)

  generateSVG()
  console.log(`outputted to ${path.relative(__dirname, SVG_DATA_OUTPUT_PATH)}`)
  generatePrimatives()
  console.log(
    `outputted to ${path.relative(__dirname, PRIMATIVES_TS_OUTPUT_PATH)}`
  )

  const pim = require(path.join(GENERATED_DIR, 'primatives.json'))
  loadCSS(pim)
  console.log(
    `outputted to ${path.relative(__dirname, PRIMATIVES_CSS_OUTPUT_PATH)}`
  )
}

main()
