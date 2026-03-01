<template>
  <template v-for="key in Object.keys(selected._)" >
    <div v-if="selected._[key].val" class="flex flex-col flex-wrap p-1">
      <label for="" class="text-xs">{{selected._[key].text}}</label>
      <div class="flex">
        <div class="flex items-center pr-[1px]">
          <component
            v-if="selected._[key].tcon"
            :is="resolveComponent(selected._[key].tcon)" />
        </div>
        <div>
          {{ selected._[key].val  }}
        </div>
      </div>
    </div>
  </template>
</template>

<script lang="ts" setup>
const props = defineProps({

  selected:{
    type:Object,
    required:false,
    default:{
      _:{},
      id:-1,
      name:"",
      title:"",
    }
  }
  
})
</script>