<script>
  import { createEventDispatcher, onMount, afterUpdate } from 'svelte'

  export let value = '#ff0000' // Default to red
  const dispatch = createEventDispatcher()

  let hue, saturation, brightness, red, green, blue, hexColor
  let prevValue = value

  let colorWheel
  let valueSlider
  let wheelRadius
  let wheelCenter

  $: {
    if (value !== prevValue) {
      updateFromHex(value)
      prevValue = value
    }
  }

  function updateFromHex(hex) {
    hexColor = hex
    ;[red, green, blue] = hexToRgb(hexColor)
    ;[hue, saturation, brightness] = rgbToHsv(red, green, blue)
  }

  function updateColor(fromHexInput = false) {
    if (!fromHexInput) {
      hexColor = rgbToHex(red, green, blue)
    }
    if (hexColor !== value) {
      dispatch('change', hexColor)
    }
  }

  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
      : [0, 0, 0]
  }

  function rgbToHex(r, g, b) {
    return (
      '#' +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16)
          return hex.length === 1 ? '0' + hex : hex
        })
        .join('')
    )
  }

  function hsvToRgb(h, s, v) {
    h /= 360
    s /= 100
    v /= 100
    let r, g, b
    const i = Math.floor(h * 6)
    const f = h * 6 - i
    const p = v * (1 - s)
    const q = v * (1 - f * s)
    const t = v * (1 - (1 - f) * s)
    switch (i % 6) {
      case 0:
        ;(r = v), (g = t), (b = p)
        break
      case 1:
        ;(r = q), (g = v), (b = p)
        break
      case 2:
        ;(r = p), (g = v), (b = t)
        break
      case 3:
        ;(r = p), (g = q), (b = v)
        break
      case 4:
        ;(r = t), (g = p), (b = v)
        break
      case 5:
        ;(r = v), (g = p), (b = q)
        break
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
  }

  function rgbToHsv(r, g, b) {
    ;(r /= 255), (g /= 255), (b /= 255)
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b)
    let h,
      s,
      v = max
    const d = max - min
    s = max === 0 ? 0 : d / max
    if (max === min) {
      h = 0
    } else {
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }
      h /= 6
    }
    return [Math.round(h * 360), Math.round(s * 100), Math.round(v * 100)]
  }

  function updateColorWheel(e) {
    const rect = colorWheel.getBoundingClientRect()
    const centerX = rect.left + wheelCenter
    const centerY = rect.top + wheelCenter
    const x = e.clientX - centerX
    const y = centerY - e.clientY // Invert y-axis

    const distance = Math.sqrt(x * x + y * y)
    saturation = Math.min(100, (distance / wheelRadius) * 100)

    // Corrected hue calculation
    let angle = (Math.atan2(y, x) * 180) / Math.PI
    if (angle < 0) angle += 360
    hue = Math.round((angle + 90) % 360)
    ;[red, green, blue] = hsvToRgb(hue, saturation, brightness)
    updateColor()
  }

  function updateValue(e) {
    const rect = valueSlider.getBoundingClientRect()
    brightness = 100 - Math.min(100, Math.max(0, ((e.clientY - rect.top) / rect.height) * 100))
    ;[red, green, blue] = hsvToRgb(hue, saturation, brightness)
    updateColor()
  }

  function getCursorPosition(hue, saturation) {
    const angle = (hue + 270) * (Math.PI / 180) // Add 90 degrees to match wheel calculation
    const distance = (saturation / 100) * wheelRadius
    const x = Math.cos(angle) * distance
    const y = -Math.sin(angle) * distance // Negate y to match canvas coordinate system
    return { x, y }
  }

  onMount(() => {
    updateFromHex(value)

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.target === colorWheel) {
          wheelRadius = entry.contentRect.width / 2
          wheelCenter = wheelRadius
        }
      }
    })

    resizeObserver.observe(colorWheel)

    const handleMouseMove = (e) => {
      if (e.buttons > 0) {
        if (colorWheel.contains(e.target)) {
          updateColorWheel(e)
        } else if (valueSlider.contains(e.target)) {
          updateValue(e)
        }
      }
    }

    const handleMouseDown = (e) => {
      if (colorWheel.contains(e.target)) {
        updateColorWheel(e)
      } else if (valueSlider.contains(e.target)) {
        updateValue(e)
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mousedown', handleMouseDown)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mousedown', handleMouseDown)
      resizeObserver.disconnect()
    }
  })

  function createColorWheel(canvas, size) {
    const ctx = canvas.getContext('2d')
    const centerX = size / 2
    const centerY = size / 2
    const radius = size / 2

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dx = x - centerX
        const dy = centerY - y // Note: y is inverted here
        const distance = Math.sqrt(dx * dx + dy * dy)
        if (distance <= radius) {
          let angle = (Math.atan2(dy, dx) * 180) / Math.PI
          if (angle < 0) angle += 360
          const hue = (angle + 90) % 360
          const sat = distance / radius
          const [r, g, b] = hsvToRgb(hue, sat * 100, 100)
          ctx.fillStyle = `rgb(${r},${g},${b})`
          ctx.fillRect(x, y, 1, 1)
        }
      }
    }
  }
