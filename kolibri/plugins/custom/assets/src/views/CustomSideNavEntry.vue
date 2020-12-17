<template>

  <CoreMenuOption
    label="Custom Link!"
    :link="url"
    icon="learn"
  />

</template>


<script>

  import CoreMenuOption from 'kolibri.coreVue.components.CoreMenuOption';
  import navComponents from 'kolibri.utils.navComponents';
  import urls from 'kolibri.urls';

  const component = {
    name: 'CustomSideNavEntry',
    components: {
      CoreMenuOption,
    },
    $trs: {},
    computed: {
      url() {
        return urls['kolibri:kolibri.plugins.custom:custom']();
      },
    },
    priority: 10,
  };

  navComponents.register(component);

  export default component;

</script>
