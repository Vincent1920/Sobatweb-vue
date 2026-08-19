<script setup lang="ts">
import { useToastStore } from '@/stores/toast.store'
const toast = useToastStore()
</script>
<template><div class="fixed right-4 top-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2"><button v-for="item in toast.items" :key="item.id" class="rounded-lg px-4 py-3 text-left text-sm text-white shadow-lg" :class="item.type === 'error' ? 'bg-red-600' : item.type === 'success' ? 'bg-emerald-600' : 'bg-slate-800'" @click="toast.remove(item.id)">{{ item.message }}</button></div></template>
