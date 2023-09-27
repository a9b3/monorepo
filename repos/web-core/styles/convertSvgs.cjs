/**
 * Run this script to generate ./src/svgData.json which will contain the path d
 * value for each svg this can be used to build a customized icon component.
 *
 *    node ./convertSvgs.cjs
 */
const fs = require('fs')
const path = require('path')
const cheerio = require('cheerio')

const OUTPUT_FILE_PATH = path.join(__dirname, './src/svgData.json')

function generateJSONFile() {
  const strokeSvgDir = path.join(__dirname, './src/svgs/stroke')
  const svgs = fs.readdirSync(strokeSvgDir)

  const output = {
    stroke: {},
    fill: {},
  }

  for (let i = 0; i < svgs.length; i += 1) {
    const svgName = path.parse(svgs[i]).name
    const svgFilePath = path.join(strokeSvgDir, svgs[i])

    const content = fs.readFileSync(svgFilePath)
    const html = cheerio.load(content.toString())
    const dValue = html('path').attr('d')

    output.stroke[svgName] = dValue
  }

  fs.writeFileSync(OUTPUT_FILE_PATH, JSON.stringify(output))
}

generateJSONFile()
console.log(`outputted to ${OUTPUT_FILE_PATH}`)
