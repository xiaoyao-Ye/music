import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
// import { routes } from 'vue-router/auto-routes'

const routes: RouteRecordRaw[] = [
  {
    // path: '/',
    // // component: () => import('../components/Layout/index.vue'),
    // redirect: `/list/${LOCAL_UUID}`,
    // children: [
    //   {
    path: '/list/:id',
    component: () => import('../components/MusicList/index.vue'),
    //   },
    // ],
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('../pages/[...all].vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
