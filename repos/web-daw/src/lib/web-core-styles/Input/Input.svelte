<script lang="ts">
  import { onMount, onDestroy } from 'svelte'

  // -------------------------------------------------------------------------
  // Props
  // -------------------------------------------------------------------------
  export let type: 'select' | 'text' = 'select'
  export let placeholder: string = 'Placeholder'

  // -------------------------------------------------------------------------
  // Internal
  // -------------------------------------------------------------------------

  onMount(() => {})
  onDestroy(() => {})
</script>

{#if type === 'select'}
  <select class="input">
    <div class="selectDropdown">hi</div>
    <option value="" disabled selected hidden>{placeholder}</option>
  </select>
{/if}
{#if type === 'text'}
  <input class="input" type="text" {placeholder} />
{/if}

<style>
  .input {
    appearance: none;
    padding: var(--pv_spacing_1) var(--pv_spacing_2);
    border-radius: var(--pv_radius_xs);
    box-shadow: none;
    background: var(--pv_colors_grey_800);
    color: var(--pv_colors_grey_200);
    border: 1px solid var(--pv_colors_grey_700);
    width: 100%;
    position: relative;
  }

  .selectDropdown {
    position: absolute;
    right: 0;
    top: 0;
    width: 10px;
    height: 10px;
  }
</style>
