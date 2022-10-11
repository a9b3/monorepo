import './app.css'
import { init } from './init'
import App from './App.svelte'

init().then(() => {
  const app = new App({
    target: document.getElementById('app'),
  })
})
