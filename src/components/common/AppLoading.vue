<script setup lang="ts">withDefaults(defineProps<{ label?: string }>(), { label: 'Memuat data…' })</script>
<template><div class="flex items-center justify-center gap-3 p-8 text-sm text-slate-500"><span class="size-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />{{ label }}</div></template>
