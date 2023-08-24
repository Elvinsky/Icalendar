<template>
  <header class="flex flex-row justify-center fixed top-0 left-0 right-0 h-16 items-center bg-red-200">
    <h1 class="text-2xl font-bold tracking-wider">InnoCalendar</h1>
  </header>
  <section class="flex flex-col items-center justify-center mt-20">
    <button
      class="p-4 bg-green-300 rounded-md hover:scale-[105%] transition-all duration-300"
      @click="handleDownload"
    >
      Donwload
    </button>
  </section>
</template>
<script setup lang="ts">
  import { parseToICF } from '@/dataParser'
  const obj = [
    {
      'UID': '9876543210',
      'DTSTAMP': '20230824T080000Z',
      'CN': {
        'OWNER': 'Nick',
        'MAIL': 'nick@example.com'
      },
      'DTSTART': '20230826T100000Z',
      'DTEND': '20230826T120000Z',
      'SUMMARY': 'Meeting with Client',
      'DESCRIPTION': 'Discuss project requirements and timelines.',
      'LOCATION': 'Office'
    },
    {
      'UID': '5678901234',
      'DTSTAMP': '20230824T160000Z',
      'CN': {
        'OWNER': 'Nick',
        'MAIL': 'nick@example.com'
      },
      'DTSTART': '20230827T090000Z',
      'DTEND': '20230827T110000Z',
      'SUMMARY': 'Coding Session',
      'DESCRIPTION': 'Work on new Vue.js component for project.',
      'LOCATION': 'Home office'
    },
    {
      'UID': '3456789012',
      'DTSTAMP': '20230824T200000Z',
      'CN': {
        'OWNER': 'Nick',
        'MAIL': 'nick@example.com'
      },
      'DTSTART': '20230828T140000Z',
      'DTEND': '20230828T160000Z',
      'SUMMARY': 'Team Sync',
      'DESCRIPTION': 'Weekly sync-up with development team.',
      'LOCATION': 'Video conference'
    }
  ]
  const handleDownload = () => {
    parseToICF(obj, 'sample')
  }
  //   console.log(
  //     parseFromICS(`BEGIN:VCALENDAR
  // VERSION:2.0
  // PRODID:-//Example Corp//iCal 1.0//EN

  // BEGIN:VEVENT
  // UID:9876543210
  // DTSTAMP:20230824T080000Z
  // ORGANIZER;CN=Nick:mailto:nick@example.com
  // DTSTART:20230826T100000Z
  // DTEND:20230826T120000Z
  // SUMMARY:Meeting with Client
  // DESCRIPTION:Discuss project requirements and timelines.
  // LOCATION:Office
  // END:VEVENT

  // BEGIN:VEVENT
  // UID:5678901234
  // DTSTAMP:20230824T160000Z
  // ORGANIZER;CN=Nick:mailto:nick@example.com
  // DTSTART:20230827T090000Z
  // DTEND:20230827T110000Z
  // SUMMARY:Coding Session
  // DESCRIPTION:Work on new Vue.js component for project.
  // LOCATION:Home office
  // END:VEVENT

  // BEGIN:VEVENT
  // UID:3456789012
  // DTSTAMP:20230824T200000Z
  // ORGANIZER;CN=Nick:mailto:nick@example.com
  // DTSTART:20230828T140000Z
  // DTEND:20230828T160000Z
  // SUMMARY:Team Sync
  // DESCRIPTION:Weekly sync-up with development team.
  // LOCATION:Video conference
  // END:VEVENT

  // END:VCALENDAR`)
  //   )
</script>
<style scoped></style>
