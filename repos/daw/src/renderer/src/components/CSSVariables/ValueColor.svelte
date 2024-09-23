<script lang="ts">
  import Popover from '@renderer/src/components/generic/Popover.svelte'
  import ColorPicker from './ColorPicker.svelte'
  import Input from './Input.svelte'

  export let value: string = ''
  export let onChange: (value: string) => void = () => {}

  let triggerElement: HTMLElement
  let showColorPicker = false
</script>

<div class="main">
  <div
    class="preview"
    bind:this={triggerElement}
    style="background-color: {value}"
    on:click={() => (showColorPicker = !showColorPicker)}
  ></div>

  <Popover position="bottom" isOpen={showColorPicker} {triggerElement}>
    <div>
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
