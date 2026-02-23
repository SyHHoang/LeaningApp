import { createRouter, createWebHistory } from 'vue-router'
import adminRoutes from './routes/adminRoutes.js'
import userRoutes from './routes/userRoutes.js'
import authRoutes from './routes/authRoutes.js'
const routes=[
  {
    path:'/',
    name:'home',
    component:()=>import('@/layouts/guestLayout.vue')
  },
  ...authRoutes,
  ...adminRoutes,
  ...userRoutes
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
