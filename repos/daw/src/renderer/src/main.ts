import './assets/main.css'
import(`highlight.js/styles/vs.css`)

import App from './App.svelte'

const app = new App({
  target: document.getElementById('app'),
})

export default app
