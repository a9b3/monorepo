<script lang="ts">
  import type { Project } from 'src/daw/Project'
  import type { Track } from 'src/daw/Track'
  import {
    Text,
    Pill,
    Layout,
    ContextMenu,
    ClearEditableText,
    StereoMeter,
    Player,
  } from 'src/components'
  import editorStore, {
    setInFocusElement,
    setInFocusTrack,
  } from 'src/store/editor'
  import { objectStyle } from 'src/utils/objectToStyleStr'

  import Clip from './Clip.svelte'

  export let project: Project
  export let track: Track

  let mainElRef: HTMLElement
  let contextMenuRef: ContextMenu
  let clips = Array(8).fill({})

  $: currentTrack = track
  $: currentChannel = $project.mixer.channels[currentTrack.channelId]
</script>

<div
  bind:this={mainElRef}
  class="main"
  class:selected={track.id === $editorStore.inFocusTrack}
  style={objectStyle({
    '--color': track.color,
  })}
  on:contextmenu|preventDefault={evt => {
    setInFocusElement(track.id)
    contextMenuRef.handleRightClick(evt)
  }}
  on:mousedown={evt => {
    setInFocusTrack(track.id)
  }}
>
  <ContextMenu
    bind:this={contextMenuRef}
    menu={[
      {
        label: 'Delete Track',
        onClick: () => {
          project.removeTrack(track.id)
          setInFocusElement()
        },
        type: 'item',
      },
    ]}
  />
  <div
    class="title"
    on:click={() => {
      track.setColor('var(--colors__accent)')
    }}
  >
    <ClearEditableText
      value={track.label}
      handleInput={evt => track.setLabel(evt.target.value)}
    />
  </div>
  {#each clips as _, idx}
    <Clip {idx} clipTrack={track.clipTrack} instrument={track.instrument} />
  {/each}

  <Layout class="bottom" type="col" padding="var(--spacing__padding)">
    <div
      style={objectStyle({
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        paddingRight: '30px',
      })}
    >
      <Player />
    </div>
    <Layout class="section" type="col">
      <Text type="label">MIDI From</Text>
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
        <StereoMeter analyser={currentChannel.analyser} />
      </div>
    </div>
  </Layout>
</div>

<style>
  .main {
    --color: var(--colors__accent);
    /* --misc__borderRadius: var(--misc__borderRadius); */

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
    margin-top: auto;
    font-size: 0.8em;
    padding: var(--spacing__paddingM);
    padding-bottom: var(--spacing__paddingM);
  }

  .main > :global(.bottom) > :global(*) {
    margin-bottom: var(--spacing__padding);
  }
</style>
