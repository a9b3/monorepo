import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { resolve } from 'path'

const srcPath = resolve(__dirname, 'src')

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin({ include: ['better-sqlite3'] })],
    resolve: {
      alias: {
        '@ipc': resolve(srcPath, 'ipc'),
        '@main': resolve(srcPath, 'main'),
        '@preload': resolve(srcPath, 'preload'),
        '@renderer': resolve(srcPath, 'renderer')
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@ipc': resolve(srcPath, 'ipc'),
        '@main': resolve(srcPath, 'main'),
        '@preload': resolve(srcPath, 'preload'),
        '@renderer': resolve(srcPath, 'renderer')
      }
    }
  },
  renderer: {
    plugins: [svelte()],
    resolve: {
      alias: {
        '@ipc': resolve(srcPath, 'ipc'),
        '@main': resolve(srcPath, 'main'),
        '@preload': resolve(srcPath, 'preload'),
        '@renderer': resolve(srcPath, 'renderer')
      }
    }
  }
})
