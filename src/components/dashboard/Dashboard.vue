<template>
  <div class="dashboard">

    <!-- <dashboard-info-widgets></dashboard-info-widgets> -->

    <vuestic-widget class="no-padding no-v-padding" :headerText="$t('tables.basic')">
      <vuestic-tabs :names="[$t('dashboard.dataVisualization'), $t('dashboard.usersAndMembers')]" ref="tabs">
        <div :slot="$t('dashboard.dataVisualization')">
          <data-visualisation-tab :result="this.result" :time="this.time"></data-visualisation-tab>
        </div>
        <div :slot="$t('dashboard.usersAndMembers')">
          <users-members-tab :result="this.result"></users-members-tab>
        </div>
        <!-- <div :slot="$t('dashboard.setupProfile')">
          <setup-profile-tab></setup-profile-tab>
        </div>
        <div :slot="$t('dashboard.features')">
          <features-tab></features-tab>
        </div> -->
      </vuestic-tabs>
    </vuestic-widget>

    <!-- <dashboard-bottom-widgets></dashboard-bottom-widgets> -->

  </div>
</template>

<script>
  import DashboardInfoWidgets from './DashboardInfoWidgets'
  import UsersMembersTab from './users-and-members-tab/UsersMembersTab.vue'
  // import SetupProfileTab from './setup-profile-tab/SetupProfileTab.vue'
  // import FeaturesTab from './features-tab/FeaturesTab.vue'
  import DataVisualisationTab from './data-visualisation-tab/DataVisualisation.vue'
  import DashboardBottomWidgets from './DashboardBottomWidgets.vue'
  import Bus from '@/bus.js';

  export default {
    name: 'dashboard',
    components: {
      DataVisualisationTab,
      DashboardInfoWidgets,
      UsersMembersTab,
      // SetupProfileTab,
      // FeaturesTab,
      DashboardBottomWidgets,
    },
    data() {
      return {
        result: [
          ['LCLT', 18],
          ['GST', 18],
          ['Lulu', 18],
          ['Keke', 18],
        ],
        time: null
      }
    },
    mounted() {
      var that = this;
      Bus.$on('resultChange', function (data, time) {
        // console.log('------dash------');
        // console.log(time);
        that.result = data;
        that.time = time;
      });
    },
    methods: {

    },
    beforeRouteEnter(to, from, next) {
      // 在渲染该组件的对应路由被 confirm 前调用
      // 不！能！获取组件实例 `this`
      // 因为当钩子执行前，组件实例还没被创建
      // console.log("hello1");
      // console.log(to, from);
      next(vm => {
        // console.log(to.query);
      })
    },
    beforeRouteUpdate(to, from, next) {
      // 在当前路由改变，但是改组件被复用时调用
      // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
      // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
      // 可以访问组件实例 `this`
      // console.log("hello2");
    },
    // beforeRouteLeave(to, from, next) {
    //   // 导航离开该组件的对应路由时调用
    //   // 可以访问组件实例 `this`
    //   console.log("hello3");
    // },
  }
</script>
<style lang="scss" scoped>
  @import "../../sass/_variables.scss";
</style>