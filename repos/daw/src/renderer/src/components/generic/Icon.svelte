<script lang="ts">
  import searchIcon from '../../assets/icons/search.svg?raw'
  import moveIcon from '../../assets/icons/move.svg?raw'

  export let icon: 'search' | 'move' = 'search'
  export let size: string = '1rem'
  export let color: string = 'var(--colors-fg)'

  const cases = {
    search: searchIcon,
    move: moveIcon
  }
</script>

<div class="icon-wrapper" style="--size: {size}; --color: {color}">
  {@html cases[icon]}
</div>

<style>
  .icon-wrapper :global(svg path) {
    fill: var(--color);
    fill-opacity: 1;
  }

  .icon-wrapper :global(svg) {
    width: var(--size);
    height: var(--size);
  }
</style>
