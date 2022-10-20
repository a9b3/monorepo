<script lang="ts">
  import Key from './Key.svelte'

  /**
   * Total number of notes to display for the keyboard.
   */
  export let numberOfKeys: number = 88
  /**
   * The height of each key, this will be divided in half for each
   */
  export let keyHeight: number
  export let onMidi
  export let horizontal = false
  export let startingNote = 21

  let keys = Array(numberOfKeys)
    .fill(1)
    .map((k, i) => startingNote + i)
    .reverse()
</script>

<div class={'main'} class:horizontal>
  <div class="spacer" />
  {#each keys as key}
    <Key {key} {onMidi} {keyHeight} {horizontal} />
  {/each}
</div>

<style>
  .main {
    position: relative;
  }
  .spacer {
    height: 20px;
    position: sticky;
    top: 0;
    left: 0;
    background: var(--colors__bg);
    border-bottom: 1px solid var(--colors__bg2);
    border-right: 1px solid var(--colors__bg);
    z-index: 2;
  }

  .horizontal {
    display: flex;
    flex-direction: row-reverse;
  }
</style>
