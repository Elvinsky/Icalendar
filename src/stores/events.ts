import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { ICSFormat } from '@/types/interfaces'

export const useEventStore = defineStore('event', () => {
  const events = ref<ICSFormat[]>()

  return { events }
})
