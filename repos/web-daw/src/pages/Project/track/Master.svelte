<script lang="ts">
  import Text from 'src/components/Text.svelte'
  import Pill from 'src/components/Pill.svelte'
  import Layout from 'src/components/Layout.svelte'
  import editorStore, { setInFocusElement } from 'src/store/editor'
  import type { Channel } from 'src/daw/Channel'
  import { objectStyle } from 'src/utils/objectToStyleStr'
  import StereoMeter from 'src/components/Meter/StereoMeter.svelte'

  // Color of the track header
  export let color = 'var(--colors__bg)'
  export let channel: Channel
</script>

<div
  class="main"
  class:selected={channel.id === $editorStore.inFocusElement}
  style={objectStyle({
    '--color': color,
  })}
  on:click={() => setInFocusElement(channel.id)}
>
  <div class="title">Master</div>

  <Layout class="bottom" type="col" padding="var(--spacing__padding)">
    <Layout class="section" type="col">
      <Text type="label">Master Out</Text>
      <Pill title="1/2" align="left" compact />
    </Layout>

    <div
      style={objectStyle({
        height: '100px',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
      })}
    >
      <div
        style={objectStyle({
          width: '15px',
        })}
      >
        <StereoMeter analyser={channel.analyser} />
      </div>
    </div>
  </Layout>
</div>

<style>
  .main {
    height: '100%';
    background: var(--colors__bg2);
    width: var(--track__width);
    border-radius: var(--misc__borderRadius);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .selected {
    outline: 2px solid var(--colors__accent);
  }

  .title {
    padding: var(--spacing__paddingM) calc(var(--spacing__paddingSm) * 2);
    background: var(--color);
  }

  .main > :global(.bottom) {
    font-size: 10px;
    margin-top: auto;
    padding: var(--spacing__paddingM);
    padding-bottom: var(--spacing__paddingM);
  }

  .main > :global(.bottom) > :global(*) {
    margin-bottom: var(--spacing__padding);
  }
</style>
