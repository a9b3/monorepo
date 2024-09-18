import PubSub from './pubsub/pubsub'

class UIState {
  pubsub = new PubSub()
  ui: { [key: string]: any } = this.pubsub.createProxy({
    textBoxEl: null
  })
}

export default new UIState()
