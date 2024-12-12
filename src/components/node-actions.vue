<script setup lang="ts">
import { Icon } from '@iconify/vue'
</script>

<template>
  <section
    class="absolute inset-x-0 bottom-[calc(100%+1rem)] flex items-center justify-between gap-x-4 rounded-lg border border-slate-300 bg-slate-50 p-4 group-hover:ring group-hover:ring-slate-300 group-data-[selected=true]:ring-slate-500"
  >
    <h2 class="text-xs font-medium"><slot name="heading" /></h2>
    <div class="flex items-center">
      <button type="button" class="grid place-content-center rounded p-1 hover:bg-slate-200">
        <span class="sr-only">Copy Bot Payload ID</span>
        <Icon icon="bx:copy" class="size-5" />
      </button>
      <button type="button" class="grid place-content-center rounded p-1 hover:bg-slate-200">
        <span class="sr-only">Copy m.me Link</span>
        <Icon icon="bx:link" class="size-5" />
      </button>
      <button type="button" class="grid place-content-center rounded p-1 hover:bg-slate-200">
        <span class="sr-only">Copy JSON code</span>
        <Icon icon="bxs:file-json" class="size-5" />
      </button>
      <button type="button" class="grid place-content-center rounded p-1 hover:bg-slate-200">
        <span class="sr-only">View QR Code</span>
        <Icon icon="bx:qr" class="size-5" />
      </button>
      <button type="button" class="grid place-content-center rounded p-1 hover:bg-slate-200">
        <span class="sr-only">View Webhook URL</span>
        <Icon icon="material-symbols:webhook" class="size-5" />
      </button>
    </div>
  </section>
</template>
