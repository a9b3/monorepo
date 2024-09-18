<script lang="ts">
  import Searchbar from './Searchbar.svelte'
  import TextBox from './TextBox.svelte'
  import uiStore from '@renderer/src/stores/ui'

  let textBoxRef: HTMLDivElement
</script>

<Searchbar onSubmit={() => textBoxRef.focus()} />
<TextBox bind:textBoxRef />

<style>
</style>
