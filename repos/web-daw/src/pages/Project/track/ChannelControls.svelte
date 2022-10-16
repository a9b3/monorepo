<script lang="ts">
  import type { Channel } from 'daw/core'
  import { StereoMeter, Slider, Knob } from 'src/components'
  import { objectStyle } from 'src/utils'

  export let channel: Channel
</script>

<div class="main">
  <div class="inner">
    <StereoMeter analyser={$channel.analyser} />
  </div>
  <div style={objectStyle({ width: '5px' })} />
  <Slider value={$channel.gain} onChange={val => $channel.setGain(val)} />
  <Knob
    value={$channel.panPosition}
    setValue={val => $channel.setPanPosition(val)}
  />
</div>

<style>
  .main {
    height: 100px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
  .inner {
    width: 15px;
    display: flex;
    flex-direction: row;
  }
</style>
