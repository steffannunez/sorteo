import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Profile from '@/views/Profile.vue'
import GameWordle from '@/views/GameWordle.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/perfil',
    name: 'Profile',
    component: Profile,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/juegos/wordle',
    name: 'GameWordle',
    component: GameWordle,
    meta: {
      title: 'Palabra del Día - Wordle',
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
