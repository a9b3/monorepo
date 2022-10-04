<script lang="ts">
  import Text from 'src/components/Text.svelte'
  import Pill from 'src/components/Pill.svelte'
  import Layout from 'src/components/Layout.svelte'
  import Icon from 'src/components/Icon.svelte'
  import Meter from 'src/components/Meter.svelte'
  import editorStore, { setInFocusElement } from 'src/store/editor'
  import { objectStyle } from 'src/utils/objectToStyleStr'
  export let color = 'var(--colors__bg)'
  export let trackId: any
  export let title = 'Send'

  let values = {
    value: 0,
    secondary: 0,
  }
  let values2 = {
    value: 0,
    secondary: 0,
  }
  setInterval(() => {
    values = {
      value: Math.random() * 100,
      secondary: Math.random() * 100,
    }
    values2 = {
      value: Math.random() * 100,
      secondary: Math.random() * 100,
    }
  }, 100)
</script>

<div
  class="main"
  class:selected={trackId === $editorStore.inFocusElement}
  style={objectStyle({
    '--color': color,
  })}
  on:click={() => setInFocusElement(trackId)}
>
  <div class="title">{title}</div>

  <Layout class="bottom" type="col" padding="var(--spacing__padding)">
    <Layout class="section" type="col">
      <Text type="label">Audio To</Text>
      <Pill title="master" align="left" compact />
    </Layout>

    <div
      style={objectStyle({
        height: '100px',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
      })}
    >
      <Meter
        value={values.value}
        secondaryValue={values.secondary}
        style={objectStyle({ width: '5px' })}
      />
      <div style={objectStyle({ width: '5px' })} />
      <Meter
        value={values2.value}
        secondaryValue={values2.secondary}
        style={objectStyle({ width: '5px' })}
      />
    </div>
  </Layout>
</div>

<style>
  .main {
    --color: var(--colors__accent);
    height: '100%';
    background: var(--colors__bg2);
    width: var(--track__width);
    border-radius: 4px;
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
