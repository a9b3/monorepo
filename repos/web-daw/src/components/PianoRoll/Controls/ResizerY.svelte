<script lang="ts">
  import { useDelta } from 'src/components/Knob/useDelta'
  import { Pill } from 'src/components'
  import { objectStyle } from 'src/utils'

  export let onResize

  const deltaDirective = useDelta(
    delta => {
      onResize(delta)
    },
    { pxRange: 200 }
  )
</script>

<div use:deltaDirective>
  <Pill
    title={'Resize'}
    style={objectStyle({
      width: '80px',
    })}
  />
</div>
