<!--
  @component

  A generic window component. Manage show/hide at the callsite.
-->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import TopBar from './TopBar.svelte'
  import { windowManager } from 'src/ui'

  export let title = ''
  export let onClose: () => void

  let topbarEl: HTMLElement
  let mainWindowEl: HTMLElement

  onMount(() => {
    windowManager.focus(mainWindowEl, topbarEl)
  })
  onDestroy(() => {
    windowManager.remove(mainWindowEl)
  })
</script>

<div bind:this={mainWindowEl} class={'main'}>
  <div class="top" bind:this={topbarEl}>
    <TopBar {title} {onClose} />
  </div>
  <div class="content">
    <slot />
  </div>
</div>

<style>
  .main {
    background: white;
    position: absolute;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: var(--misc__borderRadius);
    outline: 1px solid var(--colors__bg2);
    box-shadow: var(--shadows__2);
  }
  .top {
    height: 30px;
  }
  .content {
    width: 100%;
    height: 100%;
    flex-grow: 1;
  }
</style>