</script>

<div class="color-picker">
  <div class="wheel-container">
    <canvas bind:this={colorWheel} width="200" height="200" use:createColorWheel={200}></canvas>
    {#if wheelCenter !== undefined}
      {@const cursorPos = getCursorPosition(hue, saturation)}
      <div
        class="wheel-cursor"
        style="transform: translate(
        {wheelCenter + cursorPos.x}px,
        {wheelCenter + cursorPos.y}px
      );"
      ></div>
    {/if}
  </div>
  <div class="value-slider" bind:this={valueSlider}>
    <div
      class="value-gradient"
      style="background: linear-gradient(to bottom,
      hsl({hue}, {saturation}%, 100%),
      hsl({hue}, {saturation}%, 50%),
      hsl({hue}, {saturation}%, 0%);"
    ></div>
    <div class="value-cursor" style="top: {100 - brightness}%;"></div>
  </div>
  <div class="color-inputs">
    <div class="color-preview" style="background-color: {hexColor};"></div>
    <div class="input-group">
      <label
        >H: <input
          type="number"
          bind:value={hue}
          min="0"
          max="359"
          on:input={() => {
            ;[red, green, blue] = hsvToRgb(hue, saturation, brightness)
            updateColor()
          }}
        /></label
      >
      <label
        >S: <input
          type="number"
          bind:value={saturation}
          min="0"
          max="100"
          on:input={() => {
            ;[red, green, blue] = hsvToRgb(hue, saturation, brightness)
            updateColor()
          }}
        /></label
      >
      <label
        >V: <input
          type="number"
          bind:value={brightness}
          min="0"
          max="100"
          on:input={() => {
            ;[red, green, blue] = hsvToRgb(hue, saturation, brightness)
            updateColor()
          }}
        /></label
      >
    </div>
    <div class="input-group">
      <label
        >R: <input
          type="number"
          bind:value={red}
          min="0"
          max="255"
          on:input={() => {
            ;[hue, saturation, brightness] = rgbToHsv(red, green, blue)
            updateColor()
          }}
        /></label
      >
      <label
        >G: <input
          type="number"
          bind:value={green}
          min="0"
          max="255"
          on:input={() => {
            ;[hue, saturation, brightness] = rgbToHsv(red, green, blue)
            updateColor()
          }}
        /></label
      >
      <label
        >B: <input
          type="number"
          bind:value={blue}
          min="0"
          max="255"
          on:input={() => {
            ;[hue, saturation, brightness] = rgbToHsv(red, green, blue)
            updateColor()
          }}
        /></label
      >
    </div>
    <div class="input-group">
      <label
        >Hex: <input
          type="text"
          bind:value={hexColor}
          on:input={() => {
            ;[red, green, blue] = hexToRgb(hexColor)
            ;[hue, saturation, brightness] = rgbToHsv(red, green, blue)
            updateColor(true)
          }}
        /></label
      >
    </div>
  </div>
</div>

<style>
  .color-picker {
    display: flex;
    gap: 10px;
    width: 400px;
    padding: 10px;
    background-color: #f0f0f0;
    border-radius: 5px;
  }

  .wheel-container {
    position: relative;
    width: 200px;
    height: 200px;
  }

  .wheel-cursor {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 2px solid white;
    position: absolute;
    top: -5px;
    left: -5px;
    pointer-events: none;
  }

  .value-slider {
    width: 30px;
    height: 200px;
    position: relative;
  }

  .value-gradient {
    width: 100%;
    height: 100%;
  }

  .value-cursor {
    width: 100%;
    height: 2px;
    background-color: white;
    position: absolute;
    pointer-events: none;
  }

  .color-inputs {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .color-preview {
    width: 50px;
    height: 50px;
    border: 1px solid #ccc;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  input[type='number'] {
    width: 50px;
  }
</style>
