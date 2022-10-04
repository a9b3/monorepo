<script lang="ts">
  import { objectStyle } from 'src/utils/objectToStyleStr'
  import Layout from 'src/components/Layout.svelte'
  import Icon from 'src/components/Icon.svelte'
  import SelectableRow from 'src/components/SelectableRow.svelte'
  import Directory from 'src/components/Directory.svelte'
  import editorStore, { setInFocusElement } from 'src/store/editor'

  export let depth = 0
  export let files = [
    {
      id: crypto.randomUUID(),
      name: 'Delays & Loops',
      type: 'directory',
      children: [
        {
          id: crypto.randomUUID(),
          name: '808s',
          type: 'directory',
          children: [
            {
              id: crypto.randomUUID(),
              name: 'Delays & Loops',
              type: 'directory',
              children: [
                {
                  id: crypto.randomUUID(),
                  name: '808s',
                  type: 'directory',
                  children: [],
                },
                {
                  id: crypto.randomUUID(),
                  name: 'Cool Stuff',
                  type: 'file',
                },
              ],
            },
          ],
        },
        {
          id: crypto.randomUUID(),
          name: 'Cool Stuff',
          type: 'file',
        },
      ],
    },
    {
      id: crypto.randomUUID(),
      name: 'Drive & Color',
      type: 'directory',
      children: [
        {
          id: crypto.randomUUID(),
          name: 'Drive',
          type: 'directory',
          children: [],
        },
        {
          id: crypto.randomUUID(),
          name: 'Color',
          type: 'file',
        },
      ],
    },
    {
      id: crypto.randomUUID(),
      name: 'Foo',
      type: 'file',
    },
  ]
</script>

<div class="main">
  {#each files as item}
    {#if item.type === 'directory'}
      <Directory {depth} directory={item} />
    {/if}
    {#if item.type === 'file'}
      <SelectableRow
        selected={$editorStore.inFocusElement === item.id}
        on:click={() => setInFocusElement(item.id)}
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
  {/each}
</div>

<style>
</style>
