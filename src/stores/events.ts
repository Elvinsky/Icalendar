import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { ICSFormat } from '@/types/interfaces'
import axios from 'axios'

export const useEventStore = defineStore('event', () => {
  const events = ref<ICSFormat[]>([])
  const isLoading = ref<boolean>(false)
  const currentEvent = ref<ICSFormat[]>([])
  const fetchEvents = async () => {
    try {
      isLoading.value = true
      const response = await axios.get('http://localhost:3000/api/get-events')
      events.value = response.data
    } catch (error) {
      console.error(error)
    } finally {
      isLoading.value = false
    }
  }

  const uploadICS = async (file: any) => {
    if (file.size > 524288) {
      return
    }
    const formData = new FormData()
    formData.append('icsFile', file)

    try {
      isLoading.value = true
      const response = await axios.post('http://localhost:3000/api/upload-ics', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      events.value.push(response.data)
    } catch (error) {
      console.error(error)
    } finally {
      isLoading.value = false
    }
  }

  const deleteAllEvents = async () => {
    try {
      isLoading.value = true
      await axios.delete('http://localhost:3000/api/delete-all-events')
      events.value = [] // Clear the events array
    } catch (error) {
      console.error(error)
    } finally {
      isLoading.value = false
    }
  }
  const uploadEventDetails = (data: ICSFormat[]) => {
    currentEvent.value = data
  }

  return { events, isLoading, currentEvent, uploadICS, fetchEvents, deleteAllEvents, uploadEventDetails }
})
