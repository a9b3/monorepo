<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import confirmDialogue from '@renderer/src/app/lib/ui/confirmDialogue'
  import shortcutManager from '@renderer/src/stores/shortcutManager'
  import Button from './Button.svelte'

  let show = false
  let message = ''
  let onConfirm = () => {}
  let onCancel = () => {}

  function handleConfirm() {
    show = false
    onConfirm()
  }

  function handleCancel() {
    show = false
    onCancel()
  }

  onMount(() => {
    confirmDialogue.on('show', (opts) => {
      show = true
      message = opts.message
      onConfirm = opts.onConfirm
      onCancel = opts.onCancel
    })
    $shortcutManager.manager.register({
      context: 'confirmDialogue',
      title: 'Confirm Dialogue',
      description: 'Confirm dialogue',
      shortcuts: [
        {
          key: 'Escape',
          action: () => {
            handleCancel()
          }
        },
        {
          key: 'Enter',
          action: () => {
            handleConfirm()
          }
        }
      ]
    })
    $shortcutManager.manager.pushActiveContext('confirmDialogue')
  })

  onDestroy(() => {
    $shortcutManager.manager.popActiveContext('confirmDialogue')
  })
</script>

{#if show}
  <div class="main app-win-border">
    <div class="content">{message}</div>
    <div class="buttons">
      <Button onClick={handleConfirm}>Confirm</Button>
      <Button onClick={handleCancel}>Cancel</Button>
    </div>
  </div>
{/if}

<style>
  .main {
    position: fixed;
    top: 25%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    align-items: center;
    background: var(--colors-bg);
    padding: var(--spacing-s);
  }
  .main:hover {
    cursor: default;
  }

  .buttons {
    display: flex;
    gap: 1rem;
  }
</style>
