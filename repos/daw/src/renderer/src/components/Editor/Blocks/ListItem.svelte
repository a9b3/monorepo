<script lang="ts">
  import type { ListItem } from '@renderer/src/app/types/block'
  import { editorHelper } from './editorHelper'

  export let block: ListItem

  let textBuffer = block.properties.text
</script>

<div
  style="--indent-level: {block.properties.indentLevel}"
  data-block-id={block.id}
  class="list-item"
  contenteditable={true}
  use:editorHelper
>
  {@html textBuffer}
</div>

<style>
  .list-item {
    width: 100%;
    padding-left: calc(var(--spacing-s) + calc(var(--spacing-s) * var(--indent-level)));
    position: relative;
  }

  .list-item::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
  }

  .list-item:focus {
    outline: none;
  }
</style>
