<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import type { MenuItemGroup } from 'src/ui/contextMenu/manager'
  import { contextMenuStore } from 'src/store'

  export let ctxSwitch: boolean = false
  export let menu: MenuItemGroup
  let id = crypto.randomUUID()
  let hiddenEl: HTMLElement

  onMount(() => {
    hiddenEl.parentElement.setAttribute(
      contextMenuStore.switchAttr,
      ctxSwitch ? 'off' : 'on'
    )
    hiddenEl.parentElement.setAttribute(contextMenuStore.idAttr, id)

    contextMenuStore.add(id, menu)
  })
  onDestroy(() => {
    hiddenEl.parentElement.removeAttribute(contextMenuStore.switchAttr)
    hiddenEl.parentElement.removeAttribute(contextMenuStore.idAttr)

    contextMenuStore.delete(id)
  })
</script>

<div class="hidden" bind:this={hiddenEl} />

<style>
  .hidden {
    visibility: none;
  }
</style>
