import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  // ogin
  {
    path: '/login',
    component: () => import('layouts/LoginPage.vue'),
  },
  // register
  {
    path: '/register',
    component: () => import('layouts/RegisterPage.vue'),
  },

  {
    path: '/app',
    component: () => import('layouts/ChatInterface.vue'),
  },

  {
    path: '/',
    component: () => import('layouts/LandingPage.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
