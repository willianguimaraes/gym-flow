import type { Router } from 'vue-router';
import { useAuthStore } from '../stores/auth';

export function setupRouterGuards(router: Router) {
  let initialized = false;

  router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();

    // Na primeira navegação, recupera o token do localStorage
    if (!initialized) {
      authStore.checkAuth();
      initialized = true;
    }

    const isAuthRequired = to.matched.some(record => record.meta?.requiresAuth);

    if (isAuthRequired) {
      if (authStore.isLoggedIn) {
        next();
      } else {
        next('/login');
      }
    } else if (to.path === '/login' && authStore.isLoggedIn) {
      // Se está indo para login e já está autenticado, redireciona para home
      next('/');
    } else {
      next();
    }
  });
}
