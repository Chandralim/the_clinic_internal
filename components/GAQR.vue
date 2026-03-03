<template lang="html">
  <div v-if="show" class="flex items-center justify-center fixed top-0 left-0 z-10 p-3 w-full h-full bg-black bg-opacity-80">
    <div class="flex items-center max-w-xs w-full relative bg-white border-solid border-gray-600 border-2 p-3 flex-col flex-wrap">
      <div class="absolute -top-7 right-0 py-1 px-2 bg-white border-solid border-2 border-gray-600 border-b-0 rounded-tl-md">
        <IconsTimes class="text-2xl text-black cursor-pointer"  @click="fnClose()"/>      
      </div>
      <div class="w-full">
        <img class="w-full aspect-square" :src='qrCodeUrl' alt="">
      </div>
     <div class="flex w-full justify-between mt-5">
        <button @click="fnClose()" class="w-full bg-blue-500 border-blue-500 border-solid border-2 p-1 text-white mr-2"> 
          Close 
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  fnClose: {
    type: Function,
    required: true,
  },
  qrCodeUrl:{
    type: String,
    required: false,
  },
})

// watch(()=>props.show,(newVal, oldVal) => {

// }, {
//   immediate: true,
//   deep:true
// });
</script>
