<script lang="ts">
  import {
    ClickSelection,
    IconButton,
    Icon,
    Text,
    Layout,
  } from 'src/components'
  import { dashboardStore } from 'src/store'
  import { objectStyle } from 'src/utils'

  const SortBy = {
    alphabetical: 'Alphabetical',
    lastModified: 'Last Modified',
  }
</script>

<div class={($$restProps.class || '') + ' main'} style={$$restProps.style}>
  <Layout align={'center'} class="sort" padding="10px">
    <div style={objectStyle({ width: '140px' })}>
      <ClickSelection
        options={Object.freeze([
          { key: 'alphabetical', label: 'Alphabetical' },
          { key: 'lastModified', label: 'Last Modified' },
        ])}
        selectedKeys={[$dashboardStore.sortBy]}
        onSelect={({ key }) => {
          $dashboardStore.sortBy = key
        }}
      >
        <Layout align={'center'}>
          <Text color={'fg2'}>Sort By:</Text>
          <div>{SortBy[$dashboardStore.sortBy]}</div>
        </Layout>
      </ClickSelection>
    </div>
    <div>
      <IconButton
        active={$dashboardStore.selectedView === 'grid'}
        on:click={() => {
          $dashboardStore.selectedView = 'grid'
        }}
      >
        <Icon type={'gridFill'} />
      </IconButton>
    </div>
    <div>
      <IconButton
        active={$dashboardStore.selectedView === 'line'}
        on:click={() => {
          $dashboardStore.selectedView = 'line'
        }}
      >
        <Icon type={'listCheck'} />
      </IconButton>
    </div>
  </Layout>
</div>

<style>
  .main {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  .main :global(.sort) {
    margin-left: auto;
  }
</style>
