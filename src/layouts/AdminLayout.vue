<script setup lang="ts">
import { ref } from 'vue'; import { RouterView } from 'vue-router'; import AppHeader from '@/components/layout/AppHeader.vue'; import AppSidebar from '@/components/layout/AppSidebar.vue'; import MobileSidebar from '@/components/layout/MobileSidebar.vue'
const menuOpen = ref(false)
</script>
<template><div class="min-h-screen bg-slate-50"><div class="fixed inset-y-10 left-0 hidden w-64 md:block"><AppSidebar /></div><div class="md:pl-64"><AppHeader @menu="menuOpen = true" /><main class="p-4 md:p-6"><RouterView /></main></div><MobileSidebar :open="menuOpen" @close="menuOpen = false" /></div></template>
