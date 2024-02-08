<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import Text from '../Text/Text.svelte'
  import Icon from '../Icon/Icon.svelte'

  // -------------------------------------------------------------------------
  // Props
  // -------------------------------------------------------------------------
  export let text: string = ''
  export let leftIcon: string | null = null
  export let rightText: string | null = null
  export let rightIcon: string | null = null
  export let isSelected: boolean = false
  export let subtitle: string | null = null

  // -------------------------------------------------------------------------
  // Internal
  // -------------------------------------------------------------------------

  onMount(() => {})
  onDestroy(() => {})
</script>

<div class="row">
  {#if leftIcon}
    <div class="leftIcon">
      <Icon type={leftIcon} />
    </div>
  {/if}
  <div class="text">
    <Text isBold>
      {text}
    </Text>
    {#if subtitle}
      <Text isSubtitle>
        {subtitle}
      </Text>
    {/if}
  </div>
  {#if rightText}
    <div class="rightText">
      <Text isSubtitle>
        {rightText}
      </Text>
    </div>
  {/if}
  {#if rightIcon}
    <div class="rightIcon">
      <Icon type={rightIcon} />
    </div>
  {/if}
</div>

<style>
  .row {
    display: grid;
    grid-template: 'leftIcon text rightText rightIcon' 1fr / auto 1fr auto auto;
    width: 100%;
    align-items: center;
    column-gap: var(--pv_spacing_-1);
    padding: var(--pv_spacing_1) var(--pv_spacing_2);
  }
  .row:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .text {
    grid-area: text;
    display: grid;
    grid-template:
      'main' auto
      'subtitle' auto / 1fr;
  }
</style>
