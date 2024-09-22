<script lang="ts">
  import Searchbar from './Searchbar.svelte'
  import TextBox from './TextBox.svelte'
  import { noteStore } from '@renderer/src/stores/noteStore'
  import type { Block } from '@renderer/src/app/types/block'
  import BlockContainer from './Editor/Container.svelte'

  let selectedBlock: Block
  let isFocused = false
</script>

<Searchbar
  onBlockChange={(block) => {
    selectedBlock = block
  }}
  onSubmit={() => {
    isFocused = true
  }}
/>
{#key selectedBlock?.id}
  <BlockContainer {isFocused} block={selectedBlock} />
{/key}

<style>
</style>
