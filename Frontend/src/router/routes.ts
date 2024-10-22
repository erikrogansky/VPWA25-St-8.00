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

  {
    path: '/terms-and-conditions',
    component: () => import('layouts/TermsPage.vue'),
  },

  {
    path: '/cookie-policy',
    component: () => import('layouts/CookiePage.vue'),
  },

  {
    path: '/privacy-policy',
    component: () => import('layouts/PrivacyPage.vue'),
  },
  {
    path: '/about',
    component: () => import('layouts/AboutPage.vue'),
    children: [
    { path: '', redirect: 'whats-new' },
    { path: 'whats-new', component: () => import('layouts/AboutPage.vue') },
    { path: 'about-us', component: () => import('layouts/AboutPage.vue') },
    { path: 'contact-us', component: () => import('layouts/AboutPage.vue') },
    ]
    },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
