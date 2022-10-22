<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { contextMenuStore } from 'src/store'
  import { findFirstAncestor } from 'src/utils/domhelpers'
  import { objectStyle } from 'src/utils'

  let showMenu = false
  let menuEl: HTMLDivElement
  let menuPos = {
    top: '',
    left: '',
  }
  let currentMenu = []

  function oncontextmenu(evt: MouseEvent) {
    menuPos = {
      top: `${evt.clientY}px`,
      left: `${evt.clientX}px`,
    }

    const shouldShow = findFirstAncestor(evt.target as HTMLElement, el => {
      const type = el.getAttribute(contextMenuStore.switchAttr)
      return ['on', 'off'].includes(type) ? type : undefined
    })

    if (!shouldShow || shouldShow === 'off') {
      showMenu = false
      return
    }

    showMenu = true

    currentMenu = contextMenuStore.buildCurrentMenu(evt)

    window.addEventListener('mousedown', onmousedown)
  }

  // Close context menu on any click outside of context menu
  function onmousedown(e: MouseEvent) {
    if (
      e.target === menuEl ||
      (e.target instanceof Element && menuEl?.contains(e.target))
    ) {
      // do nothing
      return
    } else {
      showMenu = false
    }
    window.removeEventListener('mousedown', onmousedown)
  }

  onMount(() => {
    window.addEventListener('contextmenu', oncontextmenu)
  })
  onDestroy(() => {
    window.removeEventListener('contextmenu', oncontextmenu)
  })
</script>

{#if showMenu}
  <div
    bind:this={menuEl}
    class={'main'}
    on:click={() => {
      showMenu = false
    }}
    style={objectStyle(menuPos)}
  >
    {#each currentMenu as item}
      {#if item.type === 'item'}
        <div class="row" on:click={item.handler}>
          {item.label}
        </div>
      {/if}
      {#if item.type === 'divider'}
        <div class="divider" />
      {/if}
    {/each}
  </div>
{/if}

<style>
  .main {
    --shadow-color: var(--hsl__accent);

    display: grid;
    position: fixed;
    background: var(--colors__bg);
    width: 200px;
    box-shadow: var(--shadows__2);
    z-index: 100;
    border-radius: 2px;
  }

  .row {
    height: 36px;
    display: flex;
    align-items: center;
    padding: var(--spacing__padding) var(--spacing__paddingL);
  }

  .row:hover {
    background: var(--colors__bgHover);
  }

  .divider {
    width: 85%;
    margin: 0 auto;
    border-bottom: 1px solid var(--colors__fg3);
  }
</style>
