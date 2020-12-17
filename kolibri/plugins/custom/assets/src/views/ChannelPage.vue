<template>
  <iframe
    ref="iframe"
    class="iframe"
    frameBorder="0"
    name="name"
    :src="rooturl"
  >
  </iframe>
</template>


<script>
  import { ContentNodeSearchResource } from 'kolibri.resources';
  import { ContentNodeKinds } from 'kolibri.coreVue.vuex.constants';

  import { now } from 'kolibri.utils.serverClock';
  import CoreFullscreen from 'kolibri.coreVue.components.CoreFullscreen';
  import Hashi from 'hashi';
  import { nameSpace } from 'hashi/src/hashiBase';
  import plugin_data from 'plugin_data';
  import { ContentNodeResource } from 'kolibri.resources';
  import { getContentNodeThumbnail } from 'kolibri.utils.contentNode';
  import axios from 'axios';

  export default {
    name: 'ChannelPage',
    data() {
      return {
        rooturl: '',
      };
    },
    components: {
    },
    computed: {
    },
    methods: {
      sendChannelInformation() {
        if (!this.$refs.iframe) {
          return;
        }
        const iframeWindow = this.$refs.iframe.contentWindow;
        const channel = this.$store.state.topicsTree.channel;
        const currentNodeId = this.$store.state.topicsTree.content.id;

        ContentNodeResource.fetchCollection({
          getParams: {
            channel_id: channel.id,
            user_kind: this.$store.getters.getUserKind,
          },
        }).then((nodes) => {
          const promises = nodes.filter((node) => {
            return node.id !== currentNodeId;
          });

          Promise.all(promises).then((nodes) => {
            const event = 'sendChannelInformation';
            const message = {
              event,
              nameSpace,
              data: {channel, nodes},
            };
            iframeWindow.postMessage(message, '*');
          });
        });
      },

      sendThumbnail(id) {
        const iframeWindow = this.$refs.iframe.contentWindow;
        const event = 'sendThumbnail';
        ContentNodeResource.fetchModel({ id }).then((node) => {
          const thumbnailUrl = getContentNodeThumbnail(node);
          if (!thumbnailUrl) {
            const message = {
              event,
              nameSpace,
              data: {id, thumbnail: null},
            };
            iframeWindow.postMessage(message, '*');
            return;
          }
          const promise = axios.get(thumbnailUrl, {responseType: 'arraybuffer'}).then((response) => {
              const returnedB64 = Buffer.from(response.data).toString('base64');
              const thumbnail = "data:" + response.headers["content-type"] + ";base64," + returnedB64;
              return thumbnail;
          });
          promise.then((thumbnail) => {
            const message = {
              event,
              nameSpace,
              data: {id, thumbnail},
            };
            iframeWindow.postMessage(message, '*');
          });
        });
      },

      goToContent(id) {
        this.$router.push({ name: 'TOPICS_CONTENT', params: { id }});
      },

      recordProgress() {
        const totalTime = now() - this.startTime;
        const hashiProgress = this.hashi ? this.hashi.getProgress() : null;
        this.$emit(
          'updateProgress',
          hashiProgress === null ? Math.max(0, totalTime / 300000) : hashiProgress
        );
        this.pollProgress();
      },
      pollProgress() {
        this.timeout = setTimeout(() => {
          this.recordProgress();
        }, 15000);
      },
    },
    mounted() {
      const getParams = {
        search: 'custom-channel-ui',
        kind: ContentNodeKinds.HTML5,
        channel_id: this.$route.params.id,
      };
      ContentNodeSearchResource.getCollection(getParams)
      .fetch()
        .then(({ results }) => {
            const zip = results[0].files[0];
            const url = results[0].files[0].storage_url;
            this.rooturl = url;
      });

      window.addEventListener('message', event => {
        if (!event.data.event || !event.data.nameSpace || event.data.nameSpace !== 'customChannelPresentation') {
          return;
        }
        if (event.data.event === 'askChannelInformation') {
          if (!this.isInFullscreen) {
            this.$refs.html5Renderer.toggleFullscreen();
          }
          this.sendChannelInformation();
        }
        if (event.data.event === 'goToContent') {
          if (this.isInFullscreen) {
            this.$refs.html5Renderer.toggleFullscreen();
          }
          this.goToContent(event.data.data);
        }
        if (event.data.event === 'getThumbnail') {
          this.sendThumbnail(event.data.data);
        }
      });

      this.hashi = new Hashi({ iframe: this.$refs.iframe, now });
      this.hashi.onStateUpdate(data => {
        this.$emit('updateContentState', data);
      });
      this.hashi.initialize(
        (this.extraFields && this.extraFields.contentState) || {},
        this.userData
      );
      this.$emit('startTracking');
      this.startTime = now();
      this.pollProgress();
    },
    beforeDestroy() {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.$emit('stopTracking');
    },
  };

</script>

<style lang="scss" scoped>

  .iframe {
    width: 100%;
    height: 100vh;
  }

</style>
