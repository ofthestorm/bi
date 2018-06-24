<template>
  <div class="upload-file">
    <button class="file-upload-btn" type="button" onclick="$('.file-upload-input').trigger( 'click' )">Add Image</button>

    <div class="image-upload-wrap">
      <input class="file-upload-input" type='file' v-on:change="readURL($event)" />
      <div class="drag-text">
        <h3>Drag file here</h3>
      </div>
    </div>
    <p id="fileOutput"></p>
    <div class="file-upload-content">
      <img class="file-upload-image" src="#" alt="your image" />
      <div class="image-title-wrap">
        <button type="button" v-on:click="removeUpload()" class="remove-image">Remove
          <span class="image-title">Uploaded Image</span>
        </button>
      </div>
    </div>
  </div>



</template>
<script class="jsbin" src="https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>

<script>
  //   import LeafletMap from './LeafletMap'
  import $ from 'jquery'

  export default {
    name: 'upload-file',
    components: {
      //   LeafletMap
    },
    data() {
      return {
        fileContent: "",
      }
    },
    methods: {
      readURL: function (e) {

        var file = e.currentTarget.files[0];
        var reader = new FileReader();

        reader.readAsText(file);
        reader.onload = function (e) {
          // 这个事件发生，意为着数据准备好了
          var output = document.getElementById("fileOutput");
          output.textContent = e.target.result;
          $('.image-upload-wrap').hide();

          $('.file-upload-image').attr('src', e.target.result);
          $('.file-upload-content').show();

          $('.image-title').html(input.files[0].name);

        };

      },

      removeUpload: function () {
        $('.file-upload-input').replaceWith($('.file-upload-input').clone());
        $('.file-upload-content').hide();
        $('.image-upload-wrap').show();
      },

    },

    mounted() {
      this.$nextTick(function () {

        var self = this;
        //your code
        $('.image-upload-wrap').bind('dragover', function () {
          $('.image-upload-wrap').addClass('image-dropping');
        });

        $('.image-upload-wrap').bind('dragleave', function () {
          $('.image-upload-wrap').removeClass('image-dropping');
        });


      })

    }
  }
</script>

<style lang="scss">
  body {
    font-family: sans-serif;
    background-color: #eeeeee;
  }

  .upload-file {
    background-color: #ffffff;
    width: 600px;
    margin: 0 auto;
    padding: 20px;
  }

  .file-upload-btn {
    width: 100%;
    margin: 0;
    color: #fff;
    background: #1FB264;
    border: none;
    padding: 10px;
    border-radius: 4px;
    border-bottom: 4px solid #15824B;
    transition: all .2s ease;
    outline: none;
    text-transform: uppercase;
    font-weight: 700;
    outline: none;
  }

  .file-upload-btn:hover {
    background: #1AA059;
    color: #ffffff;
    transition: all .2s ease;
    cursor: pointer;
    outline: none;
  }

  .file-upload-btn:focus {
    outline: 0;
  }

  .file-upload-btn:active {
    // border: 0;
    transition: all .2s ease;
    outline: none;
  }

  .file-upload-content {
    display: none;
    text-align: center;
  }

  .file-upload-input {
    position: absolute;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    outline: none;
    opacity: 0;
    cursor: pointer;
  }

  .image-upload-wrap {
    margin-top: 20px;
    border: 4px dashed #1FB264;
    position: relative;
  }

  .image-dropping,
  .image-upload-wrap:hover {
    background-color: #1FB264;
    border: 4px dashed #ffffff;
  }

  .image-title-wrap {
    padding: 0 15px 15px 15px;
    color: #222;
  }

  .drag-text {
    text-align: center;
  }

  .drag-text h3 {
    font-weight: 100;
    text-transform: uppercase;
    color: #15824B;
    padding: 60px 0;
  }

  .file-upload-image {
    max-height: 200px;
    max-width: 200px;
    margin: auto;
    padding: 20px;
  }

  .remove-image {
    width: 200px;
    margin: 0;
    color: #fff;
    background: #cd4535;
    border: none;
    padding: 10px;
    border-radius: 4px;
    border-bottom: 4px solid #b02818;
    transition: all .2s ease;
    outline: none;
    text-transform: uppercase;
    font-weight: 700;
  }

  .remove-image:hover {
    background: #c13b2a;
    color: #ffffff;
    transition: all .2s ease;
    cursor: pointer;
  }

  .remove-image:active {
    border: 0;
    transition: all .2s ease;
  }
</style>