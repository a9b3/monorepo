import './app.css'
import { init } from './init'

/**
 * Put startup logic in init
 */
init()
  .then(async () => {
    const App = (await import('./App.svelte')).default

    // Remove loading node
    const loadingEl = document.getElementById('loading')
    document.body.removeChild(loadingEl)

    /* eslint-disable */
    const app = new App({
      target: document.getElementById('app'),
    })
    /* eslint-enable */
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
