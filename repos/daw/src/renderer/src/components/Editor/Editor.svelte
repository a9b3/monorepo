<script lang="ts">
  import { onMount } from 'svelte'
  import editorStore from '@renderer/src/stores/editor'
  import Block from './Blocks/Block.svelte'
  import { EditorDom } from './editorDom'
  import Popover from '@renderer/src/components/generic/Popover.svelte'
  import UrlEdit from './UrlEdit.svelte'

  export let editorDom: EditorDom

  let editorEl: HTMLDivElement

  /**
   * Open links in new tab.
   */
  function handleDocumentClick(event: MouseEvent) {
    if (event.target.tagName === 'A' && event.target.href.startsWith('http')) {
      event.preventDefault()
      window.open(event.target.href, '_blank')
    }
  }

  let urlEditArgs = {
    href: '',
    text: '',
    showPopover: false,
    triggerEl: null,
    cursor: null,
    homeRange: null,
    onSave: function (arg: { href: string; text: string }) {
      editorDom.insertLink({ href: arg.href, text: arg.text, insertRange: urlEditArgs.cursor })
      urlEditArgs.showPopover = false
      window.getSelection().removeAllRanges()
      window.getSelection().addRange(urlEditArgs.homeRange)
    },
    onCancel: function () {
      urlEditArgs.showPopover = false
      window.getSelection().removeAllRanges()
      window.getSelection().addRange(urlEditArgs.homeRange)
    },
  }
  function toggleUrlEdit({ trigger, href, text, cursor, homeRange }) {
    if (urlEditArgs.showPopover) {
      urlEditArgs.showPopover = false
    } else {
      urlEditArgs.showPopover = true
      urlEditArgs.triggerEl = trigger
      urlEditArgs.href = href
      urlEditArgs.text = text
      urlEditArgs.cursor = cursor
      urlEditArgs.homeRange = homeRange
    }
  }

  onMount(() => {
    const teardown = editorDom.onEditorCreate(editorEl, {
      toggleUrlEdit,
    })
    document.addEventListener('click', handleDocumentClick)

    return {
      destroy: () => {
        teardown()
        document.removeEventListener('click', handleDocumentClick)
      },
    }
  })
</script>

<div class="main" bind:this={editorEl}>
  <div class="wrapper">
    {#each $editorStore.editor.page.children as childBlock}
      {#key childBlock.id + childBlock.type}
        <Block block={childBlock} registerBlock={editorDom.onBlockCreate} />
      {/key}
    {/each}
  </div>

  <Popover
    position="bottom"
    bind:isOpen={urlEditArgs.showPopover}
    triggerElement={urlEditArgs.triggerEl}
    align="left"
    onClose={urlEditArgs.onCancel}
  >
    <UrlEdit
      href={urlEditArgs.href}
      text={urlEditArgs.text}
      onSave={urlEditArgs.onSave}
      onCancel={urlEditArgs.onCancel}
    />
  </Popover>
</div>

<style>
  .main {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--spacing-xxs) var(--spacing-s);
    overflow: auto;
    user-select: none;
  }

  .wrapper {
    max-width: 40rem;
    width: 100%;
  }

  :global(a) {
    text-decoration: none;
    color: var(--colors-hl);
    cursor: pointer;
  }
</style>
