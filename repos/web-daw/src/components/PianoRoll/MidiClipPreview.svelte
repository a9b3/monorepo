<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import type { MidiClip } from 'daw/core'
  import type { SelectionManager } from 'src/ui'
  import { hslString, getNoteRect } from './midiGuiUtils'

  export let midiClip: MidiClip
  export let selectionManager: SelectionManager = undefined
  export let displayNoteRange: { min: number; max: number } = undefined

  let container: HTMLElement
  let noteRange = displayNoteRange || midiClip.noteRange
  let noteLength = noteRange.max - noteRange.min + 1

  function smallPreview(midiDiv: HTMLElement, noteLength: number) {
    const offsetHeight = container.offsetHeight
    const heightPercent = 1 / noteLength

    midiDiv.style.height = `${Math.max(
      2,
      Math.min(heightPercent * offsetHeight, 4)
    )}px`
    midiDiv.style.background = hslString('accent', 0.7)
    midiDiv.style.borderRadius = '0'
  }

  /**
   * The container render method. Paints the midi events into the container.
   */
  function render() {
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
        if (!midiEvent.endTick) {
          return
        }
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
        midiDiv.style.transform = `translate(${noteRect.left}px, ${noteRect.top}px)`
        midiDiv.style.height = `${noteRect.height}px`
        midiDiv.style.width = `${noteRect.width}px`
        if (!selectionManager) {
          smallPreview(midiDiv, noteLength)
        }

        if (selectionManager && selectionManager.selected[midiEvent.id]) {
          midiDiv.style.background = hslString('accent')
        }

        container.appendChild(midiDiv)

        if (selectionManager) {
          selectionManager.registerSelectable(
            midiEvent.id,
            container.lastChild as HTMLElement
          )
        }
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
