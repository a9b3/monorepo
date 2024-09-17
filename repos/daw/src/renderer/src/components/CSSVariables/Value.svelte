<script lang="ts">
  import { determineCssValueType } from './determineCSSValueType'
  import ValueColor from './ValueColor.svelte'
  import Input from './Input.svelte'

  export let value: string = ''
  export let onChange: (value: string) => void = () => {}

  $: {
    onChange(value)
  }

  const type = determineCssValueType(value)
</script>

<div class="main">
  {#if type === 'color'}
    <ValueColor bind:value />
  {:else if type === 'custom property'}
    <Input bind:value />
  {:else}
    <Input bind:value />
  {/if}
</div>

<style>
  .main {
    display: flex;
    align-items: center;
    padding: 2px 8px;
  }
  .main:hover {
    box-shadow: inset 0 0 0 1px var(--primative-colors-grey6);
  }
  .main:focus-within {
    box-shadow: inset 0 0 0 2px var(--primative-colors-blue1);
  }
</style>
