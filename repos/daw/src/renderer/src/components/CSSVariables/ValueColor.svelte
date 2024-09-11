<script lang="ts">
  import ColorPicker from './ColorPicker.svelte'
  import Popover from '../Popover.svelte'

  export let value: string = ''
  export let onChange: (value: string) => void = () => {}

  let popoverOpen = false
  let showColorPicker = false

  function toggleColorPicker() {
    showColorPicker = !showColorPicker
  }
</script>

<div class="main">
  <Popover bind:open={popoverOpen} position="bottom">
    <div class="preview" style="background-color: {value}" slot="trigger"></div>

    <ColorPicker {value} on:change={(event) => onChange(event.detail)} />
  </Popover>
  {value}
</div>

<style>
  .main {
    align-items: center;
    display: flex;
    flex-direction: row;
    position: relative;
  }

  .preview {
    width: 10px;
    height: 10px;
    margin-right: 10px;
    cursor: pointer;
  }
</style>
