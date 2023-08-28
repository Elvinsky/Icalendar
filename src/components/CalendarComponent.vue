<template>
  <div v-if="isLoading">loading</div>
  <div
    v-else
    class="flex flex-col items-center justify-center gap-4 mt-20"
  >
    <div class="flex flex-row justify-between w-[80%]">
      <input
        type="file"
        @change="uploadICSFile"
        accept=".ics"
        class="p-2 rounded-md bg-green-300 font-semibold transition-all duration-200 hover:scale-105"
      />
      <button
        @click="fetchData"
        class="p-2 rounded-md bg-green-300 font-semibold transition-all duration-200 hover:scale-105"
      >
        Refresh
      </button>
      <div class="flex flex-row items-center">
        <button
          @click="prevMonth"
          class="px-3 py-1 rounded-md bg-blue-500 text-white hover:bg-blue-600"
        >
          Previous
        </button>
        <h2 class="mx-4 text-xl font-semibold">{{ currentMonth }}</h2>
        <button
          @click="nextMonth"
          class="px-3 py-1 rounded-md bg-blue-500 text-white hover:bg-blue-600"
        >
          Next
        </button>
      </div>
    </div>
    <div class="grid grid-cols-7 grid-rows-6 gap-3 w-[75%] h-[75%] border border-black p-4 rounded-md">
      <div
        v-for="(day, index) in calendarDays"
        :key="index"
        class="flex flex-col items-center justify-center h-14 rounded-md text-gray-800 font-semibold text-sm"
        :class="{
          'bg-gray-100': !day.inCurrentMonth,
          'bg-white hover:bg-red-300 transition-colors duration-100 cursor-pointer': day.inCurrentMonth,
          'bg-blue-200': day.isToday,
          'bg-orange-300 hover:bg-red-300 transition-colors duration-100 cursor-pointer': day.events.length > 0
        }"
        @click="openEvents(day.events)"
      >
        <div class="text-xs text-gray-500">{{ day.dayOfWeek }}</div>
        {{ day.day }}
      </div>
    </div>
  </div>
  <Teleport to="body">
    <EventsDescription
      v-if="modalActive === 'view'"
      @close-modal="modalActive = ''"
      @open-add-modal="modalActive = 'add'"
    />
    <EventModal
      v-if="modalActive === 'add'"
      @close-modal="modalActive = ''"
    />
  </Teleport>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import type { CalendarDay, ICSFormat } from '@/types/interfaces'
  import { useEventStore } from '@/stores/events'
  import { storeToRefs } from 'pinia'
  import { isSameDay, parseISO8601Date } from '../utils/dateManipulation'
  import EventsDescription from './EventsDescription.vue'
  import EventModal from './EventModal.vue'
  const todayDate = computed<Date>(() => new Date())
  const { uploadICS, fetchEvents, uploadEventDetails } = useEventStore()
  const { isLoading, events } = storeToRefs(useEventStore())
  const months: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  const currentDate = ref<Date>(new Date())
  const currentYear = ref<number>(currentDate.value.getFullYear())
  const currentMonthIndex = ref<number>(currentDate.value.getMonth())
  const calendarDays = ref<CalendarDay[]>([])
  const modalActive = ref<'view' | 'add' | ''>('')

  const openEvents = (events: ICSFormat[]) => {
    uploadEventDetails(events)
    modalActive.value = 'view'
  }
  const uploadICSFile = async (event: any) => {
    const file = event.target.files[0]
    uploadICS(file).then(() => updateCalendarDays())
  }
  const fetchData = async () => {
    fetchEvents().then(() => updateCalendarDays())
  }
  const prevMonth = (): void => {
    if (currentMonthIndex.value === 0) {
      currentYear.value -= 1
      currentMonthIndex.value = 11
    } else {
      currentMonthIndex.value -= 1
    }
    updateCalendarDays()
  }

  const nextMonth = (): void => {
    if (currentMonthIndex.value === 11) {
      currentYear.value += 1
      currentMonthIndex.value = 0
    } else {
      currentMonthIndex.value += 1
    }
    updateCalendarDays()
  }

  const updateCalendarDays = (): void => {
    const firstDay: number = new Date(currentYear.value, currentMonthIndex.value, 1).getDay()
    const daysInMonth: number = new Date(currentYear.value, currentMonthIndex.value + 1, 0).getDate()

    const days = []
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear.value, currentMonthIndex.value, i)
      const eventsOnDay = events.value.filter(event => {
        return isSameDay(parseISO8601Date(event.DTSTART), date)
      })
      days.push({
        day: i,
        inCurrentMonth: true,
        dayOfWeek: getDayAbbreviation(date),
        isToday: date.toDateString() === todayDate.value.toDateString(),
        events: eventsOnDay
      })
    }

    for (let i = 0; i < (firstDay + 6) % 7; i++) {
      days.unshift({
        day: '',
        inCurrentMonth: false,
        dayOfWeek: '',
        events: []
      })
    }

    calendarDays.value = days
  }

  const currentMonth = computed<string>(() => `${months[currentMonthIndex.value]} ${currentYear.value}`)

  const getDayAbbreviation = (date: Date): string => {
    const days: string[] = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'St']
    return days[date.getDay()]
  }

  updateCalendarDays()
  fetchData()
</script>
