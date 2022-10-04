<script lang="ts">
  import { Router, Route } from 'svelte-routing'
  import Project from 'src/pages/Project.svelte'
  import Dashboard from 'src/pages/Dashboard.svelte'
  import Theme from 'src/components/Theme.svelte'
  import TabBar from 'src/components/TabBar.svelte'
  import userStore from 'src/store/user'
  import { fetchEditor } from 'src/store/editor'

  export let url = ''

  fetchEditor($userStore.id)
</script>

<div class="shell">
  <Theme />
  <Router {url}>
    <div class="nav">
      <TabBar />
    </div>
    <div class="content">
      <Route path="/project/:id" let:params>
        <Project {params} />
      </Route>
      <Route path="/" component={Dashboard} />
    </div>
  </Router>
</div>

<style>
  .shell {
    font-family: var(--font__family);
    font-size: var(--font__size);
    color: var(--font__color);
    font-weight: var(--font__weight);
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    display: grid;
    position: relative;
    grid-template:
      'nav' 40px
      'content' 1fr
      / 1fr;
    background: var(--colors__bg3);
  }

  .nav {
    grid-area: nav;
  }

  .content {
    grid-area: content;
    height: 100%;
    width: 100%;
    overflow: auto;
  }
</style>
