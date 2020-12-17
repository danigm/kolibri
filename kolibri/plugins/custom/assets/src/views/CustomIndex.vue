<template>
  <CoreBase
    :immersivePage="false"
    :immersivePagePrimary="true"
    :debug="true"
  >

  <router-view />

  </CoreBase>
</template>


<script>

  import store from 'kolibri.coreVue.vuex.store';
  import { mapGetters, mapState } from 'vuex';
  import urls from 'kolibri.urls';
  import lastItem from 'lodash/last';
  import commonCoreStrings from 'kolibri.coreVue.mixins.commonCoreStrings';
  import responsiveWindowMixin from 'kolibri.coreVue.mixins.responsiveWindowMixin';
  import CoreBase from 'kolibri.coreVue.components.CoreBase';
  import plugin_data from 'plugin_data';
  import { ContentNodeResource, ContentNodeProgressResource } from 'kolibri.resources';

  export default {
    name: 'CustomIndex',
    components: {
      CoreBase,
    },
    mixins: [commonCoreStrings, responsiveWindowMixin],
    data() {
      return {
      };
    },
    computed: {
      ...mapState({
        session: state => state.core.session,
      }),
    },
    watch: {
    },
    mounted() {
      // window.store = store;
      window.store = store;
      store.commit('CORE_SET_PAGE_LOADING', true);
      store.dispatch('setChannelInfo').then(
        channels => {
          store.commit('SET_CORE_CHANNEL_LIST', channels);
          store.commit('CORE_SET_PAGE_LOADING', false);
        },
        error => {
          store.dispatch('handleApiError', error);
          return error;
        }
      );
    },
    methods: {
    },
    $trs: {
    },
  };

</script>
