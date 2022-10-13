<!--
  @component

  A generic window component.
-->
<script lang="ts">
  import { mousePosition, objectStyle } from 'src/utils'
  import TopBar from './TopBar.svelte'
  import DragXy from './DragXY.svelte'
  import windowState from './windowState'

  export let showWindow = false
  export let resizable = false
  export let title = ''

  let topbarEl: HTMLElement
  let mainWindowEl: HTMLElement

  function resizeHandler(x: number, y: number) {
    mainWindowEl.style.width = `${mainWindowEl.offsetWidth + x}px`
    mainWindowEl.style.height = `${mainWindowEl.offsetHeight + y}px`
  }

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

    function handleMouseDown(evt: MouseEvent) {
      if (topbarEl && topbarEl.contains(evt.target)) {
        windowState.focus(node)
        moving = true
        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mouseup', handleMouseUp)
      }
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
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }

    function handleChange() {
      const zIndex = windowState.getZIndex(node)
      node.style.zIndex = `${zIndex}`
    }

    node.addEventListener('mousedown', handleMouseDown)
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
    bind:this={mainWindowEl}
    class={($$restProps.class || '') + ' main'}
    style={$$restProps.style}
    use:draggable
  >
    <div class="top" bind:this={topbarEl}>
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
    {#if resizable}
      <DragXy
        onDrag={resizeHandler}
        style={objectStyle({
          width: '20px',
          height: '20px',
          background: 'black',
          marginLeft: 'auto',
        })}
      />
    {/if}
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
