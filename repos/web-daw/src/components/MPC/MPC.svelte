<script lang="ts">
  import { MPC } from 'src/daw/instruments/MPC'
  import { NOTES } from 'src/daw/instruments/constants'

  import Pad from './Pad.svelte'

  export let instrument: MPC

  const samples = Array(8).fill({})
</script>

<div class={($$restProps.class || '') + ' main'} style={$$restProps.style}>
  {#each samples as sample, idx}
    <div class="sample">
      <Pad
        handleUrl={async url => {
          const note = Object.keys(NOTES)[idx]
          const freq = NOTES[note][4]

          await instrument.addSoundSource(String(freq), { url: url })

          console.log(instrument)
        }}
      />
    </div>
  {/each}
</div>

<style>
  .main {
    background: var(--colors__bg);
    padding: 12px;
  }

  .sample {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 200px;
    height: 25px;
    margin-bottom: 10px;
    outline: 1px solid var(--colors__bg3);
    border-radius: 4px;
  }
</style>
