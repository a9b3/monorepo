<!--
  @component

  Usage

    contextMenu.openMenu(evt)

    <ContextMenu
      bind:this={contextMenu}
      menu={[
        onClick: () => {}
        label: 'Foo
      ]}
    />
-->
<script lang="ts">
  import type { MenuItem } from './types'
  import { directSubtreeOf, objectStyle } from 'src/utils'

  // Configure the context menu through this prop
  export let menu: MenuItem[] = []
  // bind to this component from parent to access this function to open menu
  export function openMenu(evt: MouseEvent) {
    if (
      !directSubtreeOf(
        evt.target as HTMLElement,
        anchor,
        el => el.getAttribute('data-component-type') === 'contextmenu'
      )
    ) {
      return
    }
    showMenu = true
    menuPos = {
      top: `${evt.clientY}px`,
      left: `${evt.clientX}px`,
    }
    window.addEventListener('mousedown', onmousedown)
  }
  export function closeMenu() {
    showMenu = false
    menuEl.style.display = 'none'
  }

  let showMenu = false
  let anchor: HTMLElement
  let menuEl: HTMLDivElement
  let menuPos = {
    top: '',
    left: '',
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
      menuEl.style.display = 'none'
    }
    window.removeEventListener('mousedown', onmousedown)
  }
</script>

<div class="hidden" bind:this={anchor} data-component-type="contextmenu" />
{#if showMenu}
  <div
    bind:this={menuEl}
    class={'main'}
    on:click={closeMenu}
    style={objectStyle(menuPos)}
  >
    {#each menu as item}
      {#if item.type === 'item'}
        <div class="row" on:click={item.onClick}>
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
  .hidden {
    visibility: none;
  }

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
