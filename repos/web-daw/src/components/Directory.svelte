<script lang="ts">
  import SelectableRow from 'src/components/SelectableRow.svelte'
  import Icon from 'src/components/Icon.svelte'
  import DirectoryTree from 'src/components/DirectoryTree.svelte'
  import { objectStyle } from 'src/utils/objectToStyleStr'
  import editorStore, { setInFocusElement } from 'src/store/editor'

  export let depth = 0
  export let directory: any

  let isOpened = false
</script>

<div class={($$restProps.class || '') + ' main'} style={$$restProps.style}>
  <SelectableRow
    selected={$editorStore.inFocusElement === directory.id}
    on:click={() => {
      setInFocusElement(directory.id)
      isOpened = !isOpened
    }}
    style={objectStyle({
      padding: 'var(--spacing__paddingM)',
      paddingLeft: `calc(var(--spacing__padding) * ${depth})`,
    })}
  >
    <Icon type={isOpened ? 'arrowDownLine' : 'arrowRightLine'} />
    <Icon
      type="folderLine"
      style={objectStyle({
        marginRight: 'var(--spacing__padding)',
      })}
    />
    <div>
      {directory.name}
    </div>
  </SelectableRow>
  {#if isOpened}
    <DirectoryTree depth={depth + 1} files={directory.children} />
  {/if}
</div>

<style>
  .main {
    display: flex;
    flex-direction: column;
  }
</style>
