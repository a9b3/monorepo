<script lang="ts">
  import type { Project, Track } from 'daw/core/ui'
  import {
    Text,
    Pill,
    Layout,
    ContextMenu,
    ClearEditableText,
    StereoMeter,
    Slider,
    Knob,
  } from 'src/components'
  import InstrumentSelect from './InstrumentSelect.svelte'
  import { editorStore, setInFocusElement, setInFocusTrack } from 'src/store'
  import { objectStyle } from 'src/utils'

  import ClipEmpty from './ClipEmpty.svelte'
  import Clip from './Clip.svelte'
  import ChannelControls from './ChannelControls.svelte'

  export let project: Project
  export let track: Track

  let mainElRef: HTMLElement
  let contextMenuRef: ContextMenu
  let clips = Array(8).fill({})

  $: currentTrack = track
  $: currentMidiClips = currentTrack.midiClips
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
    if (contextMenuRef) {
      contextMenuRef.openMenu(evt)
    }
  }}
  on:mousedown={() => {
    setInFocusTrack(track.id)
  }}
  draggable
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
  <div>
    {#each clips as _, idx}
      {#if currentMidiClips[$currentTrack.midiClipOrder[idx]]}
        <Clip
          {idx}
          trackLabel={$currentTrack.label}
          ticksPerBeat={project.controller.scheduler.ticksPerBeat}
          activeClipId={$currentTrack.activeMidiClip}
          addClip={$currentTrack.addMidiClip}
          clip={currentMidiClips[$currentTrack.midiClipOrder[idx]]}
          instrumentType={$currentTrack.instrumentType}
          instrument={$currentTrack.instrument}
          removeClip={$currentTrack.removeMidiClip}
          setActiveClip={$currentTrack.setActiveMidiClip}
        />
      {:else}
        <ClipEmpty
          {idx}
          addClip={$currentTrack.addMidiClip}
          setActiveClip={$currentTrack.setActiveMidiClip}
        />
      {/if}
    {/each}
  </div>

  <Layout class="bottom" type="col" padding="var(--spacing__padding)">
    <div class="instrumentSelect">
      <InstrumentSelect
        addInstrument={$currentTrack.addInstrument}
        instrument={$currentTrack.instrument}
        instrumentType={$currentTrack.instrumentType}
      />
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

    <ChannelControls channel={currentChannel} />
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
    margin-top: auto;
    font-size: 0.8em;
    padding: var(--spacing__paddingM);
    padding-bottom: var(--spacing__paddingM);
  }

  .main > :global(.bottom) > :global(*) {
    margin-bottom: var(--spacing__padding);
  }

  .instrumentSelect {
    height: 100px;
  }
</style>
