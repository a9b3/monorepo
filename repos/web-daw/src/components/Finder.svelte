<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import Icon from 'src/lib/web-core-styles/Icon.svelte'
  import Text from 'src/lib/web-core-styles/Text.svelte'
  import Row from 'src/lib/web-core-styles/Row.svelte'
  import Input from 'src/lib/web-core-styles/Input.svelte'

  // -------------------------------------------------------------------------
  // Props
  // -------------------------------------------------------------------------

  // -------------------------------------------------------------------------
  // Internal
  // -------------------------------------------------------------------------

  onMount(() => {})
  onDestroy(() => {})
</script>

<div class="main">
  <div style="width:40em;">
    <div
      style="padding: var(--pv_spacing_1) var(--pv_spacing_2); margin-bottom:
      var(--pv_spacing_1); margin-top: var(--pv_spacing_3)"
    >
      <Input type="text" />
    </div>
    <Row leftIcon="folder" text="hello" rightIcon="down" />
    <Row leftIcon="folder" text="hello" />
    <Row leftIcon="folder" text="hello" />
    <Row leftIcon="folder" text="hello" />
    <Row leftIcon="folder" text="hello" />
    <Row leftIcon="folder" text="hello" />
    <Row leftIcon="folder" text="hello" />
    <Row leftIcon="folder" text="hello" />
    <Row leftIcon="folder" text="hello" />
    <Row leftIcon="folder" text="hello" />
  </div>
</div>

<style>
  .main {
  }
</style>
