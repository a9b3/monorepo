<script lang="ts">
  import TopBar from './TopBar.svelte'
  import windowState from './windowState'
  import { mousePosition } from 'src/utils/mousePosition'

  export let showWindow = false
  export let title = ''

  function draggable(node: HTMLElement) {
    const z = windowState.focus(node)
    let moving = false

    // (note): position the newly created window centered right under the cursor
    let left = mousePosition.x - node.offsetWidth / 2
    let top = mousePosition.y - 10

    node.style.position = 'absolute'
    node.style.top = `${top}px`
    node.style.left = `${left}px`
    node.style.cursor = 'move'
    node.style.userSelect = 'none'
    node.style.zIndex = `${z}`

    function handleMouseDown() {
      windowState.focus(node)
      moving = true
    }
    function handleMouseMove(e: MouseEvent) {
      if (moving) {
        left += e.movementX
        top += e.movementY
        node.style.top = `${top}px`
        node.style.left = `${left}px`
      }
    }
    function handleMouseUp() {
      moving = false
    }

    function handleChange() {
      const zIndex = windowState.getZIndex(node)
      node.style.zIndex = `${zIndex}`
    }

    node.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    windowState.on('change', handleChange)

    return {
      destroy() {
        windowState.removeListener('change', handleChange)
        windowState.remove(node)
        node.removeEventListener('mousedown', handleMouseDown)
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      },
    }
  }
</script>

{#if showWindow}
  <div
    class={($$restProps.class || '') + ' main'}
    style={$$restProps.style}
    use:draggable
  >
    <div class="top">
      <TopBar
        {title}
        onClose={() => {
          showWindow = false
        }}
      />
    </div>
    <div class="content">
      <slot />
    </div>
  </div>
{/if}

<style>
  .main {
    background: white;
    position: absolute;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: var(--misc__borderRadius);
    outline: 1px solid var(--colors__bg2);
    box-shadow: var(--misc__windowBorder);
  }
  .top {
    height: 30px;
  }
  .content {
    flex-grow: 1;
  }
</style>
