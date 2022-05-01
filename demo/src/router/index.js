import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login')
  },
  {
    path: '/',
    name: '/',
    component: () => import('../views/login'),
    redirect: '/login'
  },
  {
    path: '/web',
    name: '/web',
    component: () => import('../layout'),
    children: [
      {
        path: 'twoDchart',
        name: 'twoDchart',
        component: () => import('@/views/twoDchart/index.vue')
      },
      {
        path: 'threeDScatter',
        name: 'threeDScatter',
        component: () => import('@/views/threeDScatter/index.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
