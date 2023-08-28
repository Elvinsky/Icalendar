<template>
  <div
    class="absolute top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center bg-gray-300 bg-opacity-60 z-[9999]"
  >
    <div class="flex flex-col items-center justify-around gap-5 h-[60vh] w-[40vh] bg-white rounded-md">
      <button @click="openAddModal">Add Event</button>
      <div v-if="currentEvent.length === 0">No current Events</div>
      <form
        v-else
        class="flex flex-col gap-5 items-center justify-start m-4 border border-black p-2 rounded-md"
        v-for="data in currentEvent"
        :key="data.UID"
        @submit.prevent
      >
        <p>{{ data.DESCRIPTION }}</p>
        <p>
          {{ parseISO8601Date(data.DTSTART).toLocaleDateString() }} -
          {{ parseISO8601Date(data.DTEND).toLocaleDateString() }}
        </p>
        <p>{{ data.LOCATION }}</p>
        <p>{{ data.SUMMARY }}</p>
        <button @click="deleteEvent(data.UID)">Delete</button>
      </form>
      <button @click="closeModal">Close</button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { parseISO8601Date } from '../utils/dateManipulation'
  import { useEventStore } from '@/stores/events'
  import { storeToRefs } from 'pinia'

  const { currentEvent } = storeToRefs(useEventStore())

  const emits = defineEmits(['closeModal', 'openAddModal', 'deleteEvent'])
  const closeModal = () => {
    emits('closeModal')
  }
  const openAddModal = () => {
    emits('openAddModal')
  }
  const deleteEvent = (id: string) => {
    console.log(id)
    emits('deleteEvent', id)
  }
</script>

<style scoped></style>
