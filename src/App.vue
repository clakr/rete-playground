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

async function handleAddNode({ hasInput, hasOutput }: { hasInput?: boolean; hasOutput?: boolean }) {
  let label = ''
  if (hasInput && hasOutput) {
    label = 'this is a node with both input and output'
  } else if (hasInput) {
    label = 'this is a node with input'
  } else if (hasOutput) {
    label = 'this is a node with output'
  }
  const node = new Node({ label, hasInput, hasOutput })
  await editor.value?.addNode(node)
}

async function handleClearNodes() {
  await editor.value?.clear()
}

async function handleSaveNodes() {
  const content = JSON.stringify(editor.value, null, 2)
  const fileName = 'editor.json'

  const blob = new Blob([content], { type: 'text/json' })
  const link = document.createElement('a')

  link.download = fileName
  link.href = window.URL.createObjectURL(blob)
  link.dataset.downloadurl = ['text/json', link.download, link.href].join(':')

  const evt = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
  })

  link.dispatchEvent(evt)
  link.remove()
}
</script>

<template>
  <main class="grid h-svh auto-cols-fr grid-flow-col gap-x-4 p-4">
    <div ref="rete" class="border" />
    <div
      class="grid max-h-[calc(100svh-theme(spacing.8))] grid-cols-3 grid-rows-2 gap-4 *:border *:p-4"
    >
      <section class="relative overflow-auto">
        <Button type="button" class="absolute right-2 top-2 border" @click="handleCopy(editor)">
          copy
        </Button>
        <h2 class="font-medium">`editor`</h2>
        <pre class="text-xs">{{ editor }}</pre>
      </section>
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
      <section class="col-span-2 flex flex-wrap items-start gap-4">
        <Button type="button" @click="handleAddNode({ hasOutput: true })">
          create node with output
        </Button>
        <Button type="button" @click="handleAddNode({ hasInput: true })">
          create node with input
        </Button>
        <Button type="button" @click="handleAddNode({ hasInput: true, hasOutput: true })">
          create node with input and output
        </Button>
        <Button type="button" @click="handleClearNodes">clear nodes</Button>
        <Button type="button" @click="handleSaveNodes">save nodes</Button>
      </section>
    </div>
  </main>
</template>
