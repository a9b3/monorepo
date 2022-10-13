<script lang="ts">
  import { beforeUpdate } from 'svelte'
  import type { Track } from 'daw/core/ui'
  import type { MidiClip } from 'daw/core/midi'
  import { ContextMenu, Window, Icon, ClearEditableText } from 'src/components'
  import { objectStyle } from 'src/utils'
  import { editorStore, setInFocusElement } from 'src/store'
  import StepSequencer from 'src/pages/Project/Editors/StepSequencer/StepSequencer.svelte'
  import PianoRoll from 'src/components/PianoRoll/PianoRoll.svelte'
  import MPC from 'src/components/MPC/MPC.svelte'

  export let ticksPerBeat: number
  export let clip: MidiClip
  export let instrument
  export let instrumentType
  export let idx: number
  export let activeClipId: string
  export let addClip: InstanceType<typeof Track>['addMidiClip']
  export let setActiveClip: InstanceType<typeof Track>['setActiveMidiClip']
  export let removeClip: InstanceType<typeof Track>['removeMidiClip']

  let contextMenuRef: ContextMenu
  let showWindow = false
  $: clipId = clip?.id || crypto.randomUUID()
</script>

<div
  class="clip"
  class:occupied={clip && clip?.id}
  class:active={activeClipId !== undefined && activeClipId === clip?.id}
  class:selected={$editorStore.inFocusElement === clipId}
  on:mousedown={() => {
    setInFocusElement(clipId)
  }}
  on:dblclick={() => {
    if (!clip) {
      setActiveClip(addClip(idx).id)
    }
    showWindow = true
  }}
  on:contextmenu|preventDefault|stopPropagation={e => {
    if (clip) {
      contextMenuRef.handleRightClick(e)
    }
    setInFocusElement(clipId)
  }}
>
  <Window bind:showWindow title={'Step Sequencer'}>
    <div
      style={objectStyle({
        display: 'flex',
        flexDirection: 'row',
      })}
    >
      {#if instrumentType === 'Sampler'}
        <MPC {instrument} />
        <StepSequencer
          {ticksPerBeat}
          {clip}
          clipIsActive={activeClipId === clip?.id}
        />
      {/if}
      {#if instrumentType !== 'Sampler'}
        <PianoRoll onMidi={instrument.onMidi} />
      {/if}
    </div>
  </Window>
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
    <div
      style={objectStyle({
        width: '100%',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        marginLeft: '10px',
      })}
    >
      <ClearEditableText
        value={clip?.name}
        handleInput={e => clip?.setName(e.target.value)}
      />
    </div>
  {/if}
</div>

<style>
  .clip {
    border-bottom: 1px dashed var(--colors__bg);
    height: 22px;
    display: flex;
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
</style>
