<script lang="ts">
  import { onMount } from 'svelte'
  import type { MidiClip } from 'daw/core'

  export let midiClip: MidiClip

  let main: HTMLElement

  $: startIndexMap = midiClip.getStartIndexForUI({ onlyLoopEvents: true })

  onMount(() => {
    const noteRange = midiClip.noteRange
    Object.entries(startIndexMap).forEach(([tick, midiEvents]) => {
      midiEvents.forEach(mevt => {
        const midiDiv = window.document.createElement('div')

        const widthPercent =
          (mevt.endTick - mevt.startTick) / midiClip.totalLoopTicks ||
          1 / midiClip.beatsPerLoop
        const leftPercent =
          (mevt.startTick - midiClip.offsetStartTick) / midiClip.totalLoopTicks
        const topPercent =
          1 -
          Math.max(mevt.note - noteRange.min, 1) /
            Math.max(noteRange.max - noteRange.min, 1)
        const heightPercent = 1 / Object.keys(midiClip.notesIndex).length

        midiDiv.style.background = `hsla(
      var(--hsl__accent-h),
      var(--hsl__accent-s),
      calc(var(--hsl__accent-l)),
      .5
    )`
        midiDiv.style.position = 'absolute'
        midiDiv.style.transform = `translate(${
          leftPercent * main.offsetWidth
        }px, ${topPercent * main.offsetHeight}px)`
        midiDiv.style.width = `${widthPercent * main.offsetWidth}px`
        midiDiv.style.height = `${Math.max(
          Math.min(heightPercent * main.offsetHeight, 6),
          4
        )}px`
        midiDiv.style.borderRadius = '2px'

        main.appendChild(midiDiv)
      })
    })
  })
</script>

<div class={'main'} bind:this={main} />

<style>
  .main {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
  }
</style>
