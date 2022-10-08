<script lang="ts">
  import { IconButton, Icon, Text, Layout } from 'src/components'
</script>

<div class={($$restProps.class || '') + ' main'} style={$$restProps.style}>
  <Text color={'fg2'}>Filter:</Text>

  <Layout align={'center'} class="sort" padding="10px">
    <Layout align={'center'}>
      <Text color={'fg2'}>Sort By:</Text>
      <div>Latest</div>
    </Layout>
    <div>
      <IconButton>
        <Icon type={'arrowDownFill'} />
      </IconButton>
    </div>
    <div>
      <IconButton>
        <Icon type={'arrowDownFill'} />
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
