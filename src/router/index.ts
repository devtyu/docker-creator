import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/Home.vue')
    },
    {
      path: '/dockerfile',
      name: 'Dockerfile',
      component: () => import('../views/Dockerfile.vue')
    },
    {
      path: '/docker-compose',
      name: 'DockerCompose',
      component: () => import('../views/DockerCompose.vue')
    },
    {
      path: '/guide',
      name: 'CommandGuide',
      component: () => import('../views/CommandGuide.vue')
    }
  ]
})

export default router
