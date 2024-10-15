<script lang="ts">
  import { onMount } from 'svelte'
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
  })
</script>

{#if show}
  <div
    class="main app-win-border"
    use:shortcutManager.setContext={{
      context: 'confirmDialogue',
      title: 'Confirm Dialogue',
      description: 'Confirm dialogue',
      shortcuts: [
        {
          key: 'Escape',
          action: () => {
            handleCancel()
          },
        },
        {
          key: 'Enter',
          action: () => {
            handleConfirm()
          },
        },
      ],
    }}
  >
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
    align-items: center;
    background: var(--colors-bg);
    padding: var(--spacing-xs);
  }
  .main:hover {
    cursor: default;
  }

  .buttons {
    display: flex;
    gap: var(--spacing-xs);
  }
</style>
