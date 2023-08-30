<template>
  <CustomLoader v-if="isLoading || isUserLoading" />
  <div
    v-else
    class="flex flex-col items-center justify-center gap-4 mt-20"
  >
    <div class="flex flex-row justify-between w-[80%]">
      <input
        type="file"
        @change="uploadICS"
        accept=".ics"
        class="p-2 rounded-md bg-green-300 font-semibold transition-all duration-200 hover:scale-105"
      />
      <button
        @click="handleOpenAddModal"
        class="p-2 rounded-md bg-green-300 font-semibold transition-all duration-200 hover:scale-105"
      >
        Add
      </button>
      <button
        @click="exportICS"
        class="p-2 rounded-md bg-green-300 font-semibold transition-all duration-200 hover:scale-105"
      >
        Export
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
          'hover:bg-red-300 transition-colors duration-100 cursor-pointer': day.inCurrentMonth,
          'bg-orange-400 hover:bg-red-300 transition-colors duration-100 cursor-pointer': day.events.length > 0,
          'bg-gray-200': !day.inCurrentMonth,
          'border-2 border-black border-spacing-2': day.isToday
        }"
        @click="openEvents(day.inCurrentMonth ? day.events : undefined)"
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
      @delete-event="handleDelete"
      @patch-event="handleOpenPatch"
    />
    <EventModal
      v-if="modalActive === 'add' || modalActive === 'patch'"
      :mode="modalActive"
      @close-modal="modalActive = ''"
      @submit-form="handleSubmit"
    />
  </Teleport>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import type { CalendarDay, ICSFormat } from '../types/interfaces'
  import { useEventStore } from '../stores/events'
  import { storeToRefs } from 'pinia'
  import { isSameDay, parseISO8601Date } from '../utils/dateManipulation'
  import EventsDescription from '../components/EventsDescription.vue'
  import EventModal from '../components/EventModal.vue'
  import { parseToICS } from '../utils/dataParser'
  import CustomLoader from '../components/CustomLoader.vue'
  import { useUserStore } from '@/stores/auth'

  const todayDate = computed<Date>(() => new Date())
  const { uploadICSFile, fetchEvents, uploadEventDetails, deleteEvent, uploadICSObject, patchEvent, deleteAllEvents } =
    useEventStore()

  const { isUserLoading } = storeToRefs(useUserStore())
  const { isLoading, events } = storeToRefs(useEventStore())
  const { checkAuth } = useUserStore()
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
  const modalActive = ref<'view' | 'add' | 'patch' | ''>('')
  const handleOpenPatch = (event: ICSFormat) => {
    uploadEventDetails([event])
    modalActive.value = 'patch'
  }
  const exportICS = () => {
    parseToICS(events.value, 'exported')
  }
  const handleSubmit = (event: ICSFormat) => {
    if (modalActive.value === 'add')
      uploadICSObject(event).then(() => {
        fetchData()
        updateCalendarDays()
      })
    else if (modalActive.value === 'patch')
      patchEvent(event.UID, event).then(() => {
        fetchData()
        updateCalendarDays()
      })
    modalActive.value = ''
  }
  const openEvents = (events?: ICSFormat[]) => {
    if (!events) return
    uploadEventDetails(events)
    modalActive.value = 'view'
  }
  const handleOpenAddModal = () => {
    modalActive.value = 'add'
  }
  const handleDelete = async (id: string) => {
    deleteEvent(id).then(() => updateCalendarDays())
    modalActive.value = ''
  }
  const uploadICS = async (event: any) => {
    const file = event.target.files[0]
    uploadICSFile(file).then(() => {
      fetchData()
      updateCalendarDays()
    })
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
    if (isLoading.value) return
    const firstDay: number = new Date(currentYear.value, currentMonthIndex.value, 1).getDay()
    const daysInMonth: number = new Date(currentYear.value, currentMonthIndex.value + 1, 0).getDate()

    const days = []
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear.value, currentMonthIndex.value, i)
      const eventsOnDay = events.value.filter((event: ICSFormat) => {
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
  checkAuth()
</script>
