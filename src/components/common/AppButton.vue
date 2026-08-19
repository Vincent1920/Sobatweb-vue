<script setup lang="ts">
withDefaults(defineProps<{ type?: 'button' | 'submit'; disabled?: boolean; variant?: 'primary' | 'secondary' }>(), { type: 'button', variant: 'primary' })
</script>
<template>
  <button :type="type" :disabled="disabled" class="rounded-lg px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50" :class="variant === 'primary' ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'">
    <slot />
  </button>
</template>
