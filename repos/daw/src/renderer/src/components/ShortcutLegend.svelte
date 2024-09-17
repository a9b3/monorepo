<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import shortcutManager from '@renderer/src/stores/shortcutManager'

  let show = false

  onMount(() => {
    $shortcutManager.manager.register({
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
    $shortcutManager.manager.pushActiveContext('shortcut-legend')
  })
</script>

{#if show}
  <div class="main">
    {#each Array.from($shortcutManager.manager.shortcuts) as [key, value]}
      <div>
        <h3>{value.title}</h3>
        <ul>
          {#each value.shortcuts as shortcut}
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
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 8px;
    background: white;
    border: var(--border);
    border-radius: 4px;
  }
</style>
