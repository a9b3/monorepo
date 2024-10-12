<script lang="ts">
  import { onMount, afterUpdate, onDestroy } from 'svelte'

  export let position = 'bottom'
  export let align = 'center' // New prop for horizontal alignment
  export let isOpen = false
  export let triggerElement: HTMLElement
  export let gap = 2 // Gap between trigger and popover

  let popoverElement: HTMLElement

  function handleClickOutside(event: MouseEvent) {
    if (
      popoverElement &&
      !popoverElement.contains(event.target as Node) &&
      triggerElement &&
      !triggerElement.contains(event.target as Node)
    ) {
      isOpen = false
    }
  }

  function handleDelete(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      isOpen = false
    }
  }

  function getPopoverStyle() {
    if (!triggerElement || !popoverElement) return ''
    const triggerRect = triggerElement.getBoundingClientRect()
    const popoverRect = popoverElement.getBoundingClientRect()
    let top: number
    let left: number

    switch (position) {
      case 'top':
        top = triggerRect.top - popoverRect.height - gap
        break
      case 'bottom':
        top = triggerRect.bottom + gap
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
    }

    // Handle horizontal alignment for top and bottom positions
    if (position === 'top' || position === 'bottom') {
      switch (align) {
        case 'left':
          left = triggerRect.left
          break
        case 'right':
          left = triggerRect.right - popoverRect.width
          break
        default: // center
          left = triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2
      }
    }

    // Ensure the popover stays within the viewport
    top = Math.max(gap, Math.min(top, window.innerHeight - popoverRect.height - gap))
    left = Math.max(gap, Math.min(left, window.innerWidth - popoverRect.width - gap))

    console.log(triggerRect, top)

    return `position: fixed; top: ${top}px; left: ${left}px; z-index: 5000;`
  }

  onMount(() => {
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleDelete)
  })

  onDestroy(() => {
    document.removeEventListener('mousedown', handleClickOutside)
    document.removeEventListener('keydown', handleDelete)
  })

  afterUpdate(() => {
    if (isOpen && popoverElement) {
      console.log(`invoked update`)
      popoverElement.style.cssText = getPopoverStyle()
    }
  })
</script>

{#if isOpen}
  <div bind:this={popoverElement} class="app-win-border container">
    <slot>
      <p>Default popover content</p>
    </slot>
  </div>
{/if}

<style>
  .container {
    position: fixed;
  }
</style>
