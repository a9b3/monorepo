<script lang="ts">
  import Window from 'src/components/window/Window.svelte'
  import MPC from 'src/components/MPC/MPC.svelte'
  import type { MPC as MPCClass } from 'src/daw/instruments/MPC'

  export let instrument: MPCClass
  let showWindow = false
</script>

<div class={($$restProps.class || '') + ' main'} style={$$restProps.style}>
  <div
    on:click={() => {
      showWindow = !showWindow
    }}
  >
    Instrument
  </div>

  <Window {showWindow} title="MPC">
    <MPC {instrument} />
  </Window>
</div>

<style>
  .main {
  }
</style>
