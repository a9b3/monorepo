<script>
  import { onMount, afterUpdate, onDestroy } from 'svelte'
  import Portal from './Portal.svelte'

  export let position = 'bottom'
  let isOpen = false
  let popoverElement
  let triggerElement
  let portalContainer

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

    // Create a container for the portal
    portalContainer = document.createElement('div')
    portalContainer.id = 'popover-portal'
    document.body.appendChild(portalContainer)
  })

  onDestroy(() => {
    document.removeEventListener('mousedown', handleClickOutside)
    if (portalContainer && document.body.contains(portalContainer)) {
      document.body.removeChild(portalContainer)
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

    return `position: fixed; top: ${top}px; left: ${left}px; z-index: 5000;`
  }

  afterUpdate(() => {
    if (isOpen && popoverElement) {
      popoverElement.style = getPopoverStyle()
    }
  })
</script>

<div class="popover-trigger">
  <div bind:this={triggerElement} on:click={togglePopover}>
    <slot name="trigger">
      <button>Open Popover</button>
    </slot>
  </div>
</div>

{#if isOpen && portalContainer}
  <Portal target={portalContainer}>
    <div bind:this={popoverElement} class="popover-content">
      <slot name="content">
        <p>Default popover content</p>
      </slot>
    </div>
  </Portal>
{/if}

<style>
  .popover-trigger {
    display: inline-block;
  }
  .popover-content {
    border: 1px solid black;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    background-color: white;
  }
</style>
