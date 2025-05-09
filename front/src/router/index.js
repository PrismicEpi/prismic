import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import ExperienceView from '@/views/ExperienceView.vue'
import HistoriqueView from '@/views/HistoriqueView.vue'
import ExperienceDetailView from '@/views/ExperienceDetailView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: LoginView },
    { path: '/', component: ExperienceView, meta: { requiresAuth: true } },
    { path: '/historique', component: HistoriqueView, meta: { requiresAuth: true } },
    { path: '/experience/:id', component: ExperienceDetailView, meta: { requiresAuth: true } },
  ],
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  // Si l'utilisateur est authentifié et tente d'accéder à la page de login, rediriger vers la page d'accueil
  if (token && to.path === '/login') {
    next('/')
  } 
  // Si l'utilisateur n'est pas authentifié et tente d'accéder à une page protégée
  else if (!token && to.path !== '/login') {
    next('/login')
  }
  // Dans tous les autres cas, continuer normalement
  else {
    next()
  }
})

export default router