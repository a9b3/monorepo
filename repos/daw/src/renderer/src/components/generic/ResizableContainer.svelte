<script lang="ts">
  import { useDelta } from '@renderer/src/app/lib/ui/mouseDelta'
  import { onMount } from 'svelte'

  export let id = 'resizable-container'
  export let allowedEdges: ('top' | 'left' | 'bottom' | 'right')[] = []
  export let initialHeight: number = localStorage.getItem(id + '-height')
    ? parseInt(localStorage.getItem(id + '-height'))
    : 200

  let containerEl: HTMLElement

  let deltaset = useDelta(({ y }) => {
    containerEl.style.height = containerEl.offsetHeight - y + 'px'
    localStorage.setItem(id + '-height', containerEl.offsetHeight - y)
  })

  onMount(() => {
    containerEl.style.height = initialHeight + 'px'
  })
</script>

<div class="main" use:deltaset bind:this={containerEl}>
  {#if allowedEdges.includes('top')}
    <div class="border top"></div>
  {/if}
  {#if allowedEdges.includes('right')}
    <div class="border right"></div>
  {/if}
  {#if allowedEdges.includes('bottom')}
    <div class="border bottom"></div>
  {/if}
  {#if allowedEdges.includes('left')}
    <div class="border left"></div>
  {/if}
  <slot></slot>
</div>

<style>
  .main {
    position: relative;
    height: 100%;
    width: 100%;
  }

  .border {
    position: absolute;
  }
  .top {
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    cursor: ns-resize;
  }
  .right {
    top: 0;
    right: 0;
    bottom: 0;
    width: 4px;
    cursor: ew-resize;
  }
  .bottom {
    left: 0;
    right: 0;
    bottom: 0;
    height: 4px;
    cursor: ns-resize;
  }
  .left {
    top: 0;
    left: 0;
    bottom: 0;
    width: 4px;
    cursor: ew-resize;
  }
</style>
