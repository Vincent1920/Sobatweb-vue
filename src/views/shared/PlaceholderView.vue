<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppCard from '@/components/common/AppCard.vue'
const route = useRoute()
const title = computed(() => String(route.meta.title ?? 'Halaman'))
</script>
<template><div><p class="text-sm font-medium text-indigo-600">Fondasi Vue 3</p><h1 class="mt-1 text-2xl font-bold tracking-tight text-slate-900">{{ title }}</h1><p class="mt-2 text-sm text-slate-500">Placeholder route aktif. UI dan flow halaman ini akan dimigrasikan pada fase berikutnya.</p><AppCard class="mt-6"><div class="h-32 rounded-lg bg-gradient-to-r from-indigo-50 to-sky-50" /></AppCard></div></template>
