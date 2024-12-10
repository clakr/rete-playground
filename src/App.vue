<script setup lang="ts">
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
  const socket = new ClassicPreset.Socket('socket')

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

  const a = new ClassicPreset.Node('A')
  a.addOutput('a', new ClassicPreset.Output(socket))
  await editor.value.addNode(a)

  const b = new ClassicPreset.Node('B')
  b.addInput('b', new ClassicPreset.Input(socket))
  await editor.value.addNode(b)

  const c = new ClassicPreset.Node('C')
  c.addInput('c', new ClassicPreset.Input(socket))
  await editor.value.addNode(c)

  await area.value.translate(b.id, { x: 320, y: -160 })
  await area.value.translate(c.id, { x: 320, y: 160 })

  await editor.value.addConnection(new ClassicPreset.Connection(a, 'a', b, 'b'))

  AreaExtensions.zoomAt(area.value, editor.value.getNodes())
})

onUnmounted(() => {
  if (!area.value) return

  area.value.destroy()
})

async function handleCopy(input: any) {
  await navigator.clipboard.writeText(JSON.stringify(input))
}
</script>

<template>
  <main class="grid h-svh auto-cols-fr grid-flow-col gap-x-4 p-4">
    <div ref="rete" class="border" />
    <div
      class="grid max-h-[calc(100svh-theme(spacing.8))] grid-cols-2 grid-rows-2 gap-4 *:border *:p-4"
    >
      <section class="relative overflow-auto">
        <button
          type="button"
          class="absolute right-2 top-2 border"
          @click="handleCopy(editor?.getNodes())"
        >
          Copy
        </button>
        <h2 class="font-medium">`editor.getNodes()`</h2>
        <pre class="text-xs">{{ editor?.getNodes() }}</pre>
      </section>
      <section class="relative overflow-auto">
        <button
          type="button"
          class="absolute right-2 top-2 border"
          @click="handleCopy(editor?.getConnections())"
        >
          Copy
        </button>
        <h2 class="font-medium">`editor.getConnections()`</h2>
        <pre class="text-xs">{{ editor?.getConnections() }}</pre>
      </section>
      <section class="col-span-2">qwe</section>
    </div>
  </main>
</template>
