<template>
  <template v-if="dclass.dref.value != undefined && dclass.dref.value != null && typeof dclass.dref.value=='object'">
    <template v-for="(x) in Object.keys(dclass.dref.value)" >
      <template v-if="dclass.kWithKey.indexOf(x)>-1">
        <div class="flex flex-col flex-wrap p-1">
          <label for="" class="text-xs">{{ dclass.textWithKey[x] || "" }}</label>
          <div class="flex">
            <div class="flex items-center pr-[1px]">
              <component
                v-if="dclass.iconWithKey[x]"
                :is="resolveComponent(dclass.iconWithKey[x])" />
            </div>
            <div>
              {{ dclass.dref.value[x]  }}
            </div>
          </div>
        </div>
      </template>
    </template>
  </template>
</template>

<script lang="ts" setup>
const props = defineProps({
  dclass:{
    type:Object,
    required:true,
  },
})
</script>