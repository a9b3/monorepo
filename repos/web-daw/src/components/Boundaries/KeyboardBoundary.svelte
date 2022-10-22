<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import Boundary from './Boundary.svelte'
  import { BOUNDARY_KEY } from 'src/ui/keyboard/manager'
  import type { ComboHandler } from 'src/ui/keyboard/manager'
  import { keyboardStore } from 'src/store'

  export let comboHandler: { [comboKey: string]: ComboHandler }
  let boundaryId = crypto.randomUUID()

  onMount(() => {
    Object.entries(comboHandler).forEach(([comboKey, comboHandler]) => {
      keyboardStore.attach(comboKey, comboHandler, boundaryId)
    })
  })
  onDestroy(() => {
    Object.keys(comboHandler).forEach(comboKey => {
      keyboardStore.detach(comboKey, boundaryId)
    })
  })
</script>

<Boundary rootKey={BOUNDARY_KEY} key={boundaryId} />
