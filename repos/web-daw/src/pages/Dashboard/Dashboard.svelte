<script lang="ts">
  import { Router, Route, Link, navigate } from 'svelte-routing'
  import { objectStyle } from 'src/utils/objectToStyleStr'
  import Recent from './Recent/Recent.svelte'
  import url from 'src/store/url'
  import RouteRedirect from 'src/components/RouteRedirect.svelte'

  let routerUrl = ''
</script>

<div class={($$restProps.class || '') + ' main'} style={$$restProps.style}>
  <Router {routerUrl}>
    <div class="left">
      <Link to="/recent">
        <div class="row" class:active={$url.pathname === '/recent'}>Recent</div>
      </Link>
      <div
        style={objectStyle({
          borderBottom: '1px solid var(--colors__bg3)',
          margin: '0 20px',
        })}
      />
      <div class="row">Favorites</div>
      <div
        style={objectStyle({
          borderBottom: '1px solid var(--colors__bg3)',
          margin: '0 20px',
        })}
      />
      <div class="row">Teams</div>
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
    background: var(--colors__accent);
  }
  .projects {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
</style>
