import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/visualizarTreino',
  },
  {
    path: '/login',
    component: () => import('pages/login/LoginPage.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/visualizarTreino',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },
  {
    path: '/gerenciarExercicios',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [{ path: '', component: () => import('pages/exercicio/ExercicioCatalogo.vue') }],
  },
  {
    path: '/gerenciarTreinos',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [{ path: '', component: () => import('pages/treino/GerenciarTreino.vue') }],
  },
  {
    path: '/cadastrarTreino/:id?',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [{ path: '', component: () => import('pages/treino/CreateEditTreino.vue') }],
  },
  {
    path: '/gerenciarPlanos',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [{ path: '', component: () => import('pages/plano/GerenciarPlanos.vue') }],
  },
  {
    path: '/cadastrarPlano',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [{ path: '', component: () => import('pages/plano/CreateEditPlano.vue') }],
  },
  {
    path: '/cadastrarPlano/:id',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [{ path: '', component: () => import('pages/plano/CreateEditPlano.vue') }],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
