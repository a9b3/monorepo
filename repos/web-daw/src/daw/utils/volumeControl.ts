/**
 * https://www.dr-lex.be/info-stuff/volumecontrols.html
 *
 * {0, 0dB}
 * {1, 60dB}
 *
 * percent = gain^4
 */
export function percentToGain(percent: number) {
  return 10 ** (Math.log(percent) / 4)
}

export function gainToPercent(gain: number) {
  return gain ** 4
}
