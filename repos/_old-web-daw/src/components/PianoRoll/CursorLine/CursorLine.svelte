<!--
  @component

  Playback tracking line.
  Place as an immediate child of whatever element you want this to anchor to. It
  will calculate it's position based on parent width.
-->
<script lang="ts">
  import { currentProject } from 'src/store'
  import type { TickHandler } from 'daw/core/scheduler'

  export let numberOfBeats: number

  function createPositionSelf(numberOfBeats: number) {
    return function positionSelf(node: HTMLElement) {
      const tickHandler: TickHandler = ({ currentTick, ticksPerBeat }) => {
        const loopLength = numberOfBeats * ticksPerBeat
        const currentPosPercentage = (currentTick % loopLength) / loopLength

        if (node?.parentElement) {
          const cursorLeft =
            node.parentElement.offsetWidth * currentPosPercentage
          node.style.transform = `translateX(${cursorLeft}px)`
        }
      }

      function onstop() {
        node.style.left = `-2px`
      }
      $currentProject.controller.on('tick', tickHandler)
      $currentProject.controller.on('stop', onstop)

      return {
        destroy() {
          if ($currentProject) {
            $currentProject.controller.removeListener('tick', tickHandler)
            $currentProject.controller.removeListener('stop', onstop)
          }
        },
      }
    }
  }

  const positionSelf = createPositionSelf(numberOfBeats)
</script>

{#if $currentProject}
  {#key $currentProject.id}
    <div class="cursor" use:positionSelf />
  {/key}
{/if}

<style>
  .cursor {
    position: absolute;
    width: 2px;
    height: 100%;
    background: var(--colors__accent);
    z-index: 4;

    box-shadow: 0 -2px 6px 0px #fff;
  }
</style>
