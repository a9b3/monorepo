<script lang="ts">
  import type { Url } from '@renderer/src/app/types/block'
  import Popover from '@renderer/src/components/generic/Popover.svelte'
  import editorStore from '@renderer/src/stores/editor'
  import shortcutsStore from '@renderer/src/stores/shortcutManager'
  import Icon from '@renderer/src/components/generic/Icon.svelte'

  export let registerBlock: (node: HTMLElement, id: string) => void
  export let block: Url

  let showPopover = false
  let hrefEl: HTMLElement
  let editEl: HTMLInputElement
  let textBuffer = block.properties.text

  let timeout: any
  function delayedEnter() {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      showPopover = true
    }, 500)
  }

  function oninput(e: any) {
    $editorStore.editor.updateBlock(block.id, {
      ...block,
      properties: { ...block.properties, href: e.target.value },
    })
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  bind:this={hrefEl}
  class="main"
  on:mouseenter={() => {
    delayedEnter()
  }}
  on:mouseleave={() => {
    if (timeout) clearTimeout(timeout)
    showPopover = false
  }}
  on:blur={() => {
    if (timeout) clearTimeout(timeout)
    showPopover = false
  }}
>
  <div class="icon">
    <Icon icon="link" size=".6em" color="var(--colors-fg2)" />
  </div>
  <div class="input" contenteditable spellcheck="false" use:registerBlock={block.id}>
    {@html textBuffer}
  </div>

  <Popover gap={0} position="bottom" bind:isOpen={showPopover} triggerElement={hrefEl} align="left">
    <div
      class="edit"
      use:shortcutsStore.setContext={{
        title: 'Edit URL',
        context: 'url',
        description: 'Edit the URL of this link',
        shortcuts: [
          {
            key: 'Tab',
            description: 'Focus',
            action: () => {
              editEl.focus()
              editEl.select()
            },
          },
        ],
      }}
    >
      <div>
        <input
          bind:this={editEl}
          type="text"
          value={block.properties.href}
          on:click={() => {
            editEl.select()
          }}
          on:input={oninput}
        />
      </div>
    </div>
  </Popover>
</div>

<style>
  .main {
    display: flex;
  }
  .icon {
    margin-right: var(--spacing-xs);
    cursor: pointer;
  }
  .input {
    width: 100%;
  }
  .input:focus {
    outline: none;
  }

  .edit {
    padding: var(--spacing-xxs);
    width: 250px;
    background: var(--colors-bg);
  }

  input {
    font-family: var(--font-family);
    width: 100%;
  }
</style>
