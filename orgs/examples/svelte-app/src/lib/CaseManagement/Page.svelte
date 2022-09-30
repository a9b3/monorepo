<script lang="ts">
  import { cases, casesArr, myCases, currentUserId } from './caseState'

  currentUserId.set('me')
</script>

<div>
  <input bind:value={$cases['1'].shape.a} />
  {#each $casesArr as ca}
    {ca.assignee}
  {/each}
</div>

<style>
</style>
