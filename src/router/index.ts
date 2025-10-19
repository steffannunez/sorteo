import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Profile from '@/views/Profile.vue'
import GameWordle from '@/views/GameWordle.vue'
import SudokuView from '@/views/SudokuView.vue'
import HangmanView from '@/views/HangmanView.vue'

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
  {
    path: '/juegos/sudoku',
    name: 'GameSudoku',
    component: SudokuView,
    meta: {
      title: 'Sudoku - Puzzle de Números',
    },
  },
  {
    path: '/juegos/ahorcado',
    name: 'GameHangman',
    component: HangmanView,
    meta: {
      title: 'Ahorcado - Adivina la Palabra',
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
