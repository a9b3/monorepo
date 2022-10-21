<!--
  @component

  Project toolbar, play controls, bpm, etc.
-->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import type { Project, Controller } from 'daw/core/project'
  import { Pill, Layout, Icon } from 'src/components'
  import { objectStyle } from 'src/utils'
  import { audioContext } from 'daw/audioContext'
  import { useDelta } from 'src/components/Knob/useDelta'

  export let project: Project

  let currentProject: Project
  let controller: Controller
  let elapsedBeats = 0
  let elapsedBars = 0

  const deltaDirective = useDelta(({ y }) => {
    const nextBpm = Math.floor($controller.bpm - y)
    $controller.setBpm(Math.max(0, Math.min(nextBpm, 200)))
  })

  function handleStop() {
    elapsedBeats = 0
    elapsedBars = 0
  }

  function handleTick({ currentTick }) {
    const currentBeat =
      Math.floor(currentTick / controller.scheduler.ticksPerBeat) % 4
    const currentBar = Math.floor(
      currentTick / (controller.scheduler.ticksPerBeat * 4)
    )
    if (currentBeat !== elapsedBeats) {
      elapsedBeats = currentBeat
    }
    if (currentBar !== elapsedBars) {
      elapsedBars = currentBar
    }
  }

  $: {
    if (currentProject !== project) {
      currentProject = project

      if (controller) {
        elapsedBeats = 0
        elapsedBars = 0
        controller.removeListener('stop', handleStop)
        controller.scheduler.removeListener('tick', handleTick)
      }

      if (currentProject) {
        controller = currentProject.controller

        controller.on('stop', handleStop)
        controller.scheduler.on('tick', handleTick)
      }
    }
  }

  onMount(() => {})
  onDestroy(() => {
    controller.removeListener('stop', handleStop)
    controller.scheduler.removeListener('tick', handleTick)
  })
</script>

<div class="main">
  <Layout class="left">
    <Pill title="Link" disabled />
    <Pill title="Tap" disabled />
    <div use:deltaDirective>
      <Pill
        title={String($controller.bpm) + ' bpm'}
        style={objectStyle({
          width: '80px',
        })}
      />
    </div>
    <Pill
      title={String($controller.beatsPerBeat) +
        ' / ' +
        String($controller.barsPerMeasure)}
    />
    <Pill
      title={$controller.isMetronomeActive ? 'On' : 'Off'}
      on:click={() => {
        $controller.setIsMetronomeActive()
      }}
    />
  </Layout>
  <Layout class="center">
    <Pill title="{elapsedBeats + 1}. {elapsedBars + 1}. 1" disabled />
    <Pill
      on:mousedown={() => {
        // browser requires user action to allow playback
        audioContext.resume()

        if ($currentProject.controller.isPlaying) {
          $currentProject.controller.stop()
        } else {
          $currentProject.controller.play()
        }
      }}><Icon type={$controller.isPlaying ? 'stop' : 'play'} /></Pill
    >
  </Layout>
  <div class="right">
    <Pill title="MIDI" disabled />
  </div>
</div>

<style>
  .main {
    padding: 0px var(--spacing__padding);
    width: 100%;
    height: 100%;
    background: var(--colors__bg);
    display: grid;
    grid-template:
      'left center right'
      / 1fr 1fr 1fr;
    align-items: center;
  }

  .main :global(.left) {
    grid-area: 'left';
    display: flex;
  }
  .main :global(.center) {
    grid-area: 'center';
    display: flex;
    justify-content: center;
  }
  .right {
    grid-area: 'right';
    display: flex;
    justify-content: flex-end;
  }
</style>
