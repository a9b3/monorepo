<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import type { Analyser } from 'daw/core/customNodes'
  import { rafInterval } from 'src/utils'

  import Meter from './Meter.svelte'

  export let analyser: Analyser

  let rms = [0, 0]
  let peak = [0.0]
  let cancelRafInterval: () => void

  function update() {
    rms = analyser.getRms().map(rms => rms * 80)
    peak = analyser.getPeaks().map(peak => peak * 50)
    const stereoFreq = analyser.getFloatFrequencyData()
    // Both arrays should be the same length using frequencyBinCount
    // for (let i = 0; i < stereoFreq[0].length; i += 1) {
    //   if (stereoFreq[0] > 1 || stereoFreq[1] > 1) {
    //     console.log(`clipped`)
    //   }
    // }
  }

  onMount(() => {
    cancelRafInterval = rafInterval(update)
  })
  onDestroy(() => {
    cancelRafInterval()
  })
</script>

<div class={($$restProps.class || '') + ' main'} style={$$restProps.style}>
  <Meter value={rms[0]} secondaryValue={peak[0]} />
  <div class="divider" />
  <Meter value={rms[1]} secondaryValue={peak[1]} />
</div>

<style>
  .main {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
  }
  .divider {
    width: 5px;
  }
</style>
