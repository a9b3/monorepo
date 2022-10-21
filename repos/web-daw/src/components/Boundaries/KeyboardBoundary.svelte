<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import Boundary from './Boundary.svelte'
  import { BOUNDARY_KEY } from 'src/ui/keyboard/manager'
  import type { ComboHandler } from 'src/ui/keyboard/manager'
  import { keyboardStore } from 'src/store'

  export let key: string
  export let comboHandler: { [comboKey: string]: ComboHandler }

  onMount(() => {
    Object.entries(comboHandler).forEach(([comboKey, comboHandler]) => {
      keyboardStore.attach(comboKey, comboHandler, key)
    })
  })
  onDestroy(() => {
    Object.keys(comboHandler).forEach(comboKey => {
      keyboardStore.detach(comboKey, key)
    })
  })
</script>

<Boundary rootKey={BOUNDARY_KEY} {key} />
