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

/**
 * i => %
 *
 * 512 * x = 0
 * 22000
 *
 * 256 * x = .8
 * 11000
 *
 * 128 * x = .6
 * 5500
 *
 * 64 * x = .4
 * 2750
 *
 * 32 * x = .2
 * 1375
 *
 * 16 * x = .1
 * 687.5
 *
 * 8 * x = .05
 * 343.75
 *
 * 4
 * 171.5
 *
 * 2
 * 85.75 * x =
 *
 * 1
 * 42.875 * x = .1
 */

// let Big = require('big.js')
// function asd(freq, nyquistFrequency) {
//   const totalX = Math.log(nyquistFrequency) / Math.log(2)
//   const y = Math.log(freq) / Math.log(2)
//   return y / totalX
// }
//
// for (let i = 0; i < 512; i += 1) {
//   console.log(asd(i, 22000))
// }
