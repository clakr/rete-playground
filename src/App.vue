<script setup lang="ts">
import Button from './components/button.vue'
import Textarea from './components/control/textarea.vue'
import Reference from './components/nodes/reference.vue'
import Text from './components/nodes/text.vue'
import { handleCopy } from './utils'
import { ReferenceNode, TextareaControl, TextNode } from './utils/rete'
import { NodeEditor, GetSchemes, ClassicPreset } from 'rete'
import { AreaPlugin, AreaExtensions } from 'rete-area-plugin'
import { ConnectionPlugin, Presets as ConnectionPresets } from 'rete-connection-plugin'
import { VuePlugin, Presets, VueArea2D } from 'rete-vue-plugin'
import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue'

const reteRef = useTemplateRef('rete')

export type Schemes = GetSchemes<
  ClassicPreset.Node,
  ClassicPreset.Connection<ClassicPreset.Node, ClassicPreset.Node>
>

type AreaExtra = VueArea2D<Schemes>

// instantiate rete.js, not necessarily need to ref values
// ref'ed only for debugging purposes

const socket = new ClassicPreset.Socket('socket')
const editor = ref<NodeEditor<Schemes>>()
const area = ref<AreaPlugin<Schemes, AreaExtra>>()

onMounted(async () => {
  editor.value = new NodeEditor<Schemes>()
  area.value = new AreaPlugin<Schemes, AreaExtra>(reteRef.value!)
  const connection = new ConnectionPlugin<Schemes, AreaExtra>()
  const render = new VuePlugin<Schemes, AreaExtra>()

  // https://retejs.org/docs/guides/basic#selectable-nodes
  AreaExtensions.selectableNodes(area.value, AreaExtensions.selector(), {
    accumulating: AreaExtensions.accumulateOnCtrl(),
  })

  // https://retejs.org/docs/guides/basic#crate-area
  render.addPreset(
    Presets.classic.setup({
      customize: {
        node(data) {
          if (data.payload.label === 'reference') {
            return Reference
          } else if (data.payload.label === 'text') {
            return Text
          }

          return Presets.classic.Node
        },
        control(data) {
          if (data.payload instanceof TextareaControl) {
            return Textarea
          } else if (data.payload instanceof ClassicPreset.InputControl) {
            return Presets.classic.Control
          }
        },
      },
    }),
  )

  // https://retejs.org/docs/guides/basic#interactive-connections
  connection.addPreset(ConnectionPresets.classic.setup())

  editor.value.use(area.value)
  area.value.use(connection)
  area.value.use(render)

  // https://retejs.org/docs/guides/basic#nodes-order
  AreaExtensions.simpleNodesOrder(area.value)

  // --- everything below is unnecessary for setting up rete
  const referenceNode = new ReferenceNode()
  await editor.value.addNode(referenceNode)

  const textNode = new TextNode()
  await editor.value.addNode(textNode)
  await area.value.translate(textNode.id, { x: 400, y: 0 })

  // https://retejs.org/docs/guides/basic#fit-viewport
  AreaExtensions.zoomAt(area.value, editor.value.getNodes())
})

onUnmounted(() => {
  if (!area.value) return

  area.value.destroy()
})

async function handleClearNodes() {
  await editor.value?.clear()
}

async function handleSaveNodes() {
  if (!editor.value) return
  // https://stackoverflow.com/a/65939108
  // code snippet to write contents to a file and
  // automatically download file, without having to
  // use `node:fs`
  const content = JSON.stringify(
    {
      nodes: editor.value.getNodes().map((node) => ({
        ...node,
        position: area.value?.nodeViews.get(node.id)?.position,
      })),
      connections: editor.value.getConnections(),
    },
    null,
    2,
  )

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

async function handleUploadData(event: Event) {
  // // clear canvas' nodes
  // editor.value?.clear()
  // // get file from `input:file`
  // const inputElement = event.target as HTMLInputElement
  // const file = inputElement.files?.item(0)
  // if (!file) throw new Error('no file selected')
  // // reset `<input />` value
  // inputElement.value = ''
  // // get and parse content to JSON
  // const content = JSON.parse(await file.text())
  // // iterate each node and its respective details
  // // and add node into canvas
  // // should be wrapped in `Promise.allSettled` since
  // // `editor.addNode` is asynchronous
  // await Promise.allSettled(
  //   content.nodes.map(async (node) => {
  //     const newNode = new ClassicPreset.Node(node.label)
  //     newNode.id = node.id
  //     // iterate through node's input sockets and create accordingly
  //     for (const input in node.inputs) {
  //       newNode.addInput(input, new ClassicPreset.Input(socket))
  //     }
  //     // iterate through node's output sockets and create accordingly
  //     for (const output in node.outputs) {
  //       newNode.addOutput(output, new ClassicPreset.Output(socket))
  //     }
  //     await editor.value?.addNode(newNode)
  //     await area.value?.translate(newNode.id, node.position)
  //   }),
  // )
  // // iterate each connection and create respective nodes' conenection
  // // should be wrapped in `Promise.allSettled` since
  // // `editor.addConnection` is asynchronous
  // await Promise.allSettled(
  //   content.connections.map(async (connection) => {
  //     const sourceNode = editor.value?.getNode(connection.source)
  //     if (!sourceNode) throw new Error('no sourceNode')
  //     const targetNode = editor.value?.getNode(connection.target)
  //     if (!targetNode) throw new Error('no targetNode')
  //     await editor.value?.addConnection(
  //       new ClassicPreset.Connection(
  //         sourceNode,
  //         connection.sourceOutput,
  //         targetNode,
  //         connection.targetInput,
  //       ),
  //     )
  //   }),
  // )
}
</script>

<template>
  <main class="grid h-svh auto-cols-fr grid-flow-col gap-x-4 p-4">
    <div ref="rete" class="border" />
    <div
      class="grid max-h-[calc(100svh-theme(spacing.8))] grid-cols-2 grid-rows-2 gap-4 *:border *:p-4"
    >
      <section class="relative overflow-auto">
        <Button type="button" class="absolute right-2 top-2 border" @click="handleCopy(editor)">
          copy
        </Button>
        <h2 class="font-medium">`editor`</h2>
        <pre class="text-xs">{{ editor }}</pre>
      </section>
      <section class="relative overflow-auto">
        <Button type="button" class="absolute right-2 top-2 border" @click="handleCopy(area)">
          copy
        </Button>
        <h2 class="font-medium">`area`</h2>
        <pre class="text-xs">{{ area }}</pre>
      </section>
      <section class="col-span-full flex flex-wrap items-center gap-4">
        <Button type="button" @click="handleClearNodes">clear nodes</Button>
        <Button type="button" @click="handleSaveNodes">save nodes</Button>
        <input type="file" @change="handleUploadData" disabled />
      </section>
    </div>
  </main>
</template>
