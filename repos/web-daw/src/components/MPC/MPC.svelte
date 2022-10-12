<script lang="ts">
  import type { Sampler } from 'daw/core/instruments'

  import Pad from './Pad.svelte'

  export let instrument: Sampler

  const samples = Array(8).fill({})
</script>

<div class={($$restProps.class || '') + ' main'} style={$$restProps.style}>
  {#each samples as sample, idx}
    <div class="sample">
      <Pad
        sample={$instrument.samples[60 + idx]}
        handleUrl={async arg => {
          await $instrument.addSoundSource(String(60 + idx), {
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
    width: 120px;
    height: 25px;
    margin-bottom: 10px;
    outline: 1px solid var(--colors__bg3);
    border-radius: 4px;
  }
</style>
