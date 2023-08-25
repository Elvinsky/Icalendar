<template>
  <header class="flex flex-row justify-center fixed top-0 left-0 right-0 h-16 items-center bg-red-200">
    <h1 class="text-2xl font-bold tracking-widest">InnoCalendar</h1>
  </header>
  <CalendarComponent />
</template>
<script setup lang="ts">
  import CalendarComponent from './components/CalendarComponent.vue'
</script>
<style scoped></style>
