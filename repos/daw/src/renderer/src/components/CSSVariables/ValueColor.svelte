<script lang="ts">
  import ColorPicker from './ColorPicker.svelte'
  import Popover from '../Popover.svelte'
  import Input from './Input.svelte'

  export let value: string = ''
  export let onChange: (value: string) => void = () => {}

  let popoverOpen = false
</script>

<div class="main">
  <Popover bind:open={popoverOpen} position="bottom">
    <div class="preview" style="background-color: {value}" slot="trigger"></div>

    <ColorPicker bind:value on:change={(event) => onChange(event.detail)} />
  </Popover>

  <Input bind:value />
</div>

<style>
  .main {
    align-items: center;
    display: flex;
    flex-direction: row;
    width: 100%;
  }

  .preview {
    width: 16px;
    height: 16px;
    margin-right: 4px;
  }
</style>
