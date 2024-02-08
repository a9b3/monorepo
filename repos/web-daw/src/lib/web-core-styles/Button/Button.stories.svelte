<script context="module">
  import { primatives, svgData } from '@monorepo/web-core/styles'
  import Button from './Button.svelte'

  export const meta = {
    title: 'components/Button',
    component: Button,
    tags: ['autodocs'],
    argTypes: {
      iconType: {
        control: { type: 'select' },
        options: Object.keys(svgData.stroke),
      },
      type: {
        control: { type: 'select' },
        options: ['compact', 'default'],
      },
      text: {
        control: { type: 'text' },
      },
      size: {
        control: { type: 'select' },
        options: Object.keys(primatives.float),
      },
    },
  }
</script>

<script>
  import { Story, Template, Meta } from '@storybook/addon-svelte-csf'
</script>

<Meta title="components/Button" component={Button} />

<Template let:args>
  <Button {...args} on:click={() => alert('Clicked!')}>{args.text}</Button>
</Template>

<Story name="Default" args={{ text: 'Hello World!' }} />
<Story name="Compact" args={{ text: 'Hello World!', type: 'compact' }} />
<Story name="With Icon" args={{ text: 'Hello World!', iconType: 'folder' }} />
<Story name="Disabled" args={{ text: 'Hello World!', disabled: true }} />
