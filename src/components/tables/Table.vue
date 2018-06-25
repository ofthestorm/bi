<template>
  <div>
    <div class="row">
      <div class="col-xs-12 col-md-12">
        <vuestic-widget>
          <div class="table-responsive" v-if="isAlive">
            <table class="table table-striped first-td-padding">
              <thead>
                <tr>
                  <td>Type</td>
                  <td>Limit</td>
                  <td>Start Node</td>
                  <td>Relationship</td>
                  <td>End Node</td>
                  <td>Step Number</td>
                  <td>Run</td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="i in tableData">
                  <td>{{ i.type }}</td>
                  <td>{{ i.limit }}</td>
                  <td>{{ i.start }}</td>
                  <td>{{ i.relation }}</td>
                  <td>{{ i.end }}</td>
                  <td>{{ i.step }}</td>
                  <td v-on:click="runStar(i)">▶️</td>
                </tr>
              </tbody>
            </table>
          </div>
        </vuestic-widget>
        <!-- <dashboard></dashboard> -->
      </div>
    </div>

  </div>
</template>

<script>
  import Vue from 'vue'
  import BadgeColumn from './BadgeColumn.vue'
  import FieldsDef from 'vuestic-components/vuestic-datatable/data/fields-definition'
  import ItemsPerPageDef from 'vuestic-components/vuestic-datatable/data/items-per-page-definition'
  import QueryParams from 'vuestic-components/vuestic-datatable/data/query-params'
  // import Dashboard from './dashboard/Dashboard.vue'
  import Dashboard from 'components/dashboard/Dashboard.vue'

  import Bus from '@/bus.js';
  import Router from 'vue-router'

  Vue.component('badge-column', BadgeColumn)

  export default {
    name: 'Table',
    components: {
      Dashboard
    },
    data() {
      return {
        tableData: [{
            type: "start_relation",
            limit: 25,
            start: "Tencent",
            relation: "industry",
            end: "",
            step: null
          },
          {
            type: "start_n",
            limit: 25,
            start: "Tencent",
            relation: "",
            end: "",
            step: 5
          },
          {
            type: "start_end",
            limit: 25,
            start: "Greater_China",
            relation: "",
            end: "Online_service",
            step: null
          },
          {
            type: "relation",
            limit: 25,
            start: "",
            relation: "industry",
            end: "",
            step: null
          },
          {
            type: "reg_exp",
            limit: 25,
            start: "mahuateng",
            relation: "",
            end: "",
            step: null
          },
          {
            type: "relation",
            limit: 25,
            start: "",
            relation: "birthPlace",
            end: "",
            step: null
          },
          {
            type: "start_n",
            limit: 25,
            start: "Tencent",
            relation: "",
            end: "",
            step: 1
          },
        ],
        isAlive: true
      }
    },
    watch: {
      tableData: function (val, oldVal) {
        // console.log('~');
      }
    },
    methods: {
      reload() {
        this.isAlive = false
        this.$nextTick(() => (this.isAlive = true))
      },
      $refresh: function () {
        this.id = +new Date()
      },
      runStar(val) {
        // console.log(val);
        Bus.$emit('runStar', val);
        this.$router.push({
          path: '/dashboard',
          query: val
        });
      }
    },
    mounted() {
      var that = this;
      Bus.$on('inputData', (params) => {
        // this.p = params
        // console.log(params);
        // that.tableData.push(params);
        // console.log(that.tableData.length);
        // this.$set(this.test[0].array, 0, 9);

        // FIXME: array 视图无法更新
        // that.setArray();
        // that.$set(that.tableData, that.tableData.length, params)
        that.tableData.splice(0, 1, params)
        // that.reload()
        // console.log(that.tableData);
      });
    },
    beforeRouteLeave(to, from, next) {
      // 导航离开该组件的对应路由时调用
      // 可以访问组件实例 `this`
      // console.log(to.query);
      Bus.$emit('routeChange', to.query)
      next(vm => {
        // console.log(to);
      })
    },
  }
</script>

<style lang="scss">
  .color-icon-label-table {
    td:first-child {
      width: 1rem;
    }
  }
</style>