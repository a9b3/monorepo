<script lang="ts">
  import { Router, Route, Link } from 'svelte-routing'
  import { RouteRedirect, Linebreak } from 'src/components'
  import Recent from './Recent/Recent.svelte'
  import url from 'src/store/url'

  let routerUrl = ''
</script>

<div class={($$restProps.class || '') + ' main'} style={$$restProps.style}>
  <Router url={routerUrl}>
    <div class="left">
      <Link to="/recent">
        <div class="row" class:active={$url.pathname === '/recent'}>Recent</div>
      </Link>
      <Linebreak />
      <div class="row disabled">Favorites</div>
      <Linebreak />
      <div class="row disabled">Teams</div>
    </div>
    <div class="content">
      <Route path="/recent" component={Recent} />
    </div>
    <RouteRedirect path="/" to="recent" />
  </Router>
</div>

<style>
  .main {
    height: 100%;
    width: 100%;
    overflow: hidden;
    display: grid;
    grid-template:
      'left main' 1fr
      / auto 1fr;
    background: var(--colors__bg3);
  }

  .left {
    width: 250px;
    grid-area: left;
    background: var(--colors__bg);
  }
  .content {
    grid-area: main;
    padding: var(--spacing__padding);
    overflow: auto;
  }

  .row {
    height: 50px;
    display: flex;
    align-items: center;
    padding: 0 20px;
  }

  .row:hover {
    background-color: var(--colors__bgHover);
  }
  .row.active {
    font-weight: bold;
  }

  .row.disabled {
    color: var(--colors__fg3);
  }
  .row.disabled:hover {
    background-color: inherit;
  }

  .projects {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
</style>
