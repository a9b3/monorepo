<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import Boundary from './Boundary.svelte'
  import { BOUNDARY_KEY } from 'src/ui/keyboard/manager'
  import type { ComboHandler } from 'src/ui/keyboard/manager'
  import { keyboardStore } from 'src/store'

  export let key: string
  export let comboHandler: { [comboKey: string]: ComboHandler }
  let boundaryEl: HTMLElement
  let path: string[]

  onMount(() => {
    path = keyboardStore.boundaryManager
      .getEventBoundaryParents(boundaryEl)
      .map(boundary => boundary.key)

    Object.entries(comboHandler).forEach(([comboKey, comboHandlerTree]) => {
      keyboardStore.attach(
        comboKey,
        { ...comboHandlerTree, boundaryKey: key },
        [...path, key]
      )
    })
    console.log(`mounting`, path)
  })
  onDestroy(() => {
    console.log(`unmounting`, path)
    Object.entries(comboHandler).forEach(([comboKey]) => {
      keyboardStore.detach(comboKey, [...path, key])
    })
  })
</script>

<Boundary rootKey={BOUNDARY_KEY} {key} bind:boundaryEl />
