<template>
  <div
    class="absolute top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center bg-gray-300 bg-opacity-60 z-[9999]"
  >
    <div
      class="flex flex-col items-center justify-between gap-5 h-[60vh] w-[40vh] bg-white rounded-md overflow-x-hidden overflow-y-scroll pt-8"
    >
      <div v-if="currentEvent.length === 0">No current Events</div>
      <form
        v-else
        class="flex flex-col gap-5 items-center justify-start m-4 border border-black p-2 rounded-md w-[70%]"
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
        <div class="flex flex-row gap-4">
          <button
            @click="deleteEvent(data.UID)"
            class="bg-red-200 p-2 text-lg rounded-md hover:scale-105 transition-all duration-200 mb-4"
          >
            Delete
          </button>
          <button
            @click="patchEvent(data)"
            class="bg-orange-200 p-2 text-lg rounded-md hover:scale-105 transition-all duration-200 mb-4"
          >
            Patch
          </button>
        </div>
      </form>
      <button
        @click="closeModal"
        class="bg-red-200 p-2 text-xl rounded-md hover:scale-105 transition-all duration-200 mb-4"
      >
        Close
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { parseISO8601Date } from '../utils/dateManipulation'
  import { useEventStore } from '@/stores/events'
  import type { ICSFormat } from '@/types/interfaces'
  import { storeToRefs } from 'pinia'

  const { currentEvent } = storeToRefs(useEventStore())
  const emits = defineEmits(['closeModal', 'deleteEvent', 'patchEvent'])
  const closeModal = () => {
    emits('closeModal')
  }
  const deleteEvent = (id: string) => {
    emits('deleteEvent', id)
  }
  const patchEvent = (data: ICSFormat) => {
    emits('patchEvent', data)
  }
</script>

<style scoped></style>
