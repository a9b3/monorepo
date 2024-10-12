<script lang="ts">
  import type { ListItem } from '@renderer/src/app/types/block'

  export let registerBlock: (node: HTMLElement, id: string) => void
  export let block: ListItem

  let textBuffer = block.properties.text
</script>

<div
  style="--indent-level: {block.properties.indentLevel}"
  class="list-item"
  contenteditable={true}
  use:registerBlock={block.id}
>
  {@html textBuffer}
</div>

<style>
  .list-item {
    width: 100%;
    padding-left: calc(var(--spacing-xs) + calc(var(--spacing-s) * var(--indent-level)));
    position: relative;
  }

  .list-item::before {
    --height: calc(var(--base-line-height) / 2);

    content: '';
    position: absolute;
    left: calc(calc(var(--spacing-s) * var(--indent-level)));
    top: var(--height);
    transform: translateY(calc(var(--height) / 2 * -1));
    width: 5px;
    height: 5px;
    background: currentColor;
  }

  .list-item:focus {
    outline: none;
  }
</style>
