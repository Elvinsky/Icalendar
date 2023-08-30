<template>
  <div class="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
    <div class="flex flex-col items-center justify-center gap-5 text-xl">
      <h1>Welcome back!</h1>
      <form
        @submit.prevent
        class="flex flex-col gap-4 p-4 border border-black rounded-md"
      >
        <input
          placeholder="Login"
          v-model="userData.username"
          class="p-2 m-1 shadow-md rounded-md"
        />
        <input
          placeholder="Password"
          type="password"
          v-model="userData.password"
          class="p-2 m-1 shadow-md rounded-md"
        />
        <input
          placeholder="Repeat Password"
          type="password"
          v-model="userData.repeat"
          class="p-2 m-1 shadow-md rounded-md"
        />
        <button
          class="p-1 text-lg bg-green-200 hover:scale-105 transition-all duration-200 rounded-md"
          @click="handleSignup"
        >
          Submit
        </button>
        <RouterLink
          class="text-xs self-center"
          to="/login"
          >Already have an account</RouterLink
        >
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
  import router from '@/router/router'
  import { useUserStore } from '@/stores/auth'
  import { ref } from 'vue'
  const { register } = useUserStore()
  const userData = ref<{ password: string; username: string; repeat: string }>({
    password: '',
    username: '',
    repeat: ''
  })
  const handleSignup = () => {
    if (userData.value.password !== userData.value.repeat) return
    else {
      console.log(userData.value.password, userData.value.username)
      register(userData.value.username, userData.value.password).then(() => router.push('/'))
    }
  }
</script>

<style scoped></style>
