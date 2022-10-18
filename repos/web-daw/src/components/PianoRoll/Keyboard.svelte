<script lang="ts">
  import Key from './Key.svelte'

  export let numberOfKeys: number
  export let keyHeight: number
  export let onMidi

  let keys = Array(numberOfKeys)
    .fill(1)
    .map((k, i) => i)
    .reverse()
</script>

<div class={($$restProps.class || '') + ' main'} style={$$restProps.style}>
  <div class="spacer" />
  {#each keys as key}
    <Key {key} {onMidi} {keyHeight} />
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
</style>
