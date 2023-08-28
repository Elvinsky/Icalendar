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
  import { ref } from 'vue'
  import { generateUID } from '../utils/uid'

  const emits = defineEmits(['closeModal'])
  const closeModal = () => {
    emits('closeModal')
  }
  const formData = ref<ICSFormat>({
    UID: '',
    DESCRIPTION: '',
    DTEND: '',
    DTSTART: '',
    DTSTAMP: '',
    LOCATION: '',
    SUMMARY: '',
    CN: {
      OWNER: '',
      MAIL: ''
    }
  })
  const submit = () => {
    console.log({
      ...formData.value,
      DTSTART: `${formData.value.DTSTART}:00.000Z`,
      DTEND: `${formData.value.DTEND}:00.000Z`,
      DTSTAMP: new Date().toISOString(),
      CN: {
        OWNER: 'Nick',
        MAIL: 'sample@mail.com'
      },
      UID: generateUID()
    })
  }
</script>

<style scoped></style>
