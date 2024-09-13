<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import shortcutManager from '@renderer/src/state/shortcutManager'

  let show = false

  onMount(() => {
    shortcutManager.register({
      context: 'shortcut-legend',
      title: 'Shortcut Legend',
      description: 'Shortcut legend for the application',
      shortcuts: [
        {
          key: 'meta+/',
          action: () => {
            show = !show
          }
        }
      ]
    })
    shortcutManager.pushActiveContext('shortcut-legend')
  })
</script>

{#if show}
  <div class="main">
    {#each Array.from(shortcutManager.shortcuts) as [key, value]}
      <div>
        <h3>{context.title}</h3>
        <ul>
          {#each context.shortcuts as shortcut}
            <li>
              <span>{shortcut.key}</span>
              <span>{shortcut.description}</span>
            </li>
          {/each}
        </ul>
      </div>
    {/each}
  </div>
{/if}

<style>
  .main {
    z-index: 2000;
    width: 100px;
    height: 100px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 8px;
    background: black;
    border: 1px solid black;
    border-radius: 4px;
  }
</style>
