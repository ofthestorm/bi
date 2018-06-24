<template>
  <div class="extra">
    <vuestic-widget  class="no-v-padding">
      <vuestic-tabs class="tabs" :names="[$t('extra.tabs.uploadFile'), $t('extra.tabs.newRelation')]">
        <div :slot="'extra.tabs.uploadFile' | translate" class="d-flex justify-content-center">
          <upload-file></upload-file>
        </div>
        <div :slot="'extra.tabs.newRelation' | translate" class="maps-tab">
          <new-relation></new-relation>
        </div>
      </vuestic-tabs>
    </vuestic-widget>
  </div>
</template>

<script>
  import UploadFile from 'components/extra/UploadFile.vue'
  import NewRelation from 'components/extra/NewRelation.vue'

  export default {
    name: 'extra',
    components: {
      UploadFile,
      NewRelation
    },
    data () {
      return {
      
      }
    }
  }
</script>

<style lang="scss" scoped>
  .tabs {
    .overview-tab {
      .explore-row {
        display: none !important;
      }
    }

    .maps-tab {
      height: 200px;
    }
  }

  .bottom-widgets {
    > div[class^='col'] {
      & > div {
        width: 100%;
      }
    }
  }
</style>
