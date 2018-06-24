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
            <div class="col-md-2">
              <fieldset>
                <div class="form-group">
                  <div class="input-group">
                    <input id="simple-input" v-model="limit" placeholder="limit">
                    <i class="bar"></i>
                  </div>
                </div>
              </fieldset>
            </div>
            <div v-if="isSingleInput" class="col-md-6">
              <fieldset>
                <div class="form-group">
                  <div v-if="selectValue=='relation'" class="input-group">
                    <input id="simple-input" v-model="relation" placeholder="relation">
                    <i class="bar"></i>
                  </div>
                  <div v-if="selectValue=='reg_exp'" class="input-group">
                    <input id="simple-input" v-model="reg" placeholder="regular expression">
                    <i class="bar"></i>
                  </div>
                </div>
              </fieldset>
            </div>
            <div v-if="!isSingleInput" class="col-md-3">
              <fieldset>
                <div class="form-group">
                  <div class="input-group">
                    <input v-if="selectValue=='start_relation'" id="simple-input" v-model="start1" placeholder="start node">
                    <input v-if="selectValue=='start_n'" id="simple-input" v-model="start2" placeholder="start node">
                    <input v-if="selectValue=='start_end'" id="simple-input" v-model="start3" placeholder="start node">
                    <i class="bar"></i>
                  </div>
                </div>
              </fieldset>
            </div>
            <div v-if="!isSingleInput" class="col-md-3">
              <fieldset>
                <div class="form-group">
                  <div class="input-group">
                    <input v-if="selectValue=='start_relation'" id="simple-input" v-model="relation1" placeholder="relation">
                    <input v-if="selectValue=='start_n'" id="simple-input" v-model="n2" placeholder="step number">
                    <input v-if="selectValue=='start_end'" id="simple-input" v-model="end3" placeholder="end node">
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
  import axios from 'axios'
  import Bus from '@/bus.js';


  export default {
    name: 'vuestic-breadcrumbs',
    props: {
      breadcrumbs: {
        type: Array,
        default: []
      }
    },
    mounted() {
      var that = this;
      Bus.$on('runStar', function (msg) {
        console.log("------runStar------");
        console.log(msg);
        console.log("------runStar------");
      })
      Bus.$on('routeChange',function (msg) {
        console.log("------routeChange------");
        console.log(msg);
        console.log("------routeChange------");
        that.onStarRun(msg);
      })
      Bus.$on('loadSuccess', function (msg) {
        console.log(that.selectValue);
        var params = {
          type: that.selectValue,
          limit: that.limit,
          start: "",
          relation: "",
          end: "",
          step: ""
        }
        switch(params.type) {
          case 'relation':
            {
              params.relation = that.relation;
              break;
            }
          case 'start_relation':
            {
              params.relation = that.relation1;
              params.start = that.start1;
              break;
            }
          case 'start_n':
            {
              params.step = that.n2;
              params.start = that.start2;
              break;
            }
          case 'start_end':
            {
              params.end = that.end3;
              params.start = that.start3;
              break;
            }
          case 'reg_exp':
            {
              params.start = that.reg;
              break;
            }
        }
        // console.log(params);
        Bus.$emit('inputData',params);
      })
    },
    data() {
      return {
        simpleOptions: [{
            id: 1,
            description: 'relation',
          },
          {
            id: 2,
            description: 'start_relation',
          },
          {
            id: 3,
            description: 'start_n',
          },
          {
            id: 4,
            description: 'start_end',
          },
          {
            id: 5,
            description: 'reg_exp',
          },
        ],

        limit: null,
        inputType: "relation",
        selectValue: "relation",
        relation: "",
        reg: "",
        start1: "",
        relation1: "",
        start2: "",
        n2: null,
        start3: "",
        end3: "",

        result: null
      }
    },
    computed: {
      isSingleInput: function () {
        if (this.selectValue == 'relation' || this.selectValue == 'reg_exp') {
          return true;
        } else {
          return false;
        }
      },
    },
    methods: {
      reset: function () {
        limit = 25;
        relation = "";
        reg = "";
        start1 = "";
        relation1 = "";
        start2 = "";
        n2 = "";
        start3 = "";
        end3 = "";
        msg = "";
      },
      listenToSelect: function (data) {
        this.selectValue = data
      },
      onSearchBtnClick: function () {
        var self = this
        if (!(this.limit)) {
          this.limit = 25;
        }
        var params = {
          limit: null,
          start_node: '',
          relationship: '',
          step_number: null,
          end_node: ''
        }
        var url = "";
        params.limit = this.limit;
        switch (this.selectValue) {
          case 'relation':
            {
              params.relationship = this.relation;
              url = 'get_relationship_nodes/'
              break;
            }
          case 'start_relation':
            {
              params.start_node = this.start1;
              params.relationship = this.relation1;
              url = 'get_relationship_nodes/'
              break;
            }
          case 'start_n':
            {
              params.start_node = this.start2;
              params.step_number = this.n2;
              url = 'n_step_object/'
              break;
            }
          case 'start_end':
            {
              params.start_node = this.start3;
              params.end_node = this.end3;
              url = 'two_step_start_end/'
              break;
            }
          case 'reg_exp':
            {
              // ???
              params.start_node = this.reg;
              url = 'like_search_node/'
              break;
            }
        }
        url = 'http://172.20.10.5:8888/' + url;
        //ajax
        // axios.get('http://localhost:8081/' + this.script).then(response => {
        //   this.data = response.data.result
        //   this.loadGraph()
        // }, response => {
        //   this.$message({
        //     duration: 1000,
        //     message: 'server connect error',
        //     type: 'error'
        //   })
        // })
        axios.post(url, params).then(function (response) {
            self.result = response.data.result
            // console.log('!!!!');
            // console.log(self.result);
            // console.log('!!!!');
            Bus.$emit('resultChange',self.result);
            // vm.reset();
          })
          .catch(function (error) {
            console.log(params)
            console.log(error);
          });

      },
      onStarRun: function (msg) {
        var params = {
          limit: null,
          start_node: "",
          relationship: "",
          step_number: null,
          end_node: ""
        }
        var url = "";
        params.limit = msg.limit;
        console.log('msg:');
        console.log(msg);
        switch (msg.type) {
          case 'relation':
            {
              params.relationship = msg.relation;
              url = 'get_relationship_nodes/'
              break;
            }
          case 'start_relation':
            {
              params.start_node = msg.start;
              params.relationship = msg.relation;
              url = 'get_relationship_nodes/'
              break;
            }
          case 'start_n':
            {
              params.start_node = msg.start;
              params.step_number = msg.step;
              url = 'n_step_object/'
              break;
            }
          case 'start_end':
            {
              params.start_node = msg.start;
              params.end_node = msg.end;
              url = 'two_step_start_end/'
              break;
            }
          case 'reg_exp':
            {
              // ???
              params.start_node = msg.start;
              url = 'like_search_node/'
              break;
            }
        }
        console.log('~~~~~~~~');
        console.log(params);
        console.log('~~~~~~~~');
        axios.post(url, {
            params
          })
          .then(function (response) {
            console.log(response);
            this.result = response.result;
            Bus.$emit('resultChange',result);
            reset();
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