import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useUserStore = defineStore('user', () => {
  const token = ref<string | null>(null)
  const isAuthenticated = ref(!!localStorage.getItem('token'))
  const isUserLoading = ref<boolean>(false)
  const localusername = ref<string | null>(null)

  const login = async (username: string, password: string) => {
    isUserLoading.value = true
    try {
      const response = await axios.post('http://localhost:3000/api/login', {
        username,
        password
      })
      token.value = response.data.token
      isAuthenticated.value = true
      localStorage.setItem('username', username)
      localusername.value = username
      if (token.value) {
        localStorage.setItem('token', token.value)
      }
    } catch (error) {
      console.error(error)
    } finally {
      isUserLoading.value = false
    }
  }
  const register = async (username: string, password: string) => {
    isUserLoading.value = true
    try {
      const data = { username: username, password: password }
      const response = await axios.post('http://localhost:3000/api/register', data).then(() => {
        login(username, password)
      })
    } catch (error) {
      console.error(error)
    } finally {
      isUserLoading.value = false
    }
  }
  const logout = async () => {
    isUserLoading.value = true
    try {
      const response = await axios.post('http://localhost:3000/api/auth/logout')
      token.value = null
      isAuthenticated.value = false
    } catch (error) {
      console.error(error)
    } finally {
      isUserLoading.value = false
    }
  }

  const checkAuth = async () => {
    isUserLoading.value = true
    try {
      if (!token.value) return
      const response = await axios.get('http://localhost:3000/api/auth/check-auth', {
        headers: { Authorization: token.value }
      })
      isAuthenticated.value = true
      localusername.value = response.data
    } catch (error) {
      isAuthenticated.value = false
    } finally {
      isUserLoading.value = false
    }
  }

  return {
    token,
    isAuthenticated,
    isUserLoading,
    localusername,
    login,
    register,
    logout,
    checkAuth
  }
})
