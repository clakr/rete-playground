<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue';
import { createEditor } from './rete';

const reteRef = useTemplateRef('rete')

onMounted(() => {
  if(!reteRef.value) return

  createEditor(reteRef.value)
})

</script>

<template>
  <main ref="rete" />
</template>

<style>
body {
  margin: 0;
}

main {
  min-height: 100svh;
}
</style>
