import randomColor from 'randomcolor'

const blendModes = [
  'normal',
  'multiply',
  'screen',
  'overlay',
  'lighten',
  'hard-light',
  'soft-light',
  'hue',
  'color',
]

export function randomLinearGradient() {
  let gradient = '',
    mode = ''
  for (let i = 0; i < 4; i++) {
    const deg = Math.floor(Math.random() * 180)
    const firstColor = randomColor({
      luminosity: 'bright',
      hue: 'blue',
      format: 'rgba',
    })
    const lastColor = randomColor({
      luminosity: 'light',
      hue: 'red',
      format: 'rgba',
      alpha: 0.5,
    })
    const firstSpread = Math.floor(Math.random() * 90)
    const lastSpread = Math.floor(Math.random() * 180)
    mode += `${blendModes[Math.floor(Math.random() * blendModes.length)]},`
    gradient += `linear-gradient(${deg}deg, ${firstColor} ${firstSpread}%, ${lastColor} ${lastSpread}%),`
  }

  const style = `background-image: ${gradient.slice(
    0,
    -1
  )}; background-blend-mode: ${mode.slice(0, -1)};`
  return style
}
