export function rafInterval(cb: () => void) {
  let interval: number

  function next() {
    cb()
    interval = window.requestAnimationFrame(next)
  }
  interval = window.requestAnimationFrame(next)

  return () => window.cancelAnimationFrame(interval)
}
