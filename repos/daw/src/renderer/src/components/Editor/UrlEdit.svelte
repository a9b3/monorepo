<script lang="ts">
  import { onMount } from 'svelte'
  import Button from '@renderer/src/components/generic/Button.svelte'

  export let onSave: (arg: { href: string; text: string }) => void
  export let onCancel: () => void
  export let href = ''
  export let text = ''

  let urlEl, textEl

  onMount(() => {
    urlEl.focus()

    function handleKeydown(evt) {
      if (evt.key === 'Enter') {
        evt.preventDefault()
        onSave({ href, text })
        return
      }

      if (evt.target !== urlEl && evt.target !== textEl) {
        onCancel()
        return
      }
    }
    window.addEventListener('keydown', handleKeydown)

    return () => {
      window.removeEventListener('keydown', handleKeydown)
    }
  })
</script>

<div class="main app-win-border">
  <input
    bind:this={urlEl}
    type="text"
    placeholder="URL"
    value={href}
    on:focus={(evt) => evt.target.select()}
    on:input={(evt) => (href = evt.target.value)}
  />
  <input
    bind:this={textEl}
    type="text"
    placeholder="Text"
    value={text}
    on:focus={(evt) => evt.target.select()}
    on:input={(evt) => (text = evt.target.value)}
  />
  <div class="buttons">
    <Button onClick={() => onSave({ href, text })}>Save (Enter)</Button>
    <div class="gap" />
    <Button onClick={onCancel}>Cancel (Esc)</Button>
  </div>
</div>

<style>
  .main {
    background: var(--colors-bg);
    padding: var(--spacing-xxs);
  }

  .buttons {
    display: flex;
    margin-top: var(--spacing-xxs);
    justify-content: center;
  }

  .gap {
    width: var(--spacing-xxs);
  }

  input {
    display: block;
    width: 100%;
    padding: var(--spacing-xxs);
    font-size: var(--font-size-sm);
    border-radius: 0;
    outline: none;
    border: 1px solid var(--colors-fg2);
    font-family: var(--font-family);
    margin-bottom: var(--spacing-xxs);
  }
</style>
