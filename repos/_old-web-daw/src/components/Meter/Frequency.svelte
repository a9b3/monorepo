<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import type { Analyser } from 'daw/core'
  export let analyser: Analyser
  import { rafInterval } from 'src/utils'

  let containerEl: HTMLElement
  let canvasEl: HTMLCanvasElement
  let canvasCtx: CanvasRenderingContext2D

  function render() {
    analyser.getByteFrequencyData()
    const { offsetWidth, offsetHeight } = containerEl
    const bufferLength = analyser.analysers[0].frequencyBinCount
    let barWidth = offsetWidth / bufferLength
    let barHeight = 0
    let x = 0
    let bf = 0

    canvasCtx = canvasEl.getContext('2d')
    canvasCtx.clearRect(0, 0, offsetWidth, offsetHeight)
    canvasCtx.fillStyle = `rgba(0, 0, 0, 0.4)`
    canvasCtx.fillRect(0, 0, offsetWidth, offsetHeight)

    for (let i = 0; i < bufferLength; i += 1) {
      bf = analyser.byteFrequencies[0][i]
      barHeight = (bf / 255) * offsetHeight

      canvasCtx.fillStyle = `rgb(50, 255, 50)`
      canvasCtx.fillRect(x, offsetHeight - barHeight, barWidth, barHeight)
      x += barWidth
    }
  }

  let stopRaf
  onMount(() => {
    const { offsetWidth, offsetHeight } = containerEl
    canvasCtx = canvasEl.getContext('2d')
    canvasCtx.fillStyle = `rgba(0, 0, 0, 0.4)`
    canvasCtx.fillRect(0, 0, offsetWidth, offsetHeight)
    stopRaf = rafInterval(render)
  })
  onDestroy(() => {
    stopRaf()
  })
</script>

<div class={'main'} bind:this={containerEl}>
  <canvas bind:this={canvasEl} />
</div>

<style>
  .main {
    width: 100%;
    height: 100%;
  }
</style>
