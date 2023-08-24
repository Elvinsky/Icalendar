<template>
  <header class="flex flex-row justify-center fixed top-0 left-0 right-0 h-16 items-center bg-red-200">
    <h1 class="text-2xl font-bold tracking-wider">InnoCalendar</h1>
  </header>
  <section>
    <div class="grid grid-cols-5 gap-3 content-center mt-16"></div>
  </section>
</template>
<script setup lang="ts">
  import { dataParser } from '@/dataParser'
  dataParser()
</script>
<style scoped></style>
