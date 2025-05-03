import { createRouter, createWebHashHistory } from 'vue-router'
import { useUserStore } from '@/stores/index.js'

import AIREPage from '@/views/AIREPage.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/aire/:athleteData',
      name: 'AIREPage',
      component: AIREPage,
      props: true
    },
    {
      path: '/',
      name: 'home',
      redirect: '/intro',
      component: () => import('@/views/layout/HomeIndex.vue'),
      children: [
        {
          path: '/discovery',
          name: 'discovery',
          component: () => import('@/views/discovery/DiscoveryPage.vue')
        },
        {
          path: '/creative/publish',
          name: 'publishPage',
          component: () => import('@/views/creative/PublishPage.vue')
        },
        {
          path: '/creative/draft',
          name: 'draftPage',
          component: () => import('@/views/creative/DraftPage.vue')
        },
        {
          path: '/settings',
          name: 'settingsPage',
          component: () => import('@/views/settings/SettingsPage.vue')
        },
        {
          path: '/user',
          name: 'user',
          component: () => import('@/views/user/UserPage.vue')
        },
        {
          path: '/intro',
          name: 'intro',
          component: () => import('@/views/intro/IntroPage.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/LoginPage.vue')
    },
    {
      path: '/model/:id',
      name: 'model',
      component: () => import('@/views/model/ModelPage.vue')
    },
    {
      path: '/publicize',
      name: 'publicize',
      component: () => import('@/views/publicize/PublicizePage.vue')
    },{
      path: '/video/:id',
      name: 'video',
      component: () => import('@/views/video/VideoPage.vue')
    }
  ]
})

router.beforeEach((to) => {
  const userStore = useUserStore()
  if (userStore.user && to.path === '/login') return '/'

  return true
})

export default router
