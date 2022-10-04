<script lang="ts">
  export let clipTrack: any
  export let clip: any
  export let idx: number
  import editorStore, { setInFocusElement } from 'src/store/editor'
</script>

<div
  class="clip"
  class:active={clip.id}
  class:selected={$editorStore.inFocusElement === `${clipTrack.id}.${idx}`}
  on:click={evt => {
    setInFocusElement(`${clipTrack.id}.${idx}`)
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
    border-bottom: 1px solid var(--colors__bg);
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
