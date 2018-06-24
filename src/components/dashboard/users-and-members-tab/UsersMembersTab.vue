<template>
  <div class="users-members-tab dashboard-tab">
    <div class="d-flex overview-row flex-row w-100 justify-content-sm-around justify-content-xs-start">
      <div id="table-panel">
        <div class="table-responsive">
          <table class="table table-striped first-td-padding">
            <thead>
              <tr>
                <td>Start Node</td>
                <td>Relationship</td>
                <td>End Node</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="i in result">
                <td>{{ i[0] }}</td>
                <td>{{ i[1] }}</td>
                <td>{{ i[2] }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'users-members-tab',
    props: ['result'],
    data() {
      return {
         
        
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../sass/_variables.scss";
  @import "~bootstrap/scss/functions";
  @import "~bootstrap/scss/variables";
  @import "~bootstrap/scss/mixins/breakpoints";


  .vuestic-profile-card {
    margin-left: 1rem;

    @include media-breakpoint-up(md) {
      margin-top: -$tab-content-pt;
    }

    @include media-breakpoint-down(md) {
      margin-bottom: $tab-content-pt;
      margin-left: 0;
    }
  }

  #table-panel {
    width: 100%;
    min-height: 300px; // border: 1px solid grey;
    margin: 10px;
  }
</style>