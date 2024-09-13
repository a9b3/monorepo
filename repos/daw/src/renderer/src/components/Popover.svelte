<script>
  import { onMount, afterUpdate } from 'svelte'

  export let position = 'bottom'

  let isOpen = false
  let popoverElement
  let triggerElement

  function togglePopover() {
    isOpen = !isOpen
  }

  function handleClickOutside(event) {
    if (
      popoverElement &&
      !popoverElement.contains(event.target) &&
      triggerElement &&
      !triggerElement.contains(event.target)
    ) {
      isOpen = false
    }
  }

  onMount(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  })

  function getPopoverStyle() {
    if (!triggerElement || !popoverElement) return ''

    const triggerRect = triggerElement.getBoundingClientRect()
    const popoverRect = popoverElement.getBoundingClientRect()
    let top, left

    const gap = 10 // Gap between trigger and popover

    switch (position) {
      case 'top':
        top = triggerRect.top - popoverRect.height - gap
        left = triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2
        break
      case 'bottom':
        top = triggerRect.bottom + gap
        left = triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2
        break
      case 'left':
        top = triggerRect.top + triggerRect.height / 2 - popoverRect.height / 2
        left = triggerRect.left - popoverRect.width - gap
        break
      case 'right':
        top = triggerRect.top + triggerRect.height / 2 - popoverRect.height / 2
        left = triggerRect.right + gap
        break
      default:
        top = triggerRect.bottom + gap
        left = triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2
    }

    // Ensure the popover stays within the viewport
    top = Math.max(gap, Math.min(top, window.innerHeight - popoverRect.height - gap))
    left = Math.max(gap, Math.min(left, window.innerWidth - popoverRect.width - gap))

    return `position: fixed; top: ${top}px; left: ${left}px; z-index: 1000;`
  }

  afterUpdate(() => {
    if (isOpen && popoverElement) {
      popoverElement.style = getPopoverStyle()
    }
  })
</script>

<div class="popover-container">
  <div bind:this={triggerElement} on:click={togglePopover}>
    <slot name="trigger">
      <button>Open Popover</button>
    </slot>
  </div>
  {#if isOpen}
    <div bind:this={popoverElement} class="popover-content">
      <slot name="content">
        <p>Default popover content</p>
      </slot>
    </div>
  {/if}
</div>

<style>
  .popover-container {
    display: inline-block;
    position: relative;
  }

  .popover-content {
    border: 1px solid black;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
</style>
