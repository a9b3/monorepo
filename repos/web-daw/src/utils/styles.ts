import { flattenObj } from './flattenObj'

const COLORS = {
  bottom: '#151515',
  bg: '#222222',
  bgHover: '#262626',
  bg2: '#373737',
  bg3: '#454545',
  bg3Hover: '#373737',
  fg: '#D9D9D9',
  fg2: '#7B7B7B',
  fg3: '#565656',
  accent: '#3F78F7',
  selected: '#2E4B75',
  red: '#FD1201',
}

const FONT = {
  family: `'Roboto', sans-serif`,
  size: '12px',
  weight: '400',
  color: COLORS.fg,
}

const SPACING = {
  padding: '12px',
  paddingSm: '2px',
  paddingM: '5px',
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
}

export const styles = {
  colors: COLORS,
  font: FONT,
  spacing: SPACING,
  track: TRACK,
  misc: MISC,
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
