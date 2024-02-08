import type { Preview } from '@storybook/svelte'

import '@monorepo/web-core/styles/src/generated/primatives.css'
import '../src/app.css'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
}

export default preview
