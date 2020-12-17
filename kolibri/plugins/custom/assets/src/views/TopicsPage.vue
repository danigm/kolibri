<template>

  <div>
    <h1>Channels</h1>
    <div v-for="channel in channels">
        <router-link :to="{ name: 'CHANNEL', params: { id: channel.id } }">{{ channel.name }}</router-link>
    </div>
  </div>

</template>


<script>

  import { mapState } from 'vuex';
  import { ContentNodeKinds } from 'kolibri.coreVue.vuex.constants';
  import responsiveWindowMixin from 'kolibri.coreVue.mixins.responsiveWindowMixin';
  import TextTruncator from 'kolibri.coreVue.components.TextTruncator';
  import ProgressIcon from 'kolibri.coreVue.components.ProgressIcon';

  export default {
    name: 'TopicsPage',
    metaInfo() {
      return { title: 'Channels' };
    },
    components: {
      ProgressIcon,
      TextTruncator,
    },
    mixins: [responsiveWindowMixin],
    computed: {
      channels() {
        return this.$store.getters.getChannels;
      },
      channelTitle() {
        return this.channel.title;
      },
      topicOrChannel() {
        // Get the channel if we're root, topic if not
        return this.isRoot ? this.channel : this.topic;
      },
      getTagline() {
        return this.topicOrChannel['tagline'] || this.topicOrChannel['description'] || null;
      },
      calculateProgress() {
        // calculate progress across all topics
        const contentsLength = this.contents.length;
        if (contentsLength !== 0) {
          const computedSum =
            this.contents.map(content => content.progress).reduce((acc, val) => acc + val) /
            contentsLength;
          return computedSum !== 0 ? computedSum : undefined;
        }

        return undefined;
      },
    },
    methods: {
      genContentLink(id, kind) {
        const routeName =
          kind === ContentNodeKinds.TOPIC ? 'c' : 't';
        return {
          name: routeName,
          params: { id },
        };
      },
    },
    $trs: {
      documentTitleForChannel: 'Topics - { channelTitle }',
      documentTitleForTopic: '{ topicTitle } - { channelTitle }',
    },
  };

</script>


<style lang="scss" scoped>

  .header {
    margin-bottom: 40px;
  }

  .title {
    margin-top: 0;
    margin-bottom: 16px;
    font-size: 2rem;
  }

  .text {
    padding-left: 16px;
    margin-bottom: 16px;
    line-height: 1.5em;
  }

  /deep/.card-thumbnail-wrapper {
    max-width: 100%;
  }

</style>
