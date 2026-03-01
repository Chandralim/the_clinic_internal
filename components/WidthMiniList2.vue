<template>
  <div class="relative">
    <div v-if="dclass.dref.value == null || Object.keys(dclass.dref.value).length==0"  class="card-border cursor-pointer" @click="fnOpen()">


    </div>
    <div v-else class="card-border cursor-pointer !flex flex-row flex-nowrap">
      <div class="flex flex-wrap items-center grow" @click="fnOpen()">
        <div class="w-full flex flex-row flex-wrap">
          <WidthMiniPart2 :dclass="dclass" />
        </div>
        
      </div>
      <div class="flex items-center">
        <button type="button" class="bg-red-500 text-white border-none" @click="clearIt()">
          <IconsTimes />
        </button>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  fnOpen: {
    type: Function,
    required: true,
  },
  dclass:{
    type:Object,
    required:true,
  },
})

const clearIt = () => {
  props.dclass.build();
}
</script>
<style scoped>

</style>
