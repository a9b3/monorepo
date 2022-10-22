<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { BoundaryApp } from 'src/components'
  import { keyboardStore, showHelp } from 'src/store'
  import KeyboardBoundary from './KeyboardBoundary.svelte'
  import KeyboardHelp from './KeyboardHelp.svelte'

  onMount(async () => {
    keyboardStore.start()
  })
  onDestroy(() => {
    keyboardStore.stop()
  })
</script>

<BoundaryApp boundaryManager={keyboardStore.boundaryManager}>
  <KeyboardBoundary
    key="global"
    comboHandler={{
      'Shift+?': {
        key: 'help',
        description: 'Toggle help menu.',
        handler: () => {
          showHelp.set(!$showHelp)
        },
      },
    }}
  />
  <slot />
</BoundaryApp>

{#if $showHelp}
  <div class="help">
    <KeyboardHelp keyboardManager={keyboardStore} />
  </div>
{/if}

<style>
  .help {
    z-index: 500;
    top: 0;
    left: 0;
    position: fixed;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
