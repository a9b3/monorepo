<!--
  @component

  The arrangement view for the piano roll.
-->
<script lang="ts">
  import { objectStyle } from 'src/utils'
  import {
    mouseDown,
    setMouseDown,
    hoverKey,
    setHoverKey,
  } from './pianoRollStore'

  export let numberOfKeys: number
  export let keyHeight: number
  export let barWidth: number
  export let numberOfBars: number
  export let barDivision: number
  export let onMidi

  let rows = Array(numberOfKeys)
    .fill(1)
    .map((_, i) => i)
    .reverse()
  let bars = Array(numberOfBars)
    .fill(1)
    .map((_, i) => i)
  let notesPerBar = Array(barDivision)
    .fill(1)
    .map((_, i) => i)

  function mouseup() {
    setMouseDown(false)
  }
</script>

<div
  class={($$restProps.class || '') + ' main'}
  style={objectStyle({
    '--keyheight': `${(keyHeight * 7) / 12}px`,
    '--barwidth': `${barWidth}px`,
    '--notewidth': `${barWidth / barDivision}px`,
  })}
>
  <div class="timeline">
    {#each bars as bar}
      <div class="bar" class:offset={bar % 2 === 1}>
        <div class="indicator">
          {bar + 1}
        </div>
      </div>
    {/each}
  </div>
  {#each rows as row}
    <div
      class="row"
      class:offset={row % 2 === 0}
      class:accent={[0, 5].includes(row % 12)}
      class:hover={$hoverKey === row}
      on:focus={() => {}}
      on:mousedown|stopPropagation={() => {
        onMidi({ note: row })
        setMouseDown(true)
        window.addEventListener('mouseup', mouseup)
      }}
      on:mouseover={() => {
        setHoverKey(row)
        if ($mouseDown) {
          onMidi({ note: row })
        }
      }}
    >
      {#each bars as bar}
        <div class="bar" class:offset={bar % 2 === 1}>
          {#each notesPerBar as _}
            <div class="note" />
          {/each}
        </div>
      {/each}
    </div>
  {/each}
</div>

<style>
  .main {
    --keyheight: 20px;
    --barwidth: 20px;
    --notewidth: 20px;
    --bg-h: var(--hsl__bg-h);
    --bg-s: var(--hsl__bg-s);
    --bg-l: var(--hsl__bg-l);
    --border-h: var(--hsl__bg2-h);
    --border-s: var(--hsl__bg2-s);
    --border-l: var(--hsl__bg2-l);
    --bg-hsl: hsla(var(--bg-h), var(--bg-s), var(--bg-l), 0.8);
    --offset-hsl: hsla(var(--bg-h), var(--bg-s), calc(var(--bg-l) - 5%), 0.7);
    --border-hsl: hsla(var(--border-h), var(--border-s), var(--border-l), 1);
    --border-offset-hsl: hsla(
      var(--border-h),
      var(--border-s),
      calc(var(--border-l) + 10%),
      1
    );

    width: 1000px;
    height: 100%;
    position: relative;
  }

  .timeline {
    position: sticky;
    height: 20px;
    left: 0;
    top: 0;
    background: var(--bg-hsl);
    border-bottom: 1px solid var(--border-hsl);
    display: flex;
  }

  .row {
    height: var(--keyheight);
    border-bottom: 1px solid var(--border-hsl);
    display: flex;
  }
  .row.offset {
    background: var(--offset-hsl);
  }
  .row.accent {
    border-bottom: 1px solid var(--border-offset-hsl);
  }
  .row.hover {
    opacity: 0.5;
  }

  .bar {
    width: var(--barwidth);
    display: flex;
    align-items: center;
    font-size: 8px;
    border-right: 1px solid
      hsl(var(--border-h), var(--border-s), calc(var(--border-l) + 10%), 1);
    background: var(--bg-hsl);
  }
  .bar.offset {
    background: var(--offset-hsl);
  }

  .bar .note {
    flex: 1;
    border-right: 1px solid var(--border-hsl);
    height: 100%;
  }
  .bar .note:last-child {
    border-right: none;
  }
  .indicator {
    margin-left: 5px;
    font-weight: bold;
    color: hsl(var(--bg-h), var(--bg-s), calc(var(--bg-l) + 20%), 1);
  }
</style>
