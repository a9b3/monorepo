<script lang="ts">
  import Text from 'src/components/Text.svelte'
  import Pill from 'src/components/Pill.svelte'
  import Layout from 'src/components/Layout.svelte'
  import editorStore, { setInFocusElement } from 'src/store/editor'
  import { objectStyle } from 'src/utils/objectToStyleStr'

  export let color = 'var(--colors__bg)'
  export let trackId: string
  export let title = 'Send'
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
    />
  </Layout>
</div>

<style>
  .main {
    --color: var(--colors__accent);

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
