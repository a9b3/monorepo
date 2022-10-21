<script lang="ts">
  import Boundary from './Boundary.svelte'
  import { BOUNDARY_KEY } from 'src/ui/contextMenu/manager'

  export let key: string
</script>

<Boundary rootKey={BOUNDARY_KEY} {key} />
