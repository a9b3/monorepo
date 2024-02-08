<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { svgData, primatives } from '@monorepo/web-core/styles'
  import Icon from '../Icon/Icon.svelte'

  // -------------------------------------------------------------------------
  // Props
  // -------------------------------------------------------------------------

  export let type: 'compact' | 'default' = 'default'
  export let text: string = 'Button'
  export let iconType: keyof typeof svgData['stroke'] | undefined = undefined
  export let size: keyof typeof primatives.float | undefined = undefined
  export let disabled: boolean = false

  // -------------------------------------------------------------------------
  // Internal
  // -------------------------------------------------------------------------

  function objToCss(obj: { [index: string]: string | number }) {
    return Object.entries(obj)
      .map(([key, value]) => `${key}: ${value}`)
      .join('; ')
  }

  $: buttonStyle = {}
  $: {
    if (iconType) {
      buttonStyle['grid-template'] = `'icon text' auto / auto 1fr`
    } else {
      buttonStyle['grid-template'] = `'text' auto / 1fr`
    }

    if (size) {
      buttonStyle['font-size'] = `var(--${size})`
    }

    if (type === 'compact') {
      buttonStyle['padding'] = `var(--pv_spacing_-1) var(--pv_spacing_1)`
    } else {
      buttonStyle['padding'] = `var(--pv_spacing_1) var(--pv_spacing_2)`
    }
  }

  onMount(() => {})
  onDestroy(() => {})
</script>

<button class="button" style={objToCss(buttonStyle)} on:click {disabled}>
  {#if iconType}
    <span class="icon">
      <Icon type={iconType} {size} />
    </span>
  {/if}
  <div class="text">
    {text}
  </div>
</button>

<style>
  .button {
    display: grid;
    grid-template: 'icon text' auto / auto 1fr;
    column-gap: var(--pv_spacing_-2);
    padding: 1em calc(calc(var(--pv_spacing_base_ratio)) * 1em);
    align-items: center;
    font-weight: 600;
    background-color: var(--pv_colors_grey_800);
    color: var(--pv_colors_grey_200);
    border: 1px solid var(--pv_colors_grey_700);
    border-radius: var(--pv_radius_xs);
  }

  .button:disabled {
    color: var(--pv_colors_grey_500);
    background-color: var(--pv_colors_grey_700);
  }

  .button:not([disabled]):hover:focus {
    cursor: pointer;
    background-color: var(--pv_colors_grey_700);
  }

  .icon {
    grid-area: icon;
  }

  .text {
    grid-area: text;
    text-align: center;
  }
</style>
