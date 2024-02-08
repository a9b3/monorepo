<script context="module">
  import { primatives, svgData } from '@monorepo/web-core/styles'
  import Icon from './Icon.svelte'

  export const meta = {
    title: 'components/Icon',
    component: Icon,
    tags: ['autodocs'],
    argTypes: {
      type: {
        control: { type: 'select' },
        options: Object.keys(svgData.stroke),
      },
      color: {
        control: { type: 'select' },
        options: Object.keys(primatives.color),
      },
    },
  }
</script>

<script>
  import { Story, Template, Meta } from '@storybook/addon-svelte-csf'
</script>

<Meta title="components/Icon" component={Icon} />

<Template let:args>
  <Icon {...args} />
</Template>

<Story name="Folder" args={{ type: 'folder' }} />
