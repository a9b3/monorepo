<script lang="ts">
  import type { ClipTrack } from 'src/daw/ClipTrack'
  import type { Clip } from 'src/daw/Clip'
  export let clipTrack: ClipTrack
  export let clip: Clip | undefined
  export let idx: number
  import editorStore, { setInFocusElement } from 'src/store/editor'

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
    clipTrack.addClip(String(idx))
  }}
>
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
