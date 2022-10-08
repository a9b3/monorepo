<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  export let selected = ['one']
  export let options = [
    {
      key: 'one',
      label: 'One',
    },
    {
      key: 'two',
      label: 'Two',
    },
  ]

  let isOpened = false
  let parentEl: HTMLElement

  function mouseDownHandler(evt) {
    if (!parentEl.contains(evt.target)) {
      isOpened = false
    }
  }
  onMount(() => {
    document.addEventListener('mousedown', mouseDownHandler)
  })

  onDestroy(() => {
    document.removeEventListener('mousedown', mouseDownHandler)
  })
</script>

<div
  bind:this={parentEl}
  class={($$restProps.class || '') + ' main'}
  style={$$restProps.style}
  on:click={() => (isOpened = !isOpened)}
>
  <slot />
  {#if isOpened}
    <div class="options">Hello</div>
  {/if}
</div>

<style>
  .main {
    position: relative;
  }

  .options {
    position: absolute;
  }
</style>
