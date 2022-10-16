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
  import { directSubtreeOf } from 'src/utils'

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
    menuEl.style.display = 'grid'
    menuEl.style.top = `${evt.clientY}px`
    menuEl.style.left = `${evt.clientX}px`

    window.addEventListener('mousedown', onmousedown)
  }
  export function closeMenu() {
    menuEl.style.display = 'none'
  }

  let anchor: HTMLElement
  let menuEl: HTMLDivElement

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
<div bind:this={menuEl} class={'main'} on:click={closeMenu}>
  {#each menu as el}
    <div class="row" on:click={el.onClick}>
      {el.label}
    </div>
  {/each}
</div>

<style>
  .hidden {
    visibility: none;
  }
  .main {
    display: none;
    position: fixed;
    background: var(--colors__bg);
    outline: 1px solid var(--colors__fg2);
    width: 200px;
    box-shadow: 0px 5px 5px 5px rgba(0, 0, 0, 0.05);
    z-index: 100;
  }

  .row {
    height: 30px;
    display: flex;
    align-items: center;
    padding: 0 var(--spacing__padding);
  }
  .row:hover {
    background: var(--colors__bgHover);
  }
</style>
