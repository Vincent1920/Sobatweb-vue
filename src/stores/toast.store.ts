import { ref } from 'vue'
import { defineStore } from 'pinia'

export interface Toast { id: number; message: string; type: 'success' | 'error' | 'info' }
export const useToastStore = defineStore('toast', () => {
  const items = ref<Toast[]>([])
  function remove(id: number): void { items.value = items.value.filter((item) => item.id !== id) }
  function show(message: string, type: Toast['type'] = 'info'): void {
    const id = Date.now()
    items.value.push({ id, message, type })
    window.setTimeout(() => remove(id), 4000)
  }
  return { items, show, remove }
})
