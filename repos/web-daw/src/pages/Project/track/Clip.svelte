<script lang="ts">
  import type { Track, MidiClip, Instrument, InstrumentType } from 'daw/core'
  import {
    ClearEditableText,
    ContextMenu,
    Icon,
    PianoRoll,
    Sampler,
    Window,
  } from 'src/components'
  import { objectStyle } from 'src/utils'
  import { editorStore, setInFocusElement } from 'src/store'
  import StepSequencer from '../Editors/StepSequencer/StepSequencer.svelte'
  import { selection } from '../stores/selection'
  import { pianoRollSelection } from '../stores/pianoRollSelection'
  import CursorLine from 'src/components/PianoRoll/CursorLine/CursorLine.svelte'

  export let trackLabel: string
  export let ticksPerBeat: number
  export let clip: MidiClip
  export let instrument: Instrument
  export let instrumentType: InstrumentType
  export let idx: number
  export let activeClipId: string
  export let addClip: InstanceType<typeof Track>['addMidiClip']
  export let setActiveClip: InstanceType<typeof Track>['setActiveMidiClip']
  export let removeClip: InstanceType<typeof Track>['removeMidiClip']

  let el: HTMLElement
  let contextMenuRef: ContextMenu
  let showWindow = false
  let prevClipId: string | undefined
  $: clipId = clip?.id || crypto.randomUUID()

  function handleNameChange(evt: Event) {
    clip?.setName((evt.target as HTMLInputElement).value)
  }

  function getWindowTitle(
    trackLabel: string | undefined,
    clipName: string | undefined,
    customText?: string
  ) {
    return [trackLabel, clipName, customText].filter(Boolean).join(' :: ')
  }

  $: {
    if (prevClipId !== clip?.id) {
      selection.unregisterSelectable(clip?.id)
      selection.registerSelectable(clip?.id, el)
    }
  }
</script>

<div
  bind:this={el}
  class="clip"
  class:occupied={clip && clip?.id}
  class:active={activeClipId !== undefined && activeClipId === clip?.id}
  class:selected={$editorStore.inFocusElement === clipId ||
    Boolean(clip?.id !== undefined && $selection.selected[clip?.id])}
  on:mousedown={() => {
    setInFocusElement(clipId)
  }}
  on:dblclick={() => {
    if (!instrument) {
      return
    }
    if (!clip) {
      setActiveClip(addClip(idx).id)
    }
    showWindow = true
  }}
  on:contextmenu|preventDefault|stopPropagation={e => {
    if (clip) {
      contextMenuRef.openMenu(e)
    }
    setInFocusElement(clipId)
  }}
>
  {#if activeClipId !== undefined && activeClipId === clip?.id}
    <CursorLine numberOfBeats={clip?.beatsPerLoop} />
  {/if}
  {#if showWindow}
    <Window
      title={getWindowTitle(trackLabel, clip?.name)}
      onClose={() => (showWindow = false)}
    >
      <div slot="left">Edit</div>
      <div
        style={objectStyle({
          display: 'flex',
          flexDirection: 'row',
        })}
      >
        {#if instrumentType === 'Sampler'}
          <Sampler {instrument} />
          <StepSequencer
            beatsPerLoop={clip.beatsPerLoop}
            {ticksPerBeat}
            {clip}
            clipIsActive={activeClipId === clip?.id}
          />
        {/if}
        {#if instrumentType !== 'Sampler' && clip}
          <PianoRoll
            numberOfBars={clip.beatsPerLoop / 4}
            onMidi={instrument.onMidi}
            {ticksPerBeat}
            midiClip={clip}
            selectionManager={pianoRollSelection}
          />
        {/if}
      </div>
    </Window>
  {/if}
  {#if clip}
    <ContextMenu
      bind:this={contextMenuRef}
      menu={clip
        ? [
            {
              label: 'Delete Clip',
              onClick: () => {
                removeClip(idx)
                showWindow = false
              },
              type: 'item',
            },
          ]
        : []}
    />
  {/if}
  <div
    class="icon"
    on:click={() => {
      setActiveClip(clip?.id)
    }}
  >
    <Icon
      type={!clip ? 'stop' : 'play'}
      style={objectStyle({
        transform: 'scale(1.2)',
      })}
    />
  </div>
  {#if clip}
    <div class="edittext">
      <ClearEditableText value={clip?.name} handleInput={handleNameChange} />
    </div>
  {/if}
</div>

<style>
  .clip {
    border-bottom: 1px dashed var(--colors__bg);
    height: 22px;
    display: flex;
    position: relative;
  }

  .clip.selected {
    outline: 2px solid var(--colors__accent);
    outline-offset: -2px;
  }

  .clip.occupied {
    background: var(--colors__bg);
    border-bottom: 1px solid var(--colors__bg2);
  }

  .clip.active {
    background: var(--colors__neonPink);
  }

  .icon {
    height: 100%;
    display: flex;
    align-items: center;
    padding: 2px;
  }
  .icon:hover {
    filter: brightness(0.8);
  }

  .edittext {
    color: hsla(var(--hsl__fg-h), var(--hsl__fg-s), var(--hsl__fg-l), 0.5);
    width: 100%;
    overflow: hidden;
    display: flex;
    align-items: center;
    margin-left: 10px;
    font-size: 10px;
  }
</style>
