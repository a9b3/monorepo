<script lang="ts">
  import { navigate } from 'svelte-routing'
  import { url } from 'src/store/url'
  export let path: string
  export let to: string

  $: {
    if ($url.pathname === path) {
      setTimeout(() => navigate(to, { replace: true }), 0)
    }
  }
</script>
