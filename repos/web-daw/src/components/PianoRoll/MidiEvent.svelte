<script lang="ts">
  import { createSelectable, selectorStore } from '../Selector/selectorStore'
  export let numberOfBeats: number
  export let midiEvent: { id: string; startTick: number; endTick: number }
  export let ticksPerBeat: number

  let el: HTMLElement

  $: selectableDirective = createSelectable(midiEvent.id)

  function positionEvent(node: HTMLElement) {
    const totalLength = numberOfBeats * ticksPerBeat
    const widthPercentage =
      ((midiEvent.endTick - midiEvent.startTick) / totalLength) * 100
    node.style.width = `${widthPercentage}%`

    const left = (midiEvent.startTick / totalLength) * 100
    node.style.left = `${left}%`

    return {
      destroy() {},
    }
  }
  // afterUpdate(() => {
  //   if (el) {
  //     const totalLength = numberOfBeats * ticksPerBeat
  //     const widthPercentage =
  //       ((midiEvent.endTick - midiEvent.startTick) / totalLength) * 100
  //     console.log(`HERERERERE`, widthPercentage, midiEvent)
  //     el.style.width = `${widthPercentage}%`
  //
  //     const left = (midiEvent.startTick / totalLength) * 100
  //     el.style.left = `${left}%`
  //   }
  // })
</script>

{#if midiEvent?.endTick}
  {#key midiEvent.id}
    <div
      class="midievent"
      class:selected={$selectorStore.selected[midiEvent.id]}
      bind:this={el}
      use:positionEvent
      use:selectableDirective
    >
      <slot />
    </div>
  {/key}
{/if}

<style>
  .midievent {
    position: absolute;
    border-radius: 4px;
    height: 100%;
    background: var(--colors__neonPink);
  }

  .midievent.selected {
    background: var(--colors__accent);
  }
</style>
