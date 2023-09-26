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
    windowManager.upsert(mainWindowEl, topbarEl)
  })
  onDestroy(() => {
    windowManager.remove(mainWindowEl)
  })
</script>

<div
  bind:this={mainWindowEl}
  class={'main'}
  on:mousedown={() => {
    windowManager.focus(mainWindowEl)
  }}
>
  <div class="top" bind:this={topbarEl}>
    <TopBar {title} {onClose}>
      <slot name="left" slot="left" />
    </TopBar>
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
    /* overflow: hidden; */
    border-radius: var(--misc__borderRadius);
    outline: 1px solid var(--colors__bg2);
    box-shadow: var(--shadows__1);
    animation: fadein 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }
  @keyframes fadein {
    0% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
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
