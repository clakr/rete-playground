<script setup lang="ts">
import { Schemes } from '../../App.vue'
import { sortByIndex } from '../../utils'
import NodeCard from '../node-card.vue'
import NodeLabel from '../node-label.vue'
import { Icon } from '@iconify/vue'
import { Ref } from 'rete-vue-plugin'
import { computed } from 'vue'

// emit:any cos idk emit type, can't find in rete.js
const props = defineProps<{ data: Schemes['Node']; emit: any; seed: number }>()

const outputs = computed(() => sortByIndex(Object.entries(props.data.outputs)))
</script>

<template>
  <NodeCard :data-selected="data.selected" data-testid="node" class="w-72">
    <section class="grid place-content-center py-8">
      <Icon icon="formkit:start" class="size-20" />
    </section>

    <!-- outputs -->
    <section class="border-t border-slate-300 py-2 text-xs font-medium">
      <template v-for="[key, output] in outputs" :key="key + seed">
        <div
          v-if="output"
          :data-testid="`output-${key}`"
          class="flex items-center justify-end gap-x-4"
        >
          <div v-if="output.label">
            {{ output.label }}
          </div>
          <Ref
            :emit
            :data="{ type: 'socket', side: 'output', key, nodeId: data.id, payload: output.socket }"
            data-testid="output-socket"
            class="-mx-[calc(var(--socket-size)/2)] [&>div[title=socket]]:z-50 [&>div[title=socket]]:bg-slate-700"
          />
        </div>
      </template>
    </section>

    <NodeLabel>
      <Icon icon="formkit:start" />
      {{ data.label }}
    </NodeLabel>
  </NodeCard>
</template>
