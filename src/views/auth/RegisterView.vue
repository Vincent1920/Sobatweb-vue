<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, Building2, Lock, Mail, User } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth.store'
import { useToastStore } from '@/stores/toast.store'
import { normalizeApiError } from '@/utils/error-handler'

const router = useRouter()
const auth = useAuthStore()
const toast = useToastStore()
const schoolName = ref('')
const npsn = ref('')
const pic = ref('')
const email = ref('')
const password = ref('')

async function submit(): Promise<void> {
  try {
    await auth.register({ schoolName: schoolName.value, npsn: npsn.value, personInCharge: pic.value, email: email.value, password: password.value })
    toast.show('Akun sekolah berhasil dibuat! Melanjutkan ke Wizard Pembuatan Website...', 'success')
    await router.push('/onboarding')
  } catch (error) {
    toast.show(normalizeApiError(error).message, 'error')
  }
}
</script>
<template><div class="relative flex min-h-screen flex-col justify-center overflow-hidden bg-slate-900 py-12 font-sans sm:px-6 lg:px-8"><div class="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[800px] -translate-x-1/2 bg-gradient-to-b from-indigo-500/10 to-transparent blur-3xl" /><div class="z-10 text-center sm:mx-auto sm:w-full sm:max-w-lg"><div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-xl font-black text-white shadow-xl">E</div><h1 class="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">Daftarkan Sekolah Anda</h1><p class="mt-1 text-xs text-slate-400 sm:text-sm">Buat website sekolah resmi dalam hitungan menit dengan visual editor</p></div><div class="z-10 mt-8 px-4 sm:mx-auto sm:w-full sm:max-w-lg"><div class="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/90 px-6 py-8 shadow-2xl backdrop-blur-md sm:px-10"><form class="space-y-4 text-xs" @submit.prevent="submit"><label class="block"><span class="mb-1 block font-semibold text-slate-300">Nama Resmi Sekolah</span><span class="relative block"><Building2 class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" /><input v-model="schoolName" required placeholder="Contoh: SMA Negeri 3 Surabaya" class="w-full rounded-xl border border-slate-700 bg-slate-800/80 py-2.5 pl-9 pr-3 text-xs text-white" /></span></label><div class="grid grid-cols-1 gap-3 sm:grid-cols-2"><label><span class="mb-1 block font-semibold text-slate-300">NPSN Sekolah</span><input v-model="npsn" required placeholder="8 Digit NPSN" class="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2.5 font-mono text-xs text-white" /></label><label><span class="mb-1 block font-semibold text-slate-300">Nama Penanggung Jawab</span><span class="relative block"><User class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" /><input v-model="pic" required placeholder="Nama PIC / Humas" class="w-full rounded-xl border border-slate-700 bg-slate-800/80 py-2.5 pl-9 pr-3 text-xs text-white" /></span></label></div><label class="block"><span class="mb-1 block font-semibold text-slate-300">Email Sekolah / Admin</span><span class="relative block"><Mail class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" /><input v-model="email" required type="email" placeholder="admin@sekolah.sch.id" class="w-full rounded-xl border border-slate-700 bg-slate-800/80 py-2.5 pl-9 pr-3 text-xs text-white" /></span></label><label class="block"><span class="mb-1 block font-semibold text-slate-300">Buat Kata Sandi</span><span class="relative block"><Lock class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" /><input v-model="password" required type="password" minlength="8" placeholder="Minimal 8 karakter" class="w-full rounded-xl border border-slate-700 bg-slate-800/80 py-2.5 pl-9 pr-3 text-xs text-white" /></span></label><button class="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 py-3 text-xs font-bold text-white shadow-lg hover:from-sky-600 hover:to-indigo-700">Lanjut ke Konfigurasi Website<ArrowRight class="h-4 w-4" /></button></form><div class="text-center text-xs text-slate-400">Sudah memiliki akun? <RouterLink to="/login" class="font-bold text-sky-400 hover:underline">Masuk di sini</RouterLink></div></div></div></div></template>
