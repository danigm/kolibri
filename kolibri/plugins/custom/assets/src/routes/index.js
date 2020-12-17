import store from 'kolibri.coreVue.vuex.store';
import router from 'kolibri.coreVue.router';
import TopicsPage from '../views/TopicsPage';
import ChannelPage from '../views/ChannelPage';

export default [
  {
    name: 'ROOT',
    path: '/',
    component: TopicsPage,
  },
  {
    name: 'CHANNEL',
    path: '/:id',
    component: ChannelPage,
  },
  {
    path: '*',
    redirect: '/',
  },
];
