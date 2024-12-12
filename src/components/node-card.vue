<script setup lang="ts">
import { twMerge } from 'tailwind-merge'
import { computed, HTMLAttributes } from 'vue'

const props = withDefaults(defineProps<{ class?: HTMLAttributes['class'] }>(), {
  class: '',
})

const classes = computed(() =>
  twMerge(
    'relative flex aspect-video w-80 flex-col justify-between rounded-lg border bg-slate-50 text-sm [--socket-size:36px] border-slate-300 hover:ring ring-slate-300 data-[selected=true]:ring-slate-500 shadow group',
    props.class,
  ),
)
</script>

<template>
  <article :class="classes">
    <slot />
  </article>
</template>
