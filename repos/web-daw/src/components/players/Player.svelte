<script lang="ts">
  import { onMount } from 'svelte'

  export let instrumentType
  let players
  let playerKey

  onMount(async () => {
    const dynamicModules = import.meta.glob('src/assets/players/*.gif')
    const res = await Promise.all(Object.values(dynamicModules).map(im => im()))
    players = res.map(r => r.default)
    playerKey = Math.floor(Math.random() * players.length)
  })
</script>

<div class="main">
  <div class="title">
    {instrumentType}
  </div>
  <div class="player">
    {#if players && instrumentType}
      <img src={players[instrumentType === 'Sampler' ? 7 : 3]} alt={'gif'} />
    {/if}
  </div>
</div>

<style>
  .main {
    width: 100%;
    height: 100%;
  }
  img {
    max-height: 70px;
    max-width: 70px;
    margin: auto;
  }

  .title {
    width: 100%;
    text-align: center;
    font-weight: bold;
  }

  .player {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
