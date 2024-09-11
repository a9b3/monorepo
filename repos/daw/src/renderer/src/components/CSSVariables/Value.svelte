<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { determineCssValueType } from './determineCSSValueType'
  import ValueColor from './ValueColor.svelte'

  export let value: string = ''
  export let onChange: (value: string) => void = () => {}

  const type = determineCssValueType(value)

  onMount(() => {})
  onDestroy(() => {})
</script>

<div class="main">
  {#if type === 'color'}
    <ValueColor {value} {onChange} />
  {:else if type === 'custom property'}
    <input type="text" {value} on:input={(e) => onChange(e.target.value)} />
  {:else}
    <input type="text" {value} on:input={(e) => onChange(e.target.value)} />
  {/if}
</div>

<style>
  .main {
  }
</style>
