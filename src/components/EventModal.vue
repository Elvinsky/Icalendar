<template>
  <div
    class="absolute top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center bg-gray-300 bg-opacity-60 z-[99999]"
  >
    <div class="flex flex-col items-center justify-around gap-5 h-[60vh] w-[40vh] bg-white rounded-md">
      <form
        class="flex flex-col gap-5 items-center justify-start border border-black p-2 rounded-md"
        @submit.prevent
      >
        <input
          placeholder="Description"
          v-model="formData.DESCRIPTION"
          class="text-xl p-2"
        />
        <input
          placeholder="Summary"
          v-model="formData.SUMMARY"
          class="text-xl p-2"
        />
        <input
          placeholder="Location"
          v-model="formData.LOCATION"
          class="text-xl p-2"
        />
        <input
          placeholder="Start"
          type="datetime-local"
          v-model="formData.DTSTART"
          class="text-xl p-2"
        />
        <input
          placeholder="End"
          type="datetime-local"
          v-model="formData.DTEND"
          class="text-xl p-2"
        />
        <button
          class="bg-green-200 p-2 text-xl rounded-md font-semibold hover:scale-105 transition-all duration-200"
          @click="submit"
        >
          Submit
        </button>
      </form>
      <button
        @click="closeModal"
        class="bg-red-200 p-2 text-xl rounded-md font-semibold hover:scale-105 transition-all duration-200"
      >
        Close
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { ICSFormat } from '@/types/interfaces'
  import { computed, ref } from 'vue'
  import { generateUID } from '../utils/uid'
  import { storeToRefs } from 'pinia'
  import { useEventStore } from '@/stores/events'
  import { parseISO8601Date } from '@/utils/dateManipulation'

  const emits = defineEmits(['closeModal', 'submitForm'])
  const props = defineProps<{ mode: string }>()
  const closeModal = () => {
    emits('closeModal')
  }
  const { currentEvent } = storeToRefs(useEventStore())
  const formData = computed(() => {
    if (props.mode === 'patch') {
      return {
        UID: currentEvent.value[0].UID,
        DESCRIPTION: currentEvent.value[0].DESCRIPTION,
        DTEND: parseISO8601Date(currentEvent.value[0].DTEND).toISOString().substring(0, 16),
        DTSTART: parseISO8601Date(currentEvent.value[0].DTSTART).toISOString().substring(0, 16),
        DTSTAMP: '',
        LOCATION: currentEvent.value[0].LOCATION,
        SUMMARY: currentEvent.value[0].SUMMARY,
        CN: {
          OWNER: currentEvent.value[0].CN.OWNER,
          MAIL: currentEvent.value[0].CN.MAIL
        }
      }
    } else
      return {
        UID: generateUID(),
        DESCRIPTION: '',
        DTEND: new Date().toISOString().substring(0, 16),
        DTSTART: new Date().toISOString().substring(0, 16),
        DTSTAMP: '',
        LOCATION: '',
        SUMMARY: '',
        CN: {
          OWNER: '',
          MAIL: ''
        }
      }
  })
  const submit = () => {
    if (!formData.value.DESCRIPTION || !formData.value.SUMMARY || !formData.value.LOCATION) return
    emits('submitForm', {
      ...formData.value,
      DTSTART: `${formData.value.DTSTART}:00.000Z`.replace(/[-:.]/g, ''),
      DTEND: `${formData.value.DTEND}:00.000Z`.replace(/[-:.]/g, ''),
      DTSTAMP: new Date().toISOString().replace(/[-:.]/g, ''),
      CN: {
        OWNER: 'Nick',
        MAIL: 'sample@mail.com'
      }
    })
  }
</script>

<style scoped></style>
