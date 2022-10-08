export const mousePosition = {
  x: 0,
  y: 0,
}

let attached = false

function handleMouseMove(evt: MouseEvent) {
  mousePosition.x = evt.clientX
  mousePosition.y = evt.clientY
}

export function trackMousePosition() {
  if (!attached) {
    window.addEventListener('mousemove', handleMouseMove)
    attached = true
  }
}

export function untrackMousePosition() {
  if (attached) {
    window.removeEventListener('mousemove', handleMouseMove)
    attached = false
  }
}
