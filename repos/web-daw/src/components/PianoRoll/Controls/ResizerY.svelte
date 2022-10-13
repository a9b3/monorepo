<script lang="ts">
  import { useDelta } from 'src/components/Knob/useDelta'
  import { Pill, Icon } from 'src/components'
  import { objectStyle } from 'src/utils'

  export let onResize: (delta: number) => void

  const deltaDirective = useDelta(
    delta => {
      onResize(delta)
    },
    { pxRange: 200 }
  )
</script>

<div
  use:deltaDirective
  style={objectStyle({
    padding: '2px',
  })}
>
  <Icon type={'gridFill'} />
</div>
