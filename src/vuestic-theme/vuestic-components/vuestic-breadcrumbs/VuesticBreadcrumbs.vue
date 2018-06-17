<template>
  <div class="row">
    <div class="col-md-12">
      <vuestic-widget class="no-padding no-v-padding">
        <div class='vuestic-breadcrumbs'>
          <div class="row">
            <div class="col-md-2">
              <fieldset>
                <vuestic-simple-select v-on:displayValue="listenToSelect" :label="'forms.selects.simple' | translate" v-model="simpleSelectModel"
                  option-key="description" v-bind:options="simpleOptions">
                </vuestic-simple-select>
              </fieldset>
            </div>
            <div v-if="selectValue=='Script'" class="col-md-8">
              <fieldset>
                <div class="form-group">
                  <div class="input-group">
                    <input id="simple-input" v-bind="script" placeholder="script">
                    <i class="bar"></i>
                  </div>
                </div>
              </fieldset>
            </div>
            <div v-if="selectValue=='Object'" class="col-md-4">
              <fieldset>
                <div class="form-group">
                  <div class="input-group">
                    <input id="simple-input" v-bind="obj1" placeholder="object2">
                    <i class="bar"></i>
                  </div>
                </div>
              </fieldset>
            </div>
            <div v-if="selectValue=='Object'" class="col-md-4">
              <fieldset>
                <div class="form-group">
                  <div class="input-group">
                    <input id="simple-input" v-bind="obj2" placeholder="object 2">
                    <i class="bar"></i>
                  </div>
                </div>
              </fieldset>
            </div>
            <div id="searchBtn" class="col-md-2 d-flex justify-content-center align-items-center">
              <button class="btn btn-primary btn-micro" v-on:click="onSearchBtnClick">
                {{'buttons.run' | translate}}
              </button>
            </div>
          </div>
        </div>
      </vuestic-widget>
    </div>
  </div>
</template>

<script>
  import 'axios'

  export default {
    name: 'vuestic-breadcrumbs',
    props: {
      breadcrumbs: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        simpleOptions: [{
            id: 1,
            description: 'Script',
          },
          {
            id: 2,
            description: 'Object',
          },
        ],
        isScript: true,
        selectValue: "Script",
        script: "",
        obj1: "",
        obj2: "",
      }
    },
    // watch: {

    // },
    methods: {
      listenToSelect: function (data) {
        this.selectValue = data
      },
      onSearchBtnClick: function () {
        //ajax
        axios.get('', {
            params: {
              ID: 12345
            }
          })
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });

      },
    }
  }
</script>

<style lang='scss' scoped>
  @import '../../../sass/variables';

  .vuestic-breadcrumbs {

    height: $breadcrumbs-height;
    display: flex; // align-items: center;
    .crumb {
      &.disabled {
        pointer-events: none;
      }
      &:last-child::after {
        display: none;
      }

      &::after {
        padding: 0 5px;
        display: inline-block;
        content: $breadcrumbs-arrow-content;
        vertical-align: middle;
        color: $brand-primary;
        font-size: $breadcrumbs-arrow-font;
        font-family: FontAwesome;
      }
    }

    a {
      color: $breadcrumbs-gray;
      &:hover {
        color: $brand-primary;
      }
    } // input {
    //   border-color: #cfdc00;
    //   &:focus {
    //     outline: none; // border-color: #cfdc00;  
    //     // box-shadow: 0 0 5px rgba(207, 220, 0, 0.4);  
    //     // border-radius: 5px;  
    //   }
    // }
    .row {
      width: 100%;
    }
  } // vuestic-simple-select {
  //   z-index: 100;
  // }
  // input[type=checkbox]:disabled+label,
  // input[type=radio]:disabled+label,
  // input[type=checkbox]:disabled,
  // input[type=radio]:disabled {
  //   cursor: not-allowed;
  // }
  fieldset {
    // margin-right: 10px;
    margin-top: 10px;
  }
</style>