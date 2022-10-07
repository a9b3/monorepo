type StyleT = {
  color: string
  chillinCool: string
  fontFamily: string
  paddingSm: string
  border: string
}
export const style: StyleT = {
  color: 'black',
  chillinCool: 'yellow',
  fontFamily: `'Lexand', sans-serif`,
  paddingSm: '10px',
  border: '2px solid black',
}

export function styleToSvelte(styleObj: StyleT) {
  return Object.entries(styleObj)
    .map(([key, val]) => `--${key}: ${val};`)
    .join(' ')
}
