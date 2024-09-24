<script lang="ts">
  import type { Block } from '@renderer/src/app/types/block'
  import { onMount, afterUpdate } from 'svelte'
  import hljs from 'highlight.js/lib/common'
  import { editorHelper } from './editorHelper'

  export let block: Block
  let value = block.properties.text

  let editableElement: HTMLTextAreaElement
  let highlightedElement: HTMLElement
  let containerElement: HTMLDivElement
  let detectedLanguage = ''

  function updateHighlight() {
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
    updateHighlight()
    adjustHeight()
    await import('highlight.js/styles/tokyo-night-light.css')
  })

  afterUpdate(() => {
    updateHighlight()
    adjustHeight()
  })

  function handleInput(event) {
    const newValue = event.target.value
    value = newValue
    adjustHeight()
  }
</script>

<div class="code-editor hljs" bind:this={containerElement}>
  <pre><code bind:this={highlightedElement}></code></pre>
  <textarea
    data-block-id={block.id}
    bind:this={editableElement}
    {value}
    on:input={handleInput}
    spellcheck="false"
    rows="1"
    use:editorHelper
  ></textarea>
  {#if detectedLanguage}
    <div class="language-indicator">{detectedLanguage}</div>
  {/if}
</div>

<style>
  .code-editor {
    position: relative;
    overflow: hidden;
    min-height: 1em;
    padding: 0.5em;
  }

  .code-editor,
  .code-editor * {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
  }

  pre,
  textarea {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0.5em;
    border: none;
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow: hidden;
  }

  pre {
    pointer-events: none;
    z-index: 1;
  }

  textarea {
    color: transparent;
    background: transparent;
    caret-color: inherit;
    z-index: 2;
    resize: none;
  }
  textarea:focus {
    outline: none;
  }

  code {
    position: relative;
    z-index: 1;
  }

  .code-editor:focus-within textarea {
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
    border-radius: 3px;
    z-index: 3;
  }

  :global(.hljs) {
    /* background: transparent !important; */
  }
</style>
