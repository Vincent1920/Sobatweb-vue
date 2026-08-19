<script setup lang="ts">
defineProps<{ modelValue: string; label?: string; type?: string; placeholder?: string; error?: string }>()
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>
<template>
  <label class="block">
    <span v-if="label" class="mb-1.5 block text-sm font-medium text-slate-700">{{ label }}</span>
    <input :value="modelValue" :type="type ?? 'text'" :placeholder="placeholder" class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)" />
    <span v-if="error" class="mt-1 block text-xs text-red-600">{{ error }}</span>
  </label>
</template>
