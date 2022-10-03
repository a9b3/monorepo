<script lang="ts">
  import Text from 'src/components/Text.svelte'
  import Pill from 'src/components/Pill.svelte'
  import Clip from 'src/components/Clip.svelte'
  import Layout from 'src/components/Layout.svelte'
  import Icon from 'src/components/Icon.svelte'
  import ContextMenu from 'src/components/ContextMenu.svelte'
  import { removeClipTrack } from 'src/state/project'
  import editorState, { setSelected } from 'src/state/editorState'
  export let track
  export let idx
  export let title = 'Midi'
  export let clips = Array(8).fill({})

  let contextMenuRef
</script>

<div
  class="main"
  class:selected={track.id === $editorState.selected}
  on:contextmenu|preventDefault={evt => {
    setSelected(track.id)
    contextMenuRef.handleRightClick(evt)
  }}
  on:click={() => setSelected(track.id)}
>
  <ContextMenu
    bind:this={contextMenuRef}
    menu={[
      {
        label: 'Delete Track',
        onClick: () => {
          removeClipTrack(idx)
          setSelected('')
        },
        type: 'item',
      },
    ]}
  />
  <div class="title">
    {idx + 1}
    {title}
  </div>
  {#each clips as clip}
    <Clip />
  {/each}

  <Layout class="bottom" type="col" padding="var(--spacing__padding)">
    <Layout class="section" type="col">
      <Text type="label">
        <Icon type="searchLine" />
        MIDI From</Text
      >
      <Pill title="All ins" align="left" compact />
      <Pill title="All Channels" align="left" compact />
    </Layout>
    <Layout class="section" type="col">
      <Text type="label">Monitor</Text>
      <Layout type="row">
        <Pill title="In" align="center" compact />
        <Pill title="Out" align="center" compact />
        <Pill title="Off" align="center" compact />
      </Layout>
    </Layout>
    <Layout class="section" type="col">
      <Text type="label">MIDI To</Text>
      <Pill title="No Output" align="left" compact />
      <Pill align="left" compact />
    </Layout>
  </Layout>
</div>

<style>
  .main {
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
    background: var(--colors__accent);
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
