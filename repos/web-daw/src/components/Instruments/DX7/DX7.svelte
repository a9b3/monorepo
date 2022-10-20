<script lang="ts">
  import type { DX7 } from 'daw/core/instruments'
  import Keyboard from 'src/components/PianoRoll/Keyboard.svelte'
  import { ClickSelection, Text, Layout } from 'src/components'

  export let dx7: DX7
  let presets = dx7.presets

  $: {
    console.log($presets)
  }
</script>

<div class={'main'}>
  <div class="top">
    {#if $presets}
      <div class="select">
        <ClickSelection
          options={$presets.banks.map(bank => {
            return {
              label: bank.name,
              key: bank.url,
            }
          })}
          selectedKeys={[$presets.selectedBankUrl]}
          onSelect={async ({ key }) => {
            await $presets.load(key)
          }}
        >
          <Layout type="col">
            <Text color={'fg2'}>Banks:</Text>
            <div>
              Selected: {$presets.banks.find(
                ({ url }) => url === $presets.selectedBankUrl
              )?.name || 'None'}
            </div>
          </Layout>
        </ClickSelection>
      </div>
      <div class="select">
        <ClickSelection
          options={$presets.patches.map((name, idx) => {
            return {
              label: name,
              key: String(idx),
            }
          })}
          selectedKeys={[$presets.selectedBankUrl]}
          onSelect={async ({ key }) => {
            $presets.setPatch(Number(key))
          }}
        >
          <Layout type="col">
            <Text color={'fg2'}>Patches:</Text>
            <div>
              Selected: {$presets.selectedPatch?.voice || 'None'}
            </div>
          </Layout>
        </ClickSelection>
      </div>
    {/if}
  </div>
  <div class="keys">
    <Keyboard
      numberOfKeys={88}
      keyHeight={10}
      onMidi={dx7.onMidi}
      horizontal={true}
      spacerSize={0}
      showHover={false}
    />
  </div>
</div>

<style>
  .main {
  }

  .top {
    height: 50px;
    background: var(--colors__bg);
    display: flex;
    flex-direction: row;
  }
  .keys {
  }
  .select {
    padding: var(--spacing__paddingM);
  }
</style>
