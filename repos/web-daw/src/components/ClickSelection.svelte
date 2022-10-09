<script lang="ts">
  import { objectStyle } from 'src/utils/objectToStyleStr'

  type Option = {
    key: string
    label: string
  }

  export let options: Readonly<Option[]> = []
  export let selectedKeys = []
  export let onSelect: (key: Option) => void

  let showMenu = false
</script>

<div
  style={objectStyle({ position: 'relative' })}
  on:click={() => (showMenu = !showMenu)}
>
  <slot />
  {#if showMenu}
    <div class="card">
      {#each options as option}
        <div
          class="option"
          class:selected={selectedKeys.includes(option.key)}
          on:click={() => {
            onSelect(option)
          }}
        >
          {option.label}
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .card {
    border-radius: 4px;
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 50%;
    background: var(--colors__bottom);
    transform: translate(-50%, 20px);
    z-index: 10;
  }
  .option {
    padding: 10px 20px;
    width: 120px;
  }
  .option:hover {
    filter: brightness(0.8);
  }
</style>
