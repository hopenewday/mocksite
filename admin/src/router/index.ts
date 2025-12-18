import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import AuthLayout from '../layouts/AuthLayout.vue'
import AppLayout from '../layouts/AppLayout.vue'
import { useAuth } from '../composables/useAuth'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'login' },
  },
  {
    name: 'admin',
    path: '/',
    component: AppLayout,
    redirect: { name: 'question-bank' },
    children: [
      {
        name: 'question-bank',
        path: 'question-bank',
        component: () => import('../pages/questions/QuestionsPage.vue'),
      },
      {
        name: 'test-management',
        path: 'test-management',
        component: () => import('../pages/tests/TestsPage.vue'),
      },
      {
        name: 'user-management',
        path: 'user-management',
        component: () => import('../pages/users/UsersPage.vue'),
      },
      {
        name: 'category-management',
        path: 'category-management',
        component: () => import('../pages/categories/CategoriesPage.vue'),
      },
      {
        name: 'results-analytics',
        path: 'results-analytics',
        component: () => import('../pages/results/ResultsPage.vue'),
      },
      {
        name: 'audit-logs',
        path: 'audit-logs',
        component: () => import('../pages/audit-logs/AuditLogsPage.vue'),
      },
    ],
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        name: 'login',
        path: 'login',
        component: () => import('../pages/auth/Login.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    } else {
      document.querySelector('.app-layout__content')?.scrollTo(0, 0)
    }
  },
  routes,
})

router.beforeEach(async (to) => {
  const { user } = useAuth()
  const isAuthenticated = !!user.value

  if (!isAuthenticated && to.name !== 'login') {
    return { name: 'login' }
  }
})

export default router
