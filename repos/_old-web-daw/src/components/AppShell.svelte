<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { Router, Route } from 'svelte-routing'
  import Project from 'src/pages/Project/Project.svelte'
  import Dashboard from 'src/pages/Dashboard/Dashboard.svelte'
  import { Theme, TabBar } from 'src/components'
  import userStore from 'src/store/user'
  import { fetchEditor } from 'src/store/editor'
  import { mousePosition, KeyboardManager } from 'src/ui'
  import { keyboardStore } from 'src/store'

  export let url = ''

  let ready = false

  onMount(async () => {
    mousePosition.observeMousePosition()
    await fetchEditor($userStore.id)
    ready = true
    keyboardStore.start()
  })
  onDestroy(() => {
    mousePosition.unobserveMousePosition()
    keyboardStore.stop()
  })
</script>

{#if ready}
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
        <Route path="/*" component={Dashboard} />
      </div>
    </Router>
  </div>
{/if}

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
      'nav' 30px
      'content' 1fr
      / 1fr;
    background: var(--colors__bg3);
    opacity: 0;
    animation: fadein 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  @keyframes fadein {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
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
