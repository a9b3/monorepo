<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy } from 'svelte'

  export let position = 'bottom'
  export let open = false

  let triggerElement: HTMLDivElement
  let popoverElement: HTMLDivElement

  const dispatch = createEventDispatcher()

  function togglePopover() {
    open = !open
    if (open) {
      dispatch('open')
    } else {
      dispatch('close')
    }
  }

  function handleClickOutside(event) {
    if (
      open &&
      popoverElement &&
      !popoverElement.contains(event.target) &&
      !triggerElement.contains(event.target)
    ) {
      open = false
      dispatch('close')
    }
  }

  function positionPopover() {
    if (!triggerElement || !popoverElement) return

    const triggerRect = triggerElement.getBoundingClientRect()
    const popoverRect = popoverElement.getBoundingClientRect()

    let top: number, left: number

    switch (position) {
      case 'top':
        top = -popoverRect.height - 10
        left = (triggerRect.width - popoverRect.width) / 2
        break
      case 'bottom':
        top = triggerRect.height + 10
        left = (triggerRect.width - popoverRect.width) / 2
        break
      case 'left':
        top = (triggerRect.height - popoverRect.height) / 2
        left = -popoverRect.width - 10
        break
      case 'right':
        top = (triggerRect.height - popoverRect.height) / 2
        left = triggerRect.width + 10
        break
    }

    popoverElement.style.top = `${top}px`
    popoverElement.style.left = `${left}px`
  }

  onMount(() => {
    document.addEventListener('click', handleClickOutside)
  })

  onDestroy(() => {
    document.removeEventListener('click', handleClickOutside)
  })

  $: if (open) {
    setTimeout(positionPopover, 0)
  }
</script>

<div class="popover-container">
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div
    bind:this={triggerElement}
    on:click={togglePopover}
    class="trigger"
    role="menu"
    tabindex="-1"
  >
    <slot name="trigger">
      <button type="button">Open Popover</button>
    </slot>
  </div>

  {#if open}
    <div bind:this={popoverElement} class="popover" class:open>
      <slot>
        <p>Default popover content</p>
      </slot>
    </div>
  {/if}
</div>

<style>
  .popover-container {
    position: relative;
    display: flex;
    justify-content: center;
  }

  .trigger {
    display: inline-block;
  }

  .popover {
    position: absolute;
    z-index: 1000;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
  }

  .popover.open {
    opacity: 1;
  }
</style>
