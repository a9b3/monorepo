<script lang="ts">
  import type { DawFile, DawDirectory } from 'src/store/files'
  import { objectStyle } from 'src/utils/objectToStyleStr'
  import Icon from 'src/components/Icon.svelte'
  import SelectableRow from 'src/components/SelectableRow.svelte'
  import Directory from 'src/components/Directory.svelte'
  import editorStore, { setInFocusElement } from 'src/store/editor'
  import { createDragSource } from 'src/components/draggable'

  export let depth = 0
  export let files: (DawFile | DawDirectory)[]
</script>

<div class="main">
  {#each files as item}
    {#if item.type === 'directory'}
      <Directory {depth} directory={item} />
    {/if}
    {#if item.type === 'file'}
      <SelectableRow
        dragSource={createDragSource(item)}
        selected={$editorStore.inFocusElement === item.id}
        on:mousedown={() => setInFocusElement(item.id)}
        style={objectStyle({
          padding: 'var(--spacing__paddingM)',
          paddingLeft: `calc(var(--spacing__padding) * ${depth})`,
        })}
      >
        <Icon type="empty" />
        <Icon
          type="fileLine"
          style={objectStyle({
            marginRight: 'var(--spacing__padding)',
          })}
        />
        <div>
          {item.name}
        </div>
      </SelectableRow>
    {/if}
    {#if item.type === 'instrument'}
      <SelectableRow
        dragSource={createDragSource(item)}
        selected={$editorStore.inFocusElement === item.id}
        on:mousedown={() => setInFocusElement(item.id)}
        style={objectStyle({
          padding: 'var(--spacing__paddingM)',
          paddingLeft: `calc(var(--spacing__padding) * ${depth})`,
        })}
      >
        <Icon type="empty" />
        <Icon
          type={'musicFill'}
          style={objectStyle({
            marginRight: 'var(--spacing__padding)',
          })}
        />
        <div>
          {item.name}
        </div>
      </SelectableRow>
    {/if}
  {/each}
</div>

<style>
</style>
