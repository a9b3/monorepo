<script lang="ts">
  import { onMount } from 'svelte'

  let players
  let random

  onMount(async () => {
    const dynamicModules = import.meta.glob('src/assets/players/*.gif')
    const res = await Promise.all(Object.values(dynamicModules).map(im => im()))
    players = res.map(r => r.default)
    random = Math.floor(Math.random() * players.length)
  })
</script>

<div class="main">
  {#if random}
    <img src={players[random]} alt={'gif'} />
  {/if}
</div>

<style>
  .main {
    width: 30px;
  }
  img {
    max-height: 70px;
    max-width: 70px;
    margin-right: 20px;
  }
</style>
