export function randomLinearGradient() {
  const color1 = '#' + ((Math.random() * 0xffffff) << 0).toString(16)
  const color2 = '#' + ((Math.random() * 0xffffff) << 0).toString(16)
  const cssStr = 'linear-gradient(to right,' + color1 + ',' + color2 + ')'
  return cssStr
}
