<script lang="ts">
  import type { ClipTrack } from 'src/daw/ClipTrack'
  import type { Clip } from 'src/daw/Clip'
  import editorStore, { setInFocusElement } from 'src/store/editor'
  import ContextMenu from 'src/components/ContextMenu.svelte'
  import Window from 'src/components/window/Window.svelte'
  import StepSequencer from 'src/pages/Project/editors/stepSequencer/StepSequencer.svelte'

  let contextMenuRef: ContextMenu
  let showWindow = false

  export let clipTrack: ClipTrack
  export let idx: number

  let clipId
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
  class:active={clip?.id}
  class:selected={$editorStore.inFocusElement === getClipInFocusElementId()}
  on:click={() => {
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
  <Window bind:showWindow title={'Step Sequencer'}
    ><StepSequencer {clip} /></Window
  >
  {#if clipId}
    <ContextMenu
      bind:this={contextMenuRef}
      menu={clipId
        ? [
            {
              label: 'Delete Clip',
              onClick: () => {
                clipTrack.removeClip(String(idx))
              },
              type: 'item',
            },
          ]
        : []}
    />
  {/if}
  <div class="square" />
</div>

<style>
  .clip {
    padding: var(--spacing__paddingM);
    border-bottom: 1px dashed var(--colors__bg);
  }

  .clip.selected {
    outline: 2px solid var(--colors__accent);
    outline-offset: -2px;
  }

  .clip.active {
    border-left: 4px solid var(--colors__accent);
    background: var(--colors__bg);
  }

  .square {
    width: 10px;
    height: 10px;
    background: var(--colors__bg);
  }
</style>
