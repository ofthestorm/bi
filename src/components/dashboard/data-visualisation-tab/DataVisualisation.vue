<template>
  <div class="data-visualisation-tab dashboard-tab">
    <div class="d-flex overview-row flex-row w-100 justify-content-sm-around justify-content-xs-start">
      <div id="relation-graph-panel">
        <font>relation-graph-panel</font>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import BadgeColumn from 'components/tables/BadgeColumn.vue'
  import TableData from './TableData'
  import DonutChartData from './DonutChartData'
  import FieldsDef from './fields-definition'

  Vue.component('badge-column', BadgeColumn)

  export default {
    name: 'data-visualisation-tab',

    data () {
      return {
        donutChartData: DonutChartData,
        apiMode: false,
        sortFunctions: FieldsDef.sortFunctions,
        tableData: TableData,
        onEachSide: 1,
        tableFields: FieldsDef.tableFields,
        dataModeFilterableFields: ['name'],
        itemsPerPage: [
          {
            value: 5
          },
          {
            value: 6
          }
        ],
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../sass/_variables.scss";
  @import "~bootstrap/scss/functions";
  @import "~bootstrap/scss/variables";
  @import "~bootstrap/scss/mixins/breakpoints";

  .chart-container {
    padding: 0 2rem;
    height: 24rem;
  }
  #relation-graph-panel {
    width: 100%;
    height: 300px;
    border: 1px solid grey;
    margin: 10px;
  }

</style>
