<script setup lang="ts">
import { ref, watch } from 'vue'
import { Clock3, Save, Settings } from 'lucide-vue-next'
import type { SupportedTimezone } from '@/types'
import { schoolService } from '@/services/school.service'
import { useDashboardStore } from '@/stores/dashboard.store'
import { useToastStore } from '@/stores/toast.store'
import { normalizeApiError } from '@/utils/error-handler'
import { timezoneOptions } from '@/utils/date'

const dashboard = useDashboardStore(); const toast = useToastStore()
const selectedTimezone = ref<SupportedTimezone>('Asia/Jakarta')
const saving = ref(false); const saveError = ref<string | null>(null)
watch(() => dashboard.data?.school.timezone, (value) => {
  if (value) selectedTimezone.value = value as SupportedTimezone
}, { immediate: true })

async function saveTimezone(): Promise<void> {
  saving.value = true; saveError.value = null
  try {
    const response = await schoolService.updateTimezone(selectedTimezone.value)
    if (dashboard.data) dashboard.data.school.timezone = response.data.data.timezone
    toast.show('Zona waktu berhasil disimpan', 'success')
  } catch (cause) {
    saveError.value = normalizeApiError(cause).message
    toast.show('Gagal menyimpan zona waktu', 'error')
  } finally { saving.value = false }
}
</script>
<template><div class="space-y-6"><div><h1 class="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">Pengaturan Sekolah</h1><p class="mt-0.5 text-xs text-slate-500 sm:text-sm">Perbarui pengaturan yang berlaku untuk seluruh pengguna sekolah.</p></div><section class="max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xs"><h2 class="flex items-center gap-2 text-sm font-bold text-slate-900"><Settings class="h-4 w-4 text-sky-600"/>Zona Waktu Sekolah</h2><p class="mt-1 text-xs leading-relaxed text-slate-500">Tanggal dan waktu pada dashboard ditampilkan mengikuti zona waktu ini. Timestamp database tidak diubah.</p><label class="mt-5 block text-xs font-semibold text-slate-700" for="school-timezone">Zona Waktu</label><div class="relative mt-1.5"><Clock3 class="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400"/><select id="school-timezone" v-model="selectedTimezone" :disabled="saving || dashboard.loading" class="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none focus:border-sky-500 disabled:bg-slate-100"><option v-for="option in timezoneOptions" :key="option.value" :value="option.value">{{ option.label }} — {{ option.description }} ({{ option.value }})</option></select></div><p v-if="saveError" class="mt-3 rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-700">Gagal menyimpan zona waktu. {{ saveError }}</p><button :disabled="saving || dashboard.loading || !dashboard.data" class="mt-5 flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300" @click="saveTimezone"><Save class="h-4 w-4"/>{{ saving ? 'Menyimpan…' : 'Simpan Zona Waktu' }}</button></section></div></template>
