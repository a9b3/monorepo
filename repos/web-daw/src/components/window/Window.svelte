<!--
  @component

  A generic window component. Manage show/hide at the callsite.
-->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import TopBar from './TopBar.svelte'
  import { windowManager } from 'src/ui'
  import { KeyboardBoundary } from 'src/components'
  import Resizer from './Resizer.svelte'

  // -------------------------------------------------------------------------
  // Props
  // -------------------------------------------------------------------------

  export let title = ''
  export let onClose: Function

  // -------------------------------------------------------------------------
  // Internals
  // -------------------------------------------------------------------------

  let topbarEl: HTMLElement
  let mainWindowEl: HTMLElement
  let contentEl: HTMLElement
  let contentChild: HTMLElement

  let minHeight
  let minWidth
  let maxHeight
  let maxWidth

  let originWidth
  let originHeight

  function getChild(child: HTMLElement) {
    contentChild = child
  }

  function onStart() {
    originWidth = contentEl.offsetWidth
    originHeight = contentEl.offsetHeight
  }

  function onChange({ deltaX, deltaY }) {
    contentChild.style.width =
      Math.max(minWidth, Math.min(maxWidth, originWidth + deltaX)) + 'px'
    contentChild.style.height =
      Math.max(minHeight, Math.min(maxHeight, originHeight + deltaY)) + 'px'
  }

  onMount(() => {
    minHeight = parseFloat(getComputedStyle(contentChild).height)
    minWidth = parseFloat(getComputedStyle(contentChild).width)
    maxHeight = contentChild.scrollHeight
    maxWidth = contentChild.scrollWidth

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
  <KeyboardBoundary
    comboHandler={{
      Backspace: {
        key: 'del',
        handler: () => {
          console.log(`backspace in window`)
        },
      },
    }}
  />
  <div class="top" bind:this={topbarEl}>
    <TopBar {title} {onClose}>
      <slot name="left" slot="left" />
    </TopBar>
  </div>
  <div class="content" bind:this={contentEl}>
    <Resizer {onChange} {onStart} />
    <slot {getChild} />
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
    position: relative;
  }
</style>
