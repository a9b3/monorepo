<script lang="ts">
  import { IconButton, Icon, Text, Layout } from 'src/components'
  import dashboardStore from 'src/store/dashboard'
</script>

<div class={($$restProps.class || '') + ' main'} style={$$restProps.style}>
  <Layout align={'center'} class="sort" padding="10px">
    <Layout align={'center'}>
      <Text color={'fg2'}>Sort By:</Text>
      <div>Latest</div>
    </Layout>
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
