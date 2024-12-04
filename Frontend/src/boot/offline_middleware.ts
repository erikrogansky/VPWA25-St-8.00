import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { Router } from 'vue-router';
import { api } from 'src/boot/axios';

export default ({router}: {router: Router;}) => {
  let lastOnlineRoute = '/';

  async function isServerOnline() {
    try {
      const response = await api.get('/ping');
      return response.status === 200
    } catch (error) {
      return false;
    }
  }

  router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    if (to.path === '/') {
      return next();
    }

    const serverOnline = await isServerOnline();

    if (!serverOnline) {
      if (to.path !== '/offline') {
        return next('/offline');
      }
    } else {
      if (to.path === '/offline' && lastOnlineRoute) {
        return next(lastOnlineRoute);
      }
      lastOnlineRoute = to.path;
    }

    next();
  });
};
