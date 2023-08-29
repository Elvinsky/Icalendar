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

  const uploadICSFile = async (file: any) => {
    if (file.size > 524288) {
      return
    }
    const formData = new FormData()
    formData.append('icsFile', file)

    try {
      isLoading.value = true
      const response = await axios.post('http://localhost:3000/api/upload-ics-file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      events.value.push(response.data)
    } catch (error) {
      console.error(error)
    } finally {
      isLoading.value = false
    }
  }
  const uploadICSObject = async (data: ICSFormat) => {
    try {
      const response = await axios.post('http://localhost:3000/api/add-event', data)
      const newEvent = response.data
      console.log(newEvent)
      events.value.push(newEvent)
    } catch (error) {
      console.error('Error adding event:', error)
    }
  }
  const deleteEvent = async (eventID: string) => {
    try {
      isLoading.value = true
      const response = await axios.delete(`http://localhost:3000/api/delete-event/${eventID}`)
      events.value = events.value.filter(el => el.UID !== eventID)
    } catch (error) {
      console.error(error)
    } finally {
      isLoading.value = false
    }
  }
  const patchEvent = async (eventID: string, updatedEvent: ICSFormat) => {
    try {
      isLoading.value = true

      const response = await axios.patch(`http://localhost:3000/api/update-event/${eventID}`, updatedEvent)

      events.value = events.value.map(el => (el.UID === eventID ? response.data : el))
    } catch (error) {
      console.error(error)
    } finally {
      isLoading.value = false
    }
  }
  const deleteAllEvents = async () => {
    try {
      isLoading.value = true
      const response = await axios.delete(`http://localhost:3000/api/delete-all-events`)
    } catch (error) {
      console.error(error)
    } finally {
      isLoading.value = false
    }
  }
  const uploadEventDetails = (data: ICSFormat[]) => {
    currentEvent.value = data
  }

  return {
    events,
    isLoading,
    currentEvent,
    uploadICSFile,
    fetchEvents,
    uploadEventDetails,
    deleteEvent,
    patchEvent,
    uploadICSObject,
    deleteAllEvents
  }
})
