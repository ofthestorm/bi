<template>
  <div class="widget" :class="{'no-header': !headerText}">
    <div class="widget-header" v-if="headerText">
      {{headerText}}
      <div class="span-list">
        <span aria-hidden="true" v-on:click="onRefreshClick" class="fa fa-refresh" style="font-size: 20px;"></span>
        <span aria-hidden="true" v-on:click="onDownloadClick" class="fa fa-download" style="font-size: 20px;"></span>
        <span v-if="isStar" v-on:click="onStarClick" aria-hidden="true" class="fa fa-star" style="font-size: 20px;"></span>
        <span v-else v-on:click="onStarClick" aria-hidden="true" class="fa fa-star-o" style="font-size: 20px;"></span>
      </div>
    </div>
    <div class="widget-body">
      <slot></slot>

    </div>
  </div>
</template>

<script>
  import Bus from '@/bus.js';
  export default {
    name: 'vuestic-widget',
    props: ['headerText'],
    data() {
      return {
        isStar: false,
      }
    },
    methods: {
      onStarClick: function () {
        this.isStar = !this.isStar;
        if (this.isStar) {
          // this.$emit('star', '');
          Bus.$emit('loadSuccess', 'star');
        }
      },
      onDownloadClick: function () {
        Bus.$emit('download', 'star');
      },
      onRefreshClick: function () {
        Bus.$emit('refresh', 'star');
      },
    }
  }
</script>

<style lang="scss">
  @import "../../../sass/_variables.scss";

  .widget {
    background: $widget-bg;
    box-shadow: $widget-box-shadow;
    margin-bottom: $widget-mb;
    padding: 0;

    &.no-header {
      .widget-body {
        height: $widget-body-no-header-height;
      }
    }

    &.larger-padding {
      .widget-body {
        padding: $widget-larger-padding;
      }
    }

    &.no-h-padding {
      .widget-body {
        padding-left: 0;
        padding-right: 0;
      }
    }

    &.no-v-padding {
      .widget-body {
        padding-top: 0;
        padding-bottom: 0;
      }
    }

    &.brand-info {
      background-color: $brand-info;
      color: $white;
      box-shadow: $widget-info-shadow;
    }

    &.brand-danger {
      background-color: $brand-danger;
      color: $white;
      box-shadow: $widget-danger-shadow;
    }

    &.info-widget {
      border-top: $info-widget-border;

      &.brand-info {
        border-top-color: $brand-info;
      }

      &.brand-danger {
        border-top-color: $brand-danger;
      }
    }

    .widget-body {
      height: $widget-body-with-header-height;
      padding: $widget-padding;
    }

    .widget-header {
      height: $widget-header-height;
      padding: 0 $widget-padding;
      margin-left: 10px;
      border-bottom: $widget-header-border;
      font-size: $font-size-larger;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      .span-list {
        span {
          margin-right: 10px;
        }
      }
    }
  }
</style>