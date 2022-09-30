<script lang="ts">
  import { Router, Route } from 'svelte-routing'
  import Header from '@monorepo/orgs/examples/svelte-app/src/lib/Header.svelte'
  import CaseManagement from '@monorepo/orgs/examples/svelte-app/src/lib/CaseManagement/Page.svelte'
  import { style, styleToSvelte } from './styles'

  export let url = ''
</script>

<main style={styleToSvelte(style)}>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;600&display=swap"
    rel="stylesheet"
  />

  <Header title="Sam Lau" />

  <Router {url}>
    <Route path="/" component={CaseManagement} />
  </Router>
</main>

<style>
  main > :global(*) {
    font-family: var(--fontFamily);
    font-size: 16px;
  }
</style>
