export class MousePosition {
  clientX = 0
  clientY = 0
  ready = false

  observeMousePosition() {
    if (!this.ready) {
      window.addEventListener('mousemove', this.#onmousemove)
      this.ready = true
    }
  }

  unobserveMousePosition() {
    if (this.ready) {
      window.removeEventListener('mousemove', this.#onmousemove)
      this.ready = false
    }
  }

  #onmousemove(evt: MouseEvent) {
    this.clientX = evt.clientX
    this.clientY = evt.clientY
  }
}

export const mousePosition = new MousePosition()
