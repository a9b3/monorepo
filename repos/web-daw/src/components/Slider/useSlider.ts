/**
 * Use this directive on any element to subscribe to percentage y deltas.
 *
 * ex.
 * const slider = useSlider(delta => console.log(delta))
 * <div use:slider style={{height: 100px}} />
 */
export function useSlider(setValue: (percent: number) => void) {
  return function handler(node: HTMLElement) {
    let currValue: number
    let currentY: number
    let nodeHeight: number

    const mousemove = (evt: MouseEvent) => {
      const pxDelta = currentY - evt.clientY
      currentY = evt.clientY
      const percentageDelta = pxDelta / nodeHeight
      if (currValue - percentageDelta > 1) {
        currValue = 1
      } else if (currValue - percentageDelta < 0) {
        currValue = 0
      } else {
        currValue -= percentageDelta
      }
      setValue(currValue)
    }

    const mouseup = () => {
      document.removeEventListener('mousemove', mousemove)
      document.removeEventListener('mouseup', mouseup)
    }

    const mousedown = (evt: MouseEvent) => {
      if (!node.contains(evt.target)) {
        return
      }
      currentY = evt.clientY
      nodeHeight = node.offsetHeight

      currValue = (currentY - node.offsetTop) / nodeHeight
      setValue(currValue)

      document.addEventListener('mousemove', mousemove)
      document.addEventListener('mouseup', mouseup)
    }

    node.addEventListener('mousedown', mousedown)

    return {
      destroy() {
        node.removeEventListener('mousedown', mousedown)
        // Just in case also remove the following two
        document.removeEventListener('mousemove', mousemove)
        document.removeEventListener('mouseup', mouseup)
      },
    }
  }
}
