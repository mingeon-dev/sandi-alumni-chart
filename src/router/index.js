import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { getDataByFilter } from '@/util/DataHelper'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition ? savedPosition : { top: 0, left: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      beforeEnter: (to) => {
        const { title, value } = to.query
        const data = getDataByFilter(title, value)
        if (data.length === 1) {
          return { path: '/detail', query: { ...to.query, id: data[0].id } }
        }
      }
    },
    {
      path: '/list',
      name: 'list',
      component: () => import('../views/ListView.vue'),
      beforeEnter: (to) => {
        const { title, value, title2, value2 } = to.query
        const data = getDataByFilter(title2, value2, getDataByFilter(title, value))
        if (data.length === 1) {
          return { path: '/detail', query: { ...to.query, id: data[0].id } }
        }
      }
    },
    {
      path: '/detail',
      name: 'detail',
      component: () => import('../views/DetailView.vue')
    }
  ]
})

export default router
