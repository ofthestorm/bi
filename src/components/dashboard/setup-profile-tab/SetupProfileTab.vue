<template>
  <div class="setup-profile-tab dashboard-tab">
    <div class="d-flex overview-row flex-row w-100 justify-content-sm-around justify-content-xs-start">
      <div id="text-panel">
        <font>text-panel</font>
      </div>
    </div>
  </div>
</template>

<script>
  import CountriesList from 'data/CountriesList'

  export default {
    name: 'setup-profile-tab',

    props: {
      wizardType: {
        default: 'rich'
      }
    },

    data () {
      return {
        steps: [
          {
            label: 'Step 1. Name',
            slot: 'page1',
            onNext: () => {
              this.validateFormField('name')
            },
            isValid: () => {
              return this.isFormFieldValid('name')
            }
          },
          {
            label: 'Step 2. Country',
            slot: 'page2',
            onNext: () => {
              this.$refs.selectedCountrySelect.validate()
            },
            isValid: () => {
              return this.$refs.selectedCountrySelect.isValid()
            }
          },
          {
            label: 'Step 3. Confirm',
            slot: 'page3'
          }
        ],
        name: '',
        selectedCountry: '',
        countriesList: CountriesList
      }
    },
    methods: {
      isFormFieldValid (field) {
        let isValid = false
        if (this.formFields[field]) {
          isValid = this.formFields[field].validated && this.formFields[field].valid
        }
        return isValid
      },
      validateFormField (fieldName) {
        this.$validator.validate(fieldName, this[fieldName])
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../sass/_variables.scss";
  @import "~bootstrap/scss/functions";
  @import "~bootstrap/scss/variables";
  @import "~bootstrap/scss/mixins/breakpoints";

  .form-group {
    min-width: 200px;
    max-width: 360px;
    width: 80%;
  }

  .wizard-completed-tab {
    @include media-breakpoint-up(md) {
      margin-top: -$tab-content-pt;
    }
  }
  #text-panel {
    width: 100%;
    height: 300px;
    border: 1px solid grey;
    margin: 10px;
  }

</style>
