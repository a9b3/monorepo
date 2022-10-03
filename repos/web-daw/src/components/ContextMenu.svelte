<script lang="ts">
  import { objectStyle } from 'src/utils/objectToStyleStr'

  interface MenuT {
    type: 'item'
    onClick: () => void
    label: string
  }

  export let menu: MenuT[] = []

  let parentEl: EventTarget
  let showMenu = false
  let pos = { x: 0, y: 0 }
  function closeMenu() {
    showMenu = false
  }
  export function handleRightClick(evt: MouseEvent) {
    pos = { x: evt.clientX, y: evt.clientY }
    showMenu = true
    parentEl = evt.target
  }

  let menuEl: HTMLDivElement
  function onPageClick(e: MouseEvent) {
    if (
      e.target === menuEl ||
      (e.target instanceof Element && menuEl?.contains(e.target))
    ) {
      return
    }
    showMenu = false
  }
  function onPageRightClick(e: MouseEvent) {
    if (showMenu && e.target !== parentEl) {
      showMenu = false
    }
  }
</script>

{#if showMenu}
  <div
    bind:this={menuEl}
    class={($$restProps.class || '') + ' main'}
    style={($$restProps.style || '') +
      objectStyle({
        position: 'absolute',
        top: `${pos.y}px`,
        left: `${pos.x}px`,
      })}
    on:click={closeMenu}
  >
    {#each menu as el}
      <div class="row" on:click={el.onClick}>
        {el.label}
      </div>
    {/each}
  </div>
{/if}

<svelte:body
  on:click={onPageClick}
  on:contextmenu|preventDefault={onPageRightClick} />

<style>
  .main {
    display: grid;
    background: var(--colors__bg);
    outline: 1px solid var(--colors__fg2);
    width: 200px;
    box-shadow: 0px 5px 5px 5px rgba(0, 0, 0, 0.05);
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
