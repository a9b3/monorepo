<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { parseCombosForHelpMenu } from 'src/ui/keyboard/manager'
  import type { KeyboardManager } from 'src/ui/keyboard/manager'

  export let keyboardManager: KeyboardManager

  const parsed = parseCombosForHelpMenu(
    keyboardManager.combos,
    keyboardManager.boundaryManager.activeBoundary.key
  )

  console.log(parsed)

  onMount(() => {})
  onDestroy(() => {})
</script>

<div class="main" />

<style>
  .main {
  }
</style>
