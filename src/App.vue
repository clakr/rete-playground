<script setup lang="ts">
import Button from './components/button.vue'
import { handleCopy } from './utils'
import { Node } from './utils/rete'
import { NodeEditor, GetSchemes, ClassicPreset } from 'rete'
import { AreaPlugin, AreaExtensions } from 'rete-area-plugin'
import { ConnectionPlugin, Presets as ConnectionPresets } from 'rete-connection-plugin'
import { VuePlugin, Presets, VueArea2D } from 'rete-vue-plugin'
import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue'

const reteRef = useTemplateRef('rete')

type Schemes = GetSchemes<
  ClassicPreset.Node,
  ClassicPreset.Connection<ClassicPreset.Node, ClassicPreset.Node>
>

type AreaExtra = VueArea2D<Schemes>

const editor = ref<NodeEditor<Schemes>>()
const area = ref<AreaPlugin<Schemes, AreaExtra>>()

onMounted(async () => {
  editor.value = new NodeEditor<Schemes>()
  area.value = new AreaPlugin<Schemes, AreaExtra>(reteRef.value!)
  const connection = new ConnectionPlugin<Schemes, AreaExtra>()
  const render = new VuePlugin<Schemes, AreaExtra>()

  AreaExtensions.selectableNodes(area.value, AreaExtensions.selector(), {
    accumulating: AreaExtensions.accumulateOnCtrl(),
  })

  render.addPreset(Presets.classic.setup())

  connection.addPreset(ConnectionPresets.classic.setup())

  editor.value.use(area.value)
  area.value.use(connection)
  area.value.use(render)

  AreaExtensions.simpleNodesOrder(area.value)

  AreaExtensions.zoomAt(area.value, editor.value.getNodes())
})

onUnmounted(() => {
  if (!area.value) return

  area.value.destroy()
})

async function handleAddNode() {
  const node = new Node(crypto.randomUUID())
  await editor.value?.addNode(node)
}
</script>

<template>
  <main class="grid h-svh auto-cols-fr grid-flow-col gap-x-4 p-4">
    <div ref="rete" class="border" />
    <div
      class="grid max-h-[calc(100svh-theme(spacing.8))] grid-cols-2 grid-rows-2 gap-4 *:border *:p-4"
    >
      <section class="relative overflow-auto">
        <Button
          type="button"
          class="absolute right-2 top-2 border"
          @click="handleCopy(editor?.getNodes())"
        >
          copy
        </Button>
        <h2 class="font-medium">`editor.getNodes()`</h2>
        <pre class="text-xs">{{ editor?.getNodes() }}</pre>
      </section>
      <section class="relative overflow-auto">
        <Button
          type="button"
          class="absolute right-2 top-2 border"
          @click="handleCopy(editor?.getConnections())"
        >
          copy
        </Button>
        <h2 class="font-medium">`editor.getConnections()`</h2>
        <pre class="text-xs">{{ editor?.getConnections() }}</pre>
      </section>
      <section class="col-span-2">
        <Button type="button" @click="handleAddNode">create node</Button>
      </section>
    </div>
  </main>
</template>
