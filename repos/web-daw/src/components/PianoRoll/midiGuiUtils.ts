import type { MidiEvent } from 'daw/core'
import { Big } from 'big.js'

interface Rect {
  top: number
  bottom: number
  left: number
  right: number
}

// -------------------------------------------------------------------------
// General
// -------------------------------------------------------------------------

function noteHeight(totalNotes: number, height: number) {
  return height / totalNotes
}

/**
 * Use to snap to grid.
 *
 */
export function snapToGrid(value: number, division: number, floor = true) {
  return floor
    ? Math.floor(value / division) * division
    : Math.round(value / division) * division
}

export function hslString(color: string) {
  return `hsla(var(--hsl__${color}-h), var(--hsl__${color}-s), calc(var(--hsl__${color}-l)), 1)`
}

// -------------------------------------------------------------------------
// Container helpers
// -------------------------------------------------------------------------

/**
 * Calculate against the scroll parent and container parent. Attemps to get
 * the x y position relative to the container element's origin x y.
 */
export function containerMouseXY(evt: MouseEvent, container: HTMLElement) {
  const containerBound = container.getBoundingClientRect()
  return {
    x: container.scrollLeft + evt.clientX - containerBound.left,
    y: container.scrollTop + evt.clientY - containerBound.top,
  }
}

// -------------------------------------------------------------------------
// From GUI
// -------------------------------------------------------------------------

/**
 * Get the position of a value given a range.
 */
function calcPos(
  value: number,
  range: number,
  division: number,
  opt: {
    floor?: boolean
    ceil?: boolean
  } = {}
) {
  if (opt.floor) {
    return Math.floor((value / range) * division)
  }
  if (opt.ceil) {
    return Math.ceil((value / range) * division)
  }
  return Math.round((value / range) * division)
}

/**
 * Return the midi note.
 */
function rectToNote(rect: Rect, height: number, totalNotes: number): number {
  return (
    totalNotes -
    Math.max(
      calcPos(rect.top, height, totalNotes),
      calcPos(rect.bottom, height, totalNotes)
    )
  )
}

/**
 * Return the start and end tick
 */
function rectToStartEndTicks(
  rect: Rect,
  width: number,
  totalTicks: number
): [start: number, end: number] {
  return [
    calcPos(rect.left, width, totalTicks),
    calcPos(rect.right, width, totalTicks),
  ]
}

/**
 * Given coordinates get the midi event args
 */
export function rectToMidiEvent(
  rect: Rect,
  container: HTMLElement,
  totalNotes: number,
  totalTicks: number
): {
  note: number
  startTick: number
  endTick: number
} {
  const note = rectToNote(rect, container.offsetHeight, totalNotes)
  const [startTick, endTick] = rectToStartEndTicks(
    rect,
    container.offsetWidth,
    totalTicks
  )

  return {
    note,
    startTick,
    endTick,
  }
}

/**
 * Get the note given a single point in space
 */
export function singlePointToMidiEvent(
  x: number,
  y: number,
  container: HTMLElement,
  opt: {
    totalNotes: number
    totalTicks: number
    tickDivision?: number
  }
): {
  note: number
  startTick: number
} {
  let startTick = calcPos(x, container.offsetWidth, opt.totalTicks)
  if (opt.tickDivision) {
    startTick = snapToGrid(
      calcPos(x, container.offsetWidth, opt.totalTicks),
      opt.tickDivision
    )
  }
  // There are totalNotes within the container.offsetHeight
  // The note we want should be 0 indexed
  // We always want to round up since clicking on 0 - 1 range want to produce
  // 1. So when subtracted against totalNotes we get 0 index.
  const note =
    opt.totalNotes -
    calcPos(y, container.offsetHeight, opt.totalNotes, { ceil: true })

  return {
    note,
    startTick,
  }
}

// -------------------------------------------------------------------------
// To GUI
// -------------------------------------------------------------------------

/**
 * Get width and height in px values
 */
export function getNoteWidthHeight(
  midiEvent: MidiEvent,
  container: HTMLElement,
  totalNotes: number,
  totalTicks: number
) {
  const { offsetWidth, offsetHeight } = container

  // Get percent values
  const widthPercent = Big(
    Big(midiEvent.endTick).minus(midiEvent.startTick)
  ).div(totalTicks)
  const heightPercent = Big(1 / totalNotes)

  // Use percentage values to get px values
  const pxNoteHeight = heightPercent.times(offsetHeight).minus(0)
  const pxNoteWidth = widthPercent.times(offsetWidth)

  return {
    height: pxNoteHeight,
    width: pxNoteWidth,
  }
}

/**
 * Get left and top relative to the container origin x y.
 */
export function getNoteLeftTop(
  midiEvent: MidiEvent,
  container: HTMLElement,
  pxNoteHeight: Big,
  totalTicks: number
) {
  const { offsetWidth, offsetHeight } = container

  // Get percent values
  const leftPercent = Big(Big(midiEvent.startTick)).div(totalTicks)

  // const x = offsetHeight - pxHeight * note - pxHeight

  // Use percentage value to get px values
  const translateTop = Big(offsetHeight)
    .minus(pxNoteHeight.times(midiEvent.note))
    .minus(pxNoteHeight)
  const translateLeft = leftPercent.times(offsetWidth)

  return {
    top: translateTop,
    left: translateLeft,
  }
}

/**
 * The note rect is calculated relative to the container. The container's
 * offsetWidth represents the total ticks and the containers offsetHeight
 * represents the total notes displayed.
 */
export function getNoteRect(
  midiEvent: MidiEvent,
  container: HTMLElement,
  totalNotes: number,
  totalTicks: number
) {
  const { height, width } = getNoteWidthHeight(
    midiEvent,
    container,
    totalNotes,
    totalTicks
  )
  const { top, left } = getNoteLeftTop(midiEvent, container, height, totalTicks)

  return {
    top: top.toNumber(),
    left: left.toNumber(),
    height: height.toNumber(),
    width: width.toNumber(),
  }
}
