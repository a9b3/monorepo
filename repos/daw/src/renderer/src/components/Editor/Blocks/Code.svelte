<script lang="ts">
  import type { Code } from '@renderer/src/app/types/block'
  import { onMount, afterUpdate } from 'svelte'
  import hljs from 'highlight.js/lib/common'

  export let registerBlock: (node: HTMLElement, id: string) => void
  export let block: Code

  let value = block.properties.text || ' '
  let editableElement: HTMLDivElement
  let highlightedElement: HTMLElement
  let containerElement: HTMLDivElement
  let detectedLanguage = ''

  function updateHighlight(value) {
    if (highlightedElement && value) {
      const result = hljs.highlightAuto(value)
      highlightedElement.innerHTML = result.value
      detectedLanguage = result.language || 'plaintext'
    } else if (highlightedElement) {
      highlightedElement.innerHTML = ''
      detectedLanguage = ''
    }
  }

  function adjustHeight() {
    if (editableElement && containerElement) {
      containerElement.style.height = 'auto'
      containerElement.style.height = `${editableElement.scrollHeight}px`
    }
  }

  onMount(async () => {
    updateHighlight(editableElement.innerText)
    adjustHeight()
  })

  function handleInput(event: Event) {
    updateHighlight((event.target as HTMLElement).innerText)
    adjustHeight()
  }
</script>

<div class="code-editor hljs" bind:this={containerElement}>
  <pre><code bind:this={highlightedElement}></code></pre>
  <div
    class="inputarea"
    bind:this={editableElement}
    contenteditable
    on:input={handleInput}
    spellcheck="false"
    use:registerBlock={block.id}
  >
    {@html value}
  </div>
  {#if detectedLanguage}
    <div class="language-indicator">{detectedLanguage}</div>
  {/if}
</div>

<style>
  .code-editor {
    position: relative;
    overflow: hidden;
    min-height: 1em;
    padding: var(--spacing-xs);
    border-radius: var(--border-radius);
  }

  .code-editor,
  .code-editor * {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
  }

  pre,
  .inputarea {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: var(--spacing-xs);
    border: none;
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow: hidden;
  }

  pre {
    pointer-events: none;
    z-index: 1;
  }

  .inputarea {
    color: transparent;
    background: transparent;
    caret-color: inherit;
    z-index: 2;
    resize: none;
  }
  .inputarea:focus {
    outline: none;
  }

  code {
    position: relative;
    z-index: 1;
  }

  .code-editor:focus-within .inputarea {
    color: inherit;
    -webkit-text-fill-color: transparent;
  }

  .language-indicator {
    position: absolute;
    bottom: 5px;
    right: 5px;
    font-size: 0.8em;
    color: inherit;
    background-color: rgba(255, 255, 255, 0.3);
    padding: 2px 5px;
    z-index: 3;
  }

  :global(.hljs) {
    /* background: transparent !important; */
  }
</style>
