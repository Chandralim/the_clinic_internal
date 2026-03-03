<template>
    <div class="w-full flex flex-col flex-wrap p-1 justify-center items-center border-solid border-gray-300 border-[1px]">
      <div class="w-full">
        <label for="">{{label}}</label>
      </div>
      <div v-if="previewFile" class="w-full flex justify-center items-center border-[1px] border-gray-300 mb-1">
        
        <img v-if="previewFile.match(/image/)" :src="previewFile" alt="" class=" max-w-full max-h-full">        
        <LazyPDFJsView v-if="previewFile.match(/application\/pdf/)"  :pdfBase64="previewFile" />
        <!-- <iframe v-else ref="iframe" :src="previewFile+'#toolbar=0'" class=" max-w-full max-h-full w-full h-full aspect-square"></iframe> -->
      </div>

      <button v-if="can_remove" type="button" v-show="previewFile" class="bg-gray-600 w-36 text-white" @click="clearFile()">Clear</button>
      <input v-if="can_remove" class="w-full" v-show="!previewFile" @change="changeFile($event)" ref="photo_input" type="file" name="photo">

      <!-- <small>Upload file image : jpg, jpeg</small> -->
      <!-- <p class="help-err">{{ field_errors.photo }}</p> -->
    </div>
</template>

<script setup>
const props = defineProps({
  value: {
    type: [String,null],
    required: true,
    default: null,
  },
  label: {
    type: String,
    required: false,
    default:""
  },
  can_remove: {
    type: Boolean,
    required: false,
    default: false
  },

  // fn: {
  //   type: Function,
  //   required: false,
  // },
})
const emit = defineEmits(['setFile','setPreview']);

const photo = ref(false);
// const photo_input = ref<HTMLInputElement | null>(null);
const photo_input = ref(null);
const previewFile = ref(null);
const changeFile = ($e) => {
  var files = $e.target.files;
  if (files.length > 0) {
    let reader = new FileReader();
    reader.onload = function (e) {
      let result = e.target?.result;
      previewFile.value = result;
      emit('setPreview',result);
      //if (result.match(/image/)) {
      //  previewFile.value = result;
      //  emit('setPreview',result);
      //}else{
      //  // console.log(result);
      //  previewFile.value = "";
      //  emit('setPreview',"");
     // }
    }
    reader.readAsDataURL(files[0]);
    emit('setFile',files[0]);
  }

};


const clearFile = () => {
  previewFile.value = '';
  emit('setPreview',"");
  let elPhotoInput = photo_input.value;
  if (elPhotoInput) {
    elPhotoInput.value = "";
    emit('setFile',"");
  }
};
  
watch(() => props.show, (newVal, oldVal) => {

}, {
  immediate: true
});

watch(() => props.value, (newVal, oldVal) => {
  previewFile.value = newVal;
  if(newVal=="") {
    let elPhotoInput = photo_input.value;
    if (elPhotoInput) {
    elPhotoInput.value = "";
    }
  };
}, {
  immediate: true,
  deep:true
});

</script>
<style scoped>

</style>
