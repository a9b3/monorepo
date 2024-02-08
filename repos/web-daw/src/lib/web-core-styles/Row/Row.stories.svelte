<script context="module">
  import { primatives, svgData } from '@monorepo/web-core/styles'
  import Row from './Row.svelte'

  export const meta = {
    title: 'components/Row',
    component: Row,
    tags: ['autodocs'],
    argTypes: {
      text: {
        control: { type: 'text' },
      },
      leftIcon: {
        control: { type: 'select' },
        options: Object.keys(svgData.stroke),
      },
      rightText: {
        control: { type: 'text' },
      },
      rightIcon: {
        control: { type: 'select' },
        options: Object.keys(svgData.stroke),
      },
      isSelected: {
        control: { type: 'boolean' },
      },
      subtitle: {
        control: { type: 'text' },
      },
    },
  }
</script>

<script>
  import { Story, Template, Meta } from '@storybook/addon-svelte-csf'
</script>

<Meta title="components/Row" component={Row} />

<Template let:args>
  {#each Array(args.numberRows) as _, i}
    <Row {...args} text={args.text || 'Row ' + i} />
  {/each}
</Template>

<Story name="Default" args={{ numberRows: 1 }} />
<Story name="Folder" args={{ leftIcon: 'folder', numberRows: 5 }} />
