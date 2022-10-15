<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { windowManager } from 'src/ui'

  function manager(node: HTMLElement) {
    windowManager.focus(node)

    return {
      destroy() {
        windowManager.remove(node)
      },
    }
  }
</script>

<div class={'main'} use:manager />

<style>
  .main {
  }
</style>
