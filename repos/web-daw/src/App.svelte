<script lang="ts">
  import { Router, Route } from 'svelte-routing'
  import LoadCSSVars from './lib/web-core-styles/LoadCSSVars.svelte'
  import Dashboard from './components/Dashboard.svelte'

  export let url = ''
</script>

<main>
  <LoadCSSVars />
  <Router {url}>
    <Route path="/"><Dashboard /></Route>
  </Router>
</main>

<style>
</style>
