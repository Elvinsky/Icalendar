import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import SignupView from '@/views/SignupView.vue'
import { useUserStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    children: [
      {
        path: '',
        name: 'home',
        alias: ['/home'],
        component: HomeView,
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    alias: '/signin',
    component: LoginView,
    meta: { guestOnly: true }
  },
  {
    path: '/registration',
    name: 'registration',
    alias: ['/register', '/signup'],
    component: SignupView,
    meta: { guestOnly: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    next({ name: 'login' })
  } else if (to.meta.guestOnly && userStore.isAuthenticated) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
