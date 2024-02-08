<script context="module">
  import { primatives, svgData } from '@monorepo/web-core/styles'
  import Input from './Input.svelte'

  export const meta = {
    title: 'components/Input',
    component: Input,
    tags: ['autodocs'],
    argTypes: {
      type: {
        control: { type: 'select' },
        options: ['select', 'text'],
      },
    },
  }
</script>

<script>
  import { Story, Template, Meta } from '@storybook/addon-svelte-csf'
</script>

<Meta title="components/Input" component={Input} />

<Template let:args>
  <Input {...args} />
</Template>

<Story name="Default" args={{ type: 'select' }} />
