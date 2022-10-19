<script lang="ts">
  import type { Channel } from 'daw/core'
  import { StereoMeter, Slider, Knob, Layout } from 'src/components'
  import ChannelButton from './ChannelButton.svelte'
  import { LED } from 'src/components'
  import Frequency from 'src/components/Meter/Frequency.svelte'

  export let channel: Channel
</script>

<div class="freq">
  <Frequency analyser={$channel.analyser} />
</div>
<Layout height="100px">
  <div class="inner">
    <StereoMeter analyser={$channel.analyser} />
  </div>

  <Slider
    value={$channel.percentGain}
    onChange={val => $channel.setGain(val)}
  />

  <Layout type="col" padding={'8px'} align="center">
    <LED color={$channel.isRecord ? 'red' : $channel.isMute ? 'bg' : 'green'} />

    <Layout type="row" padding={'2px'}>
      <ChannelButton
        active={$channel.isSolo}
        on:mousedown={() => {
          $channel.setIsSolo()
        }}>S</ChannelButton
      >
      <ChannelButton
        active={$channel.isMute}
        color="var(--colors__bg)"
        on:mousedown={() => {
          $channel.setIsMute()
        }}>M</ChannelButton
      >
      <ChannelButton
        active={$channel.isRecord}
        on:mousedown={() => {
          $channel.setIsRecord()
        }}>R</ChannelButton
      >
    </Layout>
    <Knob
      value={$channel.panPosition}
      setValue={val => $channel.setPanPosition(val)}
    />
  </Layout>
</Layout>

<style>
  .main {
    height: 100px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
  }

  .inner {
    width: 15px;
    display: flex;
    flex-direction: row;
  }

  .freq {
    width: 100%;
    height: 30px;
  }
</style>
