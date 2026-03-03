<template>
  <div ref="wrapper" class="w-full flex flex-col flex-wrap p-1 justify-center items-center border-solid border-gray-300 border-[1px]">
      <div class="w-full">
        <label for="">{{label}}</label>
      </div>
      <div v-if="isLoading"  class="skeleton w-full" ></div>
      <div v-else class="w-full flex justify-center items-center flex-col">
        <div v-if="src" class="w-full flex justify-center items-center border-[1px] border-gray-300 mb-1">
          <div class="image-box">
            <img
              v-if="blob?.type.match(/image/)"
              :src="src"
              class="w-full h-full object-cover"
            />
            <LazyPDFJsView v-if="blob?.type.match(/application\/pdf/)"  :pdfObjUrl="objectUrl" />
          </div>
        </div>
        <button v-if="can_remove" type="button" v-show="src" class="bg-gray-600 w-36 text-white" @click="clearFile()">Clear</button>
        <input v-if="can_remove" class="w-full" v-show="!src" @change="changeFile($event)" ref="photo_input" type="file" name="photo">
      </div>
    </div>

    
</template>
  
<script setup lang="ts">
  // const props = defineProps<{
  //   link: string| null,
    
  // }>()

  const props = defineProps({
  link: {
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
  show: {
    type: Boolean,
    required: false,
    default: false
  },
  blob_file: {
    type: [File,String,Boolean],
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
const previewFileType = ref(null);

const wrapper = ref<HTMLElement | null>(null)
const src = ref<string | null>(null)
let objectUrl: string | null = null
const token = useDynamicPathCookie('token');
const { apiBase } = useApiBaseUrl();
const blob = ref();
const loadedOnce = ref(false)
const isUserFile = ref(false)
const isLoading = ref(true)

// const changeFile = ($e) => {
//   var files = $e.target.files;
//   if (files.length > 0) {
//     let reader = new FileReader();
//     reader.onload = function (e) {
//       let result = e.target?.result; //=>return base64/dataurl
//       previewFile.value = result;
//       emit('setPreview',result);
//     }
//     reader.readAsDataURL(files[0]);
//     emit('setFile',files[0]);
//   }
// };

const changeFile = ($e) => {
  const files = $e.target.files
  if (!files || !files.length) return
  
  isUserFile.value = true

  const file = files[0]           // ✅ ini File (turunan Blob)
  blob.value = file
  
  if (objectUrl) URL.revokeObjectURL(objectUrl)

  objectUrl = URL.createObjectURL(file) // ✅ AMAN
  src.value = objectUrl
  emit('setPreview',objectUrl);
  emit('setFile', file)
}

const clearFile = () => {
  unload(true)

  // 3. Reset input file
  const el = photo_input.value as HTMLInputElement | null
  if (el) el.value = ''

  // 4. Emit ke parent
  emit('setFile', null)
  emit('setPreview', null)
};



  watch(
  () => props.show,
  (val) => {
    // console.log("+showing",val);
    unload(true);
    // src.value = null
    // blob.value = null
    loadedOnce.value = false;
    isUserFile.value = false;
    // objectUrl=null;
    // console.log("-showing",val);

  },
  { immediate: true , deep:true}
)

  watch(
  () => props.link,
  (val) => {
    // console.log("+openlink");

    if (!val) return
    if (wrapper.value) {
      isLoading.value = true
      load()
    }
    // console.log("-openlink");

  },
  { immediate: true }
)


  async function  load() {
    // console.log("++++++trigger load");
    // console.log("props.link",props.link);
    // console.log("src.value",src.value);
    // console.log("isUserFile.value",isUserFile.value);
    // console.log("loadedOnce.value",loadedOnce.value);
    // console.log("------trigger load");

    if(props.link && props.link.includes('blob:http')){
      isUserFile.value = true
      src.value = props.link;
      blob.value = props.blob_file;
    }

    if (!props.link ||src.value || props.link=='Exists' || props.link.includes('blob:http') || isUserFile.value || loadedOnce.value) {
      isLoading.value = false;
      return
    }

    try {
      const url = props.link.startsWith('http')
      ? props.link
      : `${apiBase}${props.link}`

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token.value}`
        },
      })

      if (!res.ok) {
        let elPhotoInput = photo_input.value;
        if (elPhotoInput) {
          elPhotoInput.value = "";
        }
        return;
      }
    
      blob.value = await res.blob()
      objectUrl = URL.createObjectURL(blob.value)
      src.value = objectUrl
      loadedOnce.value = true
    } finally {
      isLoading.value = false
    }
  }
  
  function unload(force=false) {
    if ((isUserFile.value && force==false) || (loadedOnce.value && force==false)) return
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl)
      objectUrl = null
    }
    src.value = null
    blob.value = null
  }
  
  useLazyImage(wrapper, load, unload, {
    rootMargin: '300px 0px',
    threshold: 0
  })

  onUnmounted(()=>{
    loadedOnce.value = false
  })
</script>

<style scoped>
  .skeleton {
    aspect-ratio: 16/9;
    background: linear-gradient(
      90deg,
      #eee 25%,
      #ddd 37%,
      #eee 63%
    );
    background-size: 400% 100%;
    animation: shimmer 1.4s infinite linear;
  }

  @keyframes shimmer {
    0% {
      background-position: 100% 0;
    }
    100% {
      background-position: -100% 0;
    }
  }
</style>