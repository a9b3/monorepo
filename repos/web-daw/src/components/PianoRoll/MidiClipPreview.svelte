<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import type { MidiClip } from 'daw/core'
  import Big from 'big.js'

  export let midiClip: MidiClip
  export let displayNoteRange: { max: number; min: number }
  export let selectionManager: SelectionManager

  let main: HTMLElement

  function calcTopPercent(note, min, max) {
    if (note === min) {
      return 1
    }
    if (note === max) {
      return 0
    }

    return 1 - note / Math.abs(max - min)
  }

  function render() {
    const noteRange = displayNoteRange || midiClip.noteRange
    const numNotes = noteRange.max - noteRange.min + 1
    const startIndexMap = midiClip.getStartIndexForUI({
      onlyLoopEvents: true,
    })

    while (main && main.firstChild) {
      main.removeChild(main.firstChild)
    }

    console.log(startIndexMap)
    Object.entries(startIndexMap).forEach(([tick, midiEvents]) => {
      midiEvents.forEach(mevt => {
        const midiDiv = window.document.createElement('div')

        midiDiv.style.background = `hsla(
      var(--hsl__neonPink-h),
      var(--hsl__neonPink-s),
      calc(var(--hsl__neonPink-l)),
      1
    )`
        if (selectionManager && selectionManager.selected[mevt.id]) {
          midiDiv.style.background = `hsla(
      var(--hsl__accent-h),
      var(--hsl__accent-s),
      calc(var(--hsl__accent-l)),
      1
    )`
        }

        const offsetWidth = main.offsetWidth
        const offsetHeight = main.offsetHeight

        midiDiv.style.position = 'absolute'
        midiDiv.style.borderRadius = '4px'
        midiDiv.style.zIndex = '1'

        const widthPercent =
          Big(Big(mevt.endTick).minus(mevt.startTick)).div(
            midiClip.totalLoopTicks
          ) || Big(1).div(midiClip.beatsPerLoop)
        const leftPercent = Big(
          Big(mevt.startTick).minus(midiClip.offsetStartTick)
        ).div(midiClip.totalLoopTicks)
        const topPercent = Big(1).minus(
          Big(mevt.note).div(
            Big(noteRange.max || 1)
              .minus(noteRange.min)
              .abs()
          )
        )
        const heightPercent = Big(1).div(numNotes)

        const pxNoteHeight = heightPercent.times(offsetHeight).minus(0)
        const pxNoteWidth = widthPercent.times(offsetWidth)
        const translateTop = Big(offsetHeight)
          .minus(pxNoteHeight.times(mevt.note))
          .minus(pxNoteHeight)
        const translateLeft = leftPercent.times(offsetWidth)

        midiDiv.style.transform = `translate(${translateLeft.toString()}px, ${translateTop.toString()}px)`
        if (!selectionManager) {
          midiDiv.style.height = `${Math.max(
            Math.min(heightPercent.times(offsetHeight).toNumber(), 6),
            4
          )}px`
        }
        midiDiv.style.height = `${pxNoteHeight.toString()}px`
        midiDiv.style.width = `${pxNoteWidth.toString()}px`

        if (selectionManager) {
          console.log({
            transform: midiDiv.style.transform,
            totalheight: offsetHeight,
            h: midiDiv.style.height,
          })
          selectionManager.registerSelectable(mevt.id, midiDiv)
        }

        main.appendChild(midiDiv)
      })
    })
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
  })
</script>

<div class={'main'} bind:this={main} />

<style>
  .main {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    pointer-events: none;
  }
</style>
