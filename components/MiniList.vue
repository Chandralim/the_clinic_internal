<template>
  <div class="relative">

    <div v-if="selected.id==-1"  class="card-border cursor-pointer" @click="openSearch()">


    </div>
    <div v-else class="card-border cursor-pointer !flex flex-row flex-nowrap">
      <div class="flex flex-wrap items-center grow" @click="openSearch()"> 
        <div class="w-full">
          <span class=""> #{{ selected.id }}   </span>
          <span class=" ml-1"> {{ selected.name }}  </span>
        </div>
        <div v-if="selected.title" class="w-full">
          {{ selected.title || '' }}
        </div>
      </div>
      <button type="button" @click="selected = {...temp_selected}">
        <IconsTimes />
      </button>
    </div>

    <div v-show="open_search" class="fixed h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
      <div ref="search_box" class="w-[320px] h-full ring-1 ring-gray-500 p-2 bg-white flex flex-col">
        <input ref="search_words" type="text" v-model="search" placeholder="search" class="max-h-8"/>
        <div class="grow overflow-y-auto">
          <div v-for="(a,idx) in source" class="mt-3 flex border-[1px] border-solid border-gray-400 cursor-pointer" @click="selectIt(a)">
            <div class="p-1 flex flex-wrap items-center"> 
              <div class="w-full">
                <span class=""> #{{ a.id }}   </span>
                <span class=" ml-1"> {{ a.name }}  </span>
              </div>
              <div v-if="a.title" class="w-full">
                {{ a.title || '' }}
              </div>
            </div>
          </div>  

        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  arr: {
    type: Array<any>,
    required: true,
    default: [],
  },
  list: {
    type: Array,
    required: false,
    default: [],
  },
  
})

const open_search = ref(false);

const search_box = ref<HTMLElement | null>(null);
const search_words = ref<HTMLElement | null>(null);
const search = ref("");

const openSearch=()=>{
  setTimeout(()=>{
    open_search.value = true;
  },1);
  setTimeout(()=>{
    if(search_words?.value)
    search_words?.value.focus();
  },2);
}

if (process.client) {
  window.addEventListener('click', (e) => {
    const target = e.target;
    
    if (target instanceof Element && open_search.value) {
      // Now TypeScript knows that target is an Element
      if (!search_box.value?.contains(target)) {
        open_search.value = false;
      } 
    }
  });
}

const emit = defineEmits(['input','nextBlur']);
// const source = ref<Array<any>>([]);

const source = computed(()=>{
  if(search.value!="")  
  return props.arr.filter(
    (x:any)=>
    x.id.toString().toLowerCase().includes(search.value.toLowerCase()) ||
    x.name.toLowerCase().includes(search.value.toLowerCase()) ||
    x.title.toLowerCase().includes(search.value.toLowerCase())
  );
  else
  return props.arr;
});

const temp_selected = {
  id:-1,
  name:"",
  title:"",
};

const selected = ref({...temp_selected});

const selectIt = (a:any)=>{
  selected.value = a;
  open_search.value = false;
}
</script>
<style scoped>

</style>
