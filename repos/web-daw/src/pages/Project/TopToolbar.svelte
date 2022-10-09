<script lang="ts">
  import { onDestroy } from 'svelte'
  import type { Project } from 'src/daw/Project'
  import type { Controller } from 'src/daw/Controller'
  import Pill from 'src/components/Pill.svelte'
  import Layout from 'src/components/Layout.svelte'
  import Icon from 'src/components/Icon.svelte'
  import { audioContext } from 'src/daw/audioContext'
  import { useDelta } from 'src/components/Knob/useDelta'
  import { objectStyle } from 'src/utils/objectToStyleStr'

  export let project: Project
  let currentProject: Project
  let controller: Controller
  let elapsedBeats = 0
  let elapsedBars = 0

  const deltaDirective = useDelta(
    delta => {
      const nextBpm = Math.floor($controller.bpm + delta * 100)
      $controller.setBpm(nextBpm <= 0 ? 0 : nextBpm)
    },
    { pxRange: 200 }
  )

  function handleStart() {}
  function handleStop() {
    elapsedBeats = 0
    elapsedBars = 0
  }
  function handleTick(args) {
    const currentBeat = Math.floor(args.currentTick / args.ticksPerBeat) % 4
    const currentBar = Math.floor(args.currentTick / (args.ticksPerBeat * 4))
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
        controller.removeListener('start', handleStart)
        controller.removeListener('stop', handleStop)
        controller.removeListener('tick', handleTick)
      }

      if (currentProject) {
        controller = currentProject.controller

        controller.on('start', handleStart)
        controller.on('stop', handleStop)
        controller.on('tick', handleTick)
      }
    }
  }

  onDestroy(() => {
    controller.removeListener('start', handleStart)
    controller.removeListener('stop', handleStop)
    controller.removeListener('tick', handleTick)
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
      title={String($currentProject.timeSignature.top) +
        ' / ' +
        String($currentProject.timeSignature.bottom)}
    />
    <Pill
      title={$controller.isMetronomeActive ? 'On' : 'Off'}
      on:click={() => {
        $controller.toggleMetronome()
      }}
    />
    <Pill title="1 Bar" />
  </Layout>
  <Layout class="center">
    <Pill title="{elapsedBeats + 1}. {elapsedBars + 1}. 1" disabled />
    <Pill
      on:click={() => {
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
    <Pill title="MIDI" />
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
