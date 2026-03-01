<template lang="html">
 <div v-if="show" class="w-full h-full flex items-center justify-center fixed top-0 left-0 z-20 p-3"
    style="background-color: rgba(255,255,255,0.9);">
    <div class="relative" style="width:95%; height: 90%;">
      <div class="absolute -top-7 right-0 bg-white"
        style="position: absolute; padding:5px 10px; border: solid 1px #ccc; border-bottom: none; border-top-right-radius: 5px;  border-top-left-radius: 5px;">
        <IconsTimes  style="color:black; cursor:pointer;" @click="$emit('close')"/>
      </div>
      <iframe ref="iframe" width='100%' height='100%' :src='pdfContent.dataBase64'></iframe>
      <div
        style="position: absolute; top: 12px; right: 88px; background-color: rgba(255,255,255,0); width: 37px; height: 36px; z-index:1; cursor: pointer;"
        @click="download()">
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
  pdfContent: {
    type: Object,
    required: false,
    default: '',
  },
})

const { downloadFile, viewFile } = useDownload();
const download = ()=>{
  downloadFile(props.pdfContent);
}
</script>
