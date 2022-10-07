<script lang="ts">
  import type { MPC } from 'src/daw/instruments/MPC'
  import { getFrequencyFromIdx } from 'src/daw/instruments/constants'

  import Pad from './Pad.svelte'

  export let instrument: MPC

  const samples = Array(8).fill({})
</script>

<div class={($$restProps.class || '') + ' main'} style={$$restProps.style}>
  {#each samples as sample, idx}
    <div class="sample">
      <Pad
        sample={$instrument.samples[getFrequencyFromIdx(idx)]}
        handleUrl={async arg => {
          const freq = getFrequencyFromIdx(idx)
          await $instrument.addSoundSource(String(freq), {
            url: arg.metadata.url,
            name: arg.name,
          })
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
