<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import type { MidiClip, MidiEvent } from 'daw/core'
  import Big from 'big.js'

  export let midiClip: MidiClip
  export let displayNoteRange: { max: number; min: number }
  export let selectionManager: SelectionManager

  let container: HTMLElement

  function hslString(color: string) {
    return `hsla(var(--hsl__${color}-h), var(--hsl__${color}-s), calc(var(--hsl__${color}-l)), 1)`
  }

  function getNoteWidthHeight(
    midiEvent: MidiEvent,
    container: HTMLElement,
    totalNotes: number,
    totalTicks: number
  ) {
    const offsetWidth = container.offsetWidth
    const offsetHeight = container.offsetHeight
    const widthPercent = Big(
      Big(midiEvent.endTick).minus(midiEvent.startTick)
    ).div(totalTicks)
    const heightPercent = Big(1).div(totalNotes)

    const pxNoteHeight = heightPercent.times(offsetHeight).minus(0)
    const pxNoteWidth = widthPercent.times(offsetWidth)

    return {
      height: pxNoteHeight,
      width: pxNoteWidth,
    }
  }

  function getNoteLeftTop(
    midiEvent: MidiEvent,
    container: HTMLElement,
    pxNoteHeight: Big,
    totalTicks: number
  ) {
    const offsetWidth = container.offsetWidth
    const offsetHeight = container.offsetHeight

    const leftPercent = Big(Big(midiEvent.startTick)).div(totalTicks)

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
  function getNoteRect(
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
    const { top, left } = getNoteLeftTop(
      midiEvent,
      container,
      height,
      totalTicks
    )
    return {
      top,
      left,
      height,
      width,
    }
  }

  function smallPreview(midiDiv: HTMLElement, noteLength: number) {
    const offsetHeight = container.offsetHeight
    const heightPercent = Big(1).div(noteLength)

    midiDiv.style.height = `${Math.max(
      Math.min(heightPercent.times(offsetHeight).toNumber(), 6),
      4
    )}px`
  }

  /**
   * The container render method. Paints the midi events into the container.
   */
  function render() {
    console.log(`render called`)
    const noteRange = displayNoteRange || midiClip.noteRange
    const noteLength = noteRange.max - noteRange.min + 1
    const startIndexMap = midiClip.getStartIndexForUI({
      onlyLoopEvents: true,
    })

    // Clear the DOM before recalculating and repainting everything
    // TODO if not attaching handlers to created child maybe I can just clear
    // using innerHTML = ''
    while (container && container.firstChild) {
      container.removeChild(container.firstChild)
    }

    // Create HTMLElements for each midiEvent and append to container.
    Object.entries(startIndexMap).forEach(([_, midiEvents]) => {
      midiEvents.forEach(midiEvent => {
        // Calculate the px rect for the note relative to the container
        const noteRect = getNoteRect(
          midiEvent,
          container,
          noteLength,
          midiClip.totalLoopTicks
        )

        // Create the node to be inserted
        const midiDiv = window.document.createElement('div')

        // Set calculated styles
        // TODO HACK for selection manager, need to move this to a svelte
        // component so this doesn't create new dom nodes every render.
        midiDiv.setAttribute('data-midi-clip-id', midiEvent.id)
        midiDiv.style.background = hslString('neonPink')
        midiDiv.style.position = 'absolute'
        midiDiv.style.borderRadius = '4px'
        midiDiv.style.zIndex = '1'
        midiDiv.style.transform = `translate(${noteRect.left.toString()}px, ${noteRect.top.toString()}px)`
        midiDiv.style.height = `${noteRect.height.toString()}px`
        midiDiv.style.width = `${noteRect.width.toString()}px`
        if (!selectionManager) {
          smallPreview(midiDiv, noteLength)
        }

        if (selectionManager && selectionManager.selected[midiEvent.id]) {
          midiDiv.style.background = hslString('accent')
        }

        container.appendChild(midiDiv)

        if (selectionManager) {
          selectionManager.registerSelectable(midiEvent.id, container.lastChild)
        }
      })
    })
  }

  /**
   * TODO refactor midiclippreview, should put everything in a class
   # need to also move the midieventnote div to a svelte component so it
   # maintains a reference to the dom element inside selection manager.
   */
  export function onMove({ originX, originY, deltaX, deltaY, id, el }) {
    const midiEvent = midiClip.eventsIndex[id]
    const noteRange = displayNoteRange || midiClip.noteRange
    const noteLength = noteRange.max - noteRange.min + 1

    const rect = getNoteRect(
      midiEvent,
      container,
      noteLength,
      midiClip.totalLoopTicks
    )

    function snap(delta, desired, tolerance) {
      return Math.round(delta / desired) * desired
    }

    const newY = originY + snap(deltaY, rect.height.toNumber(), 0)
    const newX = originX + snap(deltaX, rect.width.toNumber(), 0.4)

    return {
      x: newX,
      y: newY,
    }
  }

  onMount(() => {
    render()
    midiClip.on('update', render)
    if (selectionManager) {
      selectionManager.on('update', render)
    }
  })

  onDestroy(() => {
    midiClip.removeListener('update', render)
    if (selectionManager) {
      selectionManager.removeListener('update', render)
    }
  })
</script>

<div class={'container'} bind:this={container} />

<style>
  .container {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    /* pointer-events: none; */
  }
</style>
