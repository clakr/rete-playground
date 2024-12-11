<script setup lang="ts">
defineProps<{ data: any }>()
</script>

<template>
  <!-- 
  @pointerdown.stop='' 
  @dblclick.stop=''

  for preventing node from being moved
  https://retejs.org/docs/faq#prevent-node-movement-on-control
  -->
  <textarea
    class="w-full rounded border p-2 [[data-selected=true]_&]:text-slate-950"
    @pointerdown.stop=""
    @dblclick.stop=""
    :value="data.value"
    @input="data.onChange"
  >
  </textarea>
</template>
