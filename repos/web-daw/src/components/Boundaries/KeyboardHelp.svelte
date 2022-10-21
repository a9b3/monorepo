<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { Layout } from 'src/components'
  import type { KeyboardManager } from 'src/ui/keyboard/manager'

  export let keyboardManager: KeyboardManager
  let toDisplay = Object.entries(keyboardManager.combos).map(
    ([comboKey, combos]) => {
      return [comboKey, Object.values(combos)]
    }
  )

  onMount(() => {})
  onDestroy(() => {})
</script>

<div class="main">
  <Layout type="col" padding="20px">
    {#each toDisplay as comboKeyHandlers}
      <div class={'combo'}>
        <div>
          {comboKeyHandlers[0]
            .split('+')
            .map(token => (token === 'Meta' ? '⌘' : token))
            .join(' + ')}
        </div>
        <div>
          <Layout type="col">
            {#each comboKeyHandlers[1] as boundaryCombo}
              <div class="row">
                {boundaryCombo.description}
              </div>
            {/each}
          </Layout>
        </div>
      </div>
    {/each}
  </Layout>
</div>

<style>
  .main {
    background: hsl(
      var(--hsl__bottom-h),
      var(--hsl__bottom-s),
      var(--hsl__bottom-l),
      0.7
    );
    padding: 30px;
    border-radius: 4px;
  }

  .combo {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .row {
    margin-bottom: 10px;
  }
</style>
