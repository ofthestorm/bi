<template>
  <div class="new-relation">
    <div class="row">
      <div class="col-md-3">
        <fieldset>
          <div class="form-group">
            <div class="input-group">
              <input id="simple-input" v-bind="obj1" placeholder="object1">
              <i class="bar"></i>
            </div>
          </div>
        </fieldset>
      </div>
      <div class="col-md-3">
        <fieldset>
          <div class="form-group">
            <div class="input-group">
              <input id="simple-input" v-bind="relation" placeholder="relation">
              <i class="bar"></i>
            </div>
          </div>
        </fieldset>
      </div>
      <div class="col-md-3">
        <fieldset>
          <div class="form-group">
            <div class="input-group">
              <input id="simple-input" v-bind="obj2" placeholder="object2">
              <i class="bar"></i>
            </div>
          </div>
        </fieldset>
      </div>
      <div id="searchBtn" class="col-md-3 d-flex justify-content-center align-items-center">
        <button class="btn btn-primary btn-micro" v-on:click="onSubmitBtnClick">
          {{'buttons.submit' | translate}}
        </button>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    name: 'new-relation',
    components: {
      //   LeafletMap
    },
    data() {
      return {
        obj1: "",
        obj2: "",
        relation: ""
      }
    },
    methods: {
      onSubmitBtnClick: function () {
        var params = {
          obj1: this.obj1,
          obj2: this.obj2,
          relation: this.relation
          }
        
      },
    },

    mounted() {}
  }
</script>

<style lang="scss">
</style>