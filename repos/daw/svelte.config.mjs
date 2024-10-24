import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

export default {
  // Consult https://svelte.dev/docs#compile-time-svelte-preprocess
  // for more information about preprocessors
  preprocess: vitePreprocess(),
  vitePlugin: {
    // Vite-plugin-svelte options
    resolve: {
      alias: {
        '@ipc': './src/ipc',
        '@main': './src/main',
        '@preload': './src/preload',
        '@renderer': './src/renderer'
      }
    }
  }
}
