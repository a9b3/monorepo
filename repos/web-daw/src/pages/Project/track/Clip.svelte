<script lang="ts">
  import type { ClipTrack } from 'src/daw/ClipTrack'
  import ClearEditableText from 'src/components/ClearEditableText.svelte'
  import Icon from 'src/components/Icon.svelte'
  import { objectStyle } from 'src/utils/objectToStyleStr'
  import type { Clip } from 'src/daw/Clip'
  import editorStore, { setInFocusElement } from 'src/store/editor'
  import ContextMenu from 'src/components/ContextMenu.svelte'
  import Window from 'src/components/window/Window.svelte'
  import StepSequencer from 'src/pages/Project/editors/stepSequencer/StepSequencer.svelte'
  import MPC from 'src/components/MPC/MPC.svelte'

  let contextMenuRef: ContextMenu
  let showWindow = false

  export let instrument
  export let clipTrack: ClipTrack
  export let idx: number

  let clipId: string
  let clip: Clip

  $: {
    clipId = $clipTrack?.clipsOrder[idx]
    clip = $clipTrack?.clips[clipId]
  }

  // Need to use this since non created clips won't have an unique id.
  function getClipInFocusElementId() {
    return `${clipTrack.id}.${idx}`
  }
</script>

<div
  class="clip"
  class:occupied={clip?.id}
  class:active={$clipTrack?.activeClip && $clipTrack?.activeClip === clip?.id}
  class:selected={$editorStore.inFocusElement === getClipInFocusElementId()}
  on:mousedown={() => {
    setInFocusElement(getClipInFocusElementId())
  }}
  on:dblclick={() => {
    if (!clipId) {
      clipTrack.addClip(String(idx))
    }
    showWindow = true
  }}
  on:contextmenu|preventDefault|stopPropagation={e => {
    if (clipId) {
      contextMenuRef.handleRightClick(e)
    }
    setInFocusElement(getClipInFocusElementId())
  }}
>
  <Window bind:showWindow title={'Step Sequencer'}>
    <div
      style={objectStyle({
        display: 'flex',
        flexDirection: 'row',
      })}
    >
      <MPC {instrument} />
      <StepSequencer
        {clip}
        clipIsActive={$clipTrack?.activeClip &&
          $clipTrack?.activeClip === clip?.id}
      />
    </div>
  </Window>
  {#if clipId}
    <ContextMenu
      bind:this={contextMenuRef}
      menu={clipId
        ? [
            {
              label: 'Delete Clip',
              onClick: () => {
                clipTrack.removeClip(String(idx))
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
      clipTrack.setActiveClip(clip?.id)
    }}
  >
    <Icon
      type={!clip?.id ? 'stop' : 'play'}
      style={objectStyle({
        transform: 'scale(1.2)',
      })}
    />
  </div>
  {#if clip?.id}
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
        handleInput={e => $clip?.setName(e.target.value)}
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
