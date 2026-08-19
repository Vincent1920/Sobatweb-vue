<script setup lang="ts">defineProps<{ title?: string }>()</script>
<template><section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h2 v-if="title" class="mb-4 text-lg font-semibold">{{ title }}</h2><slot /></section></template>
