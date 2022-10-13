import { writable } from 'svelte/store'

export const hoverKey = writable(undefined)
export const setHoverKey = v => {
  hoverKey.set(v)
}

export const mouseDown = writable(false)
export const setMouseDown = v => {
  mouseDown.set(v)
}

export const scaleY = writable(1)
export const setScaleY = v => {
  scaleY.set(v)
}
