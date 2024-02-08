<script context="module">
  import Text from './Text.svelte'

  export const meta = {
    title: 'components/Text',
    component: Text,
    tags: ['autodocs'],
  }
</script>

<script>
  import { Story, Template, Meta } from '@storybook/addon-svelte-csf'
</script>

<Meta title="components/Text" component={Text} />

<Template let:args>
  <Text {...args}>{args.text}</Text>
</Template>

<Story name="Default" args={{ text: 'Hello World!' }} />
<Story name="H1" args={{ text: 'Hello World!', header: 1 }} />
<Story name="H2" args={{ text: 'Hello World!', header: 2 }} />
<Story name="H3" args={{ text: 'Hello World!', header: 3 }} />
