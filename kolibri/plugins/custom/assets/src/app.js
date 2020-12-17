import router from 'kolibri.coreVue.router';
import RootVue from './views/CustomIndex';
import routes from './routes';
import KolibriApp from 'kolibri_app';

class CustomModule extends KolibriApp {
  get routes() {
    return routes;
  }
  get RootVue() {
    return RootVue;
  }
}

export default new CustomModule();
