import { flattenObj } from './flattenObj'
import { hexToHSL } from './hexToHSL'

const TOKENS = {
  green: '#15D253',
  yellow: '#FFC908',
  teal: '#3A8080',
  blue: '#475D9A',
  purple: '#584A94',
  red: '#FE1100',
}

const COLORS = Object.freeze({
  bottom: '#151515',
  bg: '#222222',
  bgHover: '#262626',
  bg2: '#373737',
  bg3: '#454545',
  bg3Hover: '#373737',
  fg: '#FEFEFE',
  fg2: '#C0C0C0',
  fg3: '#565656',
  accent: '#3F78F7',
  selected: '#2E4B75',
  neonPink: '#EA3FA2',
})

const HSL = {
  ...Object.fromEntries(
    Object.entries({ ...COLORS, ...TOKENS }).map(([key, value]) => {
      return [`${key}-h`, hexToHSL(value)[0]]
    })
  ),
  ...Object.fromEntries(
    Object.entries({ ...COLORS, ...TOKENS }).map(([key, value]) => {
      return [`${key}-s`, hexToHSL(value)[1]]
    })
  ),
  ...Object.fromEntries(
    Object.entries({ ...COLORS, ...TOKENS }).map(([key, value]) => {
      return [`${key}-l`, hexToHSL(value)[2]]
    })
  ),
  ...Object.fromEntries(
    Object.entries({ ...COLORS, ...TOKENS }).map(([key, value]) => {
      return [`${key}-raw`, hexToHSL(value).join(', ')]
    })
  ),
  ...Object.fromEntries(
    Object.entries({ ...COLORS, ...TOKENS }).map(([key, value]) => {
      return [`${key}-hsl`, `hsl(${hexToHSL(value).join(', ')})`]
    })
  ),
}

const FONT = {
  family: `'Roboto', sans-serif`,
  size: '12px',
  weight: '400',
  color: COLORS.fg,
}

const SPACING = {
  paddingXs: '2px',
  paddingSm: '2px',
  paddingM: '5px',
  padding: '12px',
  paddingL: '20px',
  paddingXL: '40px',
  button: {
    padding: '10px',
  },
  margin: '12px',
  marginSm: '2px',
  marginM: '5px',
  marginL: '20px',
}

const TRACK = {
  width: '120px',
}

const MISC = {
  borderRadius: '4px',
  // windowBorder: `rgb(85, 91, 255) 0px 0px 0px 3px, rgb(31, 193, 27) 0px 0px 0px 6px, rgb(255, 217, 19) 0px 0px 0px 9px, rgb(255, 156, 85) 0px 0px 0px 12px, rgb(255, 85, 85) 0px 0px 0px 15px`,
  // windowBorder: `rgba(240, 46, 170, 0.4) 0px 5px 0 5px, rgba(240, 46, 170, 0.3) 0px 10px 0 10px, rgba(240, 46, 170, 0.2) 0px 15px 0 15px, rgba(240, 46, 170, 0.1) 0px 20px 0 20px, rgba(240, 46, 170, 0.05) 0px 25px 25px`,
  windowBorder: `2px solid ${COLORS.neonPink}`,
}

const SHADOWS = {
  1: `rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px`,
  2: `rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px`,
  3: `1px 2px 2px hsl(var(--shadow-color) / 0.2),
    2px 4px 4px hsl(var(--shadow-color) / 0.2),
    4px 8px 8px hsl(var(--shadow-color) / 0.2),
    8px 16px 16px hsl(var(--shadow-color) / 0.2),
    16px 32px 32px hsl(var(--shadow-color) / 0.2)`,
}

export const styles = {
  tokens: TOKENS,
  hsl: HSL,
  colors: COLORS,
  font: FONT,
  spacing: SPACING,
  track: TRACK,
  misc: MISC,
  shadows: SHADOWS,
}

/**
 * Convert the above to a css string that can be loaded into html.
 */
export function convertToCss(styleObj: any) {
  const flattened = flattenObj(styleObj)
  const rendered = Object.entries(flattened)
    .map(([key, val]) => {
      const renderedVal =
        typeof val === 'string' ? val : typeof val === 'function' && val()
      return `--${key}: ${renderedVal};`
    })
    .join('\n')

  return `<style>
    :root {
      ${rendered}
    }
  </style>
  `
}
