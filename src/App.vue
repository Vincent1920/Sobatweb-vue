<script setup lang="ts">
import { RouterView } from 'vue-router'
import ToastContainer from '@/components/common/ToastContainer.vue'
import DemoRoleSwitcherBar from '@/components/common/DemoRoleSwitcherBar.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col bg-slate-100 font-sans text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
    <DemoRoleSwitcherBar />
    <main class="flex flex-1 flex-col"><RouterView /></main>
  </div>
  <ToastContainer />
</template>
