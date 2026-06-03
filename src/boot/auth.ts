import { boot } from 'quasar/wrappers';
import { setupRouterGuards } from '../router/guards';

export default boot(({ router }) => {
  // Configura os guards de rota após Pinia estar ready
  setupRouterGuards(router);
});
