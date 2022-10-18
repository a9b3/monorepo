import './app.css'
import { init } from './init'
import App from './App.svelte'

// Put startup logic in init
init()
  .then(() => {
    // Remove loading node
    const loadingEl = document.getElementById('loading')
    document.body.removeChild(loadingEl)

    const app = new App({
      target: document.getElementById('app'),
    })
  })
  .catch(err => {
    // There was an error initializing, show some response to the user.
    document.getElementById('message').innerText = 'Site is down'
    document.getElementById('progress-value').style.animation =
      'loadfinish .5s normal forwards'
    document.getElementById('progress-value').style.transition = 'background 1s'
    document.getElementById('progress-value').style.background = '#333333'
    console.error(err)
  })
