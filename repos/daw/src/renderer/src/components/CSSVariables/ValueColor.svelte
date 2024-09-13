<script lang="ts">
  import ColorPicker from './ColorPicker.svelte'
  import Popover from '../Popover.svelte'
  import Input from './Input.svelte'

  export let value: string = ''
  export let onChange: (value: string) => void = () => {}
</script>

<div class="main">
  <Popover position="bottom">
    <div class="preview" style="background-color: {value}" slot="trigger"></div>

    <div slot="content">
      <ColorPicker bind:value on:change={(event) => onChange(event.detail)} />
    </div>
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
