<script lang="ts">
  import Text from 'src/components/Text.svelte'
  import Layout from 'src/components/Layout.svelte'
  import Icon from 'src/components/Icon.svelte'
  import SelectableRow from 'src/components/SelectableRow.svelte'
  import { objectStyle } from 'src/utils/objectToStyleStr'

  export let collections = [
    {
      name: 'Favorites',
    },
  ]
  export let categories = [
    {
      name: 'Sounds',
      icon: 'musicFill',
    },
    {
      name: 'Drums',
      icon: 'musicFill',
    },
    {
      name: 'Instruments',
      icon: 'musicFill',
    },
    {
      name: 'Audio Effects',
      icon: 'musicFill',
    },
    {
      name: 'MIDI Effects',
      icon: 'musicFill',
    },
    {
      name: 'Plug Ins',
      icon: 'musicFill',
    },
    {
      name: 'Clips',
      icon: 'musicFill',
    },
    {
      name: 'Samples',
      icon: 'musicFill',
    },
    {
      name: 'Grooves',
      icon: 'musicFill',
    },
    {
      name: 'Templates',
      icon: 'musicFill',
    },
  ]

  let selected = ''
</script>

<div class="main">
  <Layout type="col" padding="20px">
    <div>
      <Text style={objectStyle({ padding: 'var(--spacing__paddingM)' })}
        >Collections</Text
      >
      {#each collections as collection}
        <SelectableRow
          class="row"
          selected={selected === collection.name}
          on:click={() => {
            selected = selected === collection.name ? '' : collection.name
          }}
        >
          <Icon class="icon" type="heartFill" />
          {collection.name}
        </SelectableRow>
      {/each}
    </div>
    <div>
      <Text style={objectStyle({ padding: 'var(--spacing__paddingM)' })}
        >Categories</Text
      >
      {#each categories as category}
        <SelectableRow
          class="row"
          selected={selected === category.name}
          on:click={() => {
            selected = selected === category.name ? '' : category.name
          }}
        >
          <Icon class="icon" type={category.icon} />
          {category.name}
        </SelectableRow>
      {/each}
    </div>
  </Layout>
</div>

<style>
  .main {
    height: 100%;
    width: 100%;
  }

  .main :global(.row) {
    display: flex;
    padding: var(--spacing__paddingM) var(--spacing__paddingM);
    align-items: center;
    width: 100%;
  }

  .main :global(.row) > :global(.icon) {
    margin-right: var(--spacing__padding);
  }
</style>
