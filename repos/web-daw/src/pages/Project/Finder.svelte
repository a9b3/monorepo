<!--
  @component

  Top level finder.

  ex. Collections and Categories
-->
<script lang="ts">
  import { Layout, Icon, SelectableRow, LabeledSection } from 'src/components'
  import type { DawFile, DawDirectory } from 'src/store/files'

  export let selectedId: string | undefined
  export let sections: { label: string; rows: (DawFile | DawDirectory)[] }[]
  export let onSelect: (arg0: DawFile | DawDirectory) => void

  console.log(sections)
</script>

<div class="main">
  <Layout type="col" padding="20px">
    {#each sections as section}
      <LabeledSection label={section.label}>
        {#each section.rows as row}
          <SelectableRow
            class="row"
            selected={selectedId === row.id}
            on:mousedown={() => {
              onSelect(row)
            }}
          >
            <Icon class="icon" type={row.icon} />
            {row.name}
            ({row.children.length})
          </SelectableRow>
        {/each}
      </LabeledSection>
    {/each}
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
