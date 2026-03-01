<template>
  <div ref="slt_mul" class="relative" @blur="focused=false">
    <input type="text" v-model="search" @focus="focused=true">

    <div v-show="!focused" class="bg-white w-full flex flex-row flex-wrap mt-1">
      <div v-for="(a,idx) in arr.filter((x)=>x.checked)" class="p-1 flex" >
        <div class="flex items-center">
          <button v-show="a.checked" type="button" class="text-white bg-green-500 text-sm" @click="toggle(a)"> 
            <IconsCheck />
          </button> 
        </div>
        <div class="pl-1 flex flex-wrap items-center"> 
          <div class="w-full">
            <span class="font-bold"> #{{ a.name }}</span>
          </div>
          <div v-if="a.title" class="w-full">
            {{ a.title || '' }}
          </div>
        </div>
      </div>
    </div>
    <div v-show="focused" class="z-[2]  w-full flex flex-col mt-1  relative">
      <div class="w-full flex justify-end h-4">
        <div class="w-8 bg-gray-600 text-white rounded-t flex items-center justify-center font-bold text-sm cursor-pointer" @click="focused=false">
          <IconsTimes />
        </div>
      </div>
      <div class="bg-white w-full flex flex-col ring-1 ring-gray-600 max-h-40 overflow-auto">
        <div v-for="(a,idx) in source" class="p-1 flex" >
          <div class="flex items-center">
            <button v-show="a.checked" type="button" class="text-white bg-green-500 text-sm" @click="toggle(a)"> 
              <IconsCheck />
            </button> 
            <button v-show="!a.checked" type="button" class="text-white bg-red-500 text-sm" @click="toggle(a)"> 
              <IconsTimes />
            </button> 
          </div>
          <div class="pl-1 flex flex-wrap items-center"> 
            <div class="w-full">
              <span class="font-bold"> #{{ a.name }}</span>
            </div>
            <div v-if="a.title" class="w-full">
              {{ a.title || '' }}
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

const slt_mul = ref<HTMLElement | null>(null);

// if (process.client) {
//   window.addEventListener('click', (e) => {
//     const target = e.target;
    
//     if (target instanceof Element) {
//       // Now TypeScript knows that target is an Element
//       if (slt_mul.value?.contains(target)) {
//       } else {
//         focused.value = false;
//       }
//     }
//   });
// }

let selectedArr = ref([]);
const focused = ref(false);
const search = ref("");
const emit = defineEmits(['input','nextBlur']);
// const source = ref<Array<any>>([]);

const source = computed(()=>{
  if(search.value!="")  
  return props.arr.filter((x:any)=>x.name.toLowerCase().includes(search.value.toLowerCase()));
  else
  return props.arr;
});
// if(props.list.length==0 && props.arr.length > 0){
//   props.arr.forEach((x:any)=>{
//     source.value.push({
//       id:x,
//       name:x,
//       checked:false,
//     })
//   })
// }


// const blur=(val:any)=>{
  
//   let result = typeof val == 'object' ? val.target.value : val;
//   result = result || props.value;
//   let [rn,hn] = humanNumber(result);

//   // console.log("rn",rn,"hn",hn);

//   inputVal.value = hn;
//   emit('input',rn);
  
//   // console.log("b",result);
  
//   // if(parseInt(result) < 0){
//   //   inputVal.value = "-"+blurIDFormat(result);  
//   //   emit('input',Number(oriIDFormat(result)) * -1); 
//   // }else{
//   //   inputVal.value = blurIDFormat(result);  
//   //   emit('input',Number(oriIDFormat(result))); 
//   // }


//   // console.log("bx",blurIDFormat(result),Number(oriIDFormat(result)));

// }




// const reAbj = /[a-zA-Z .<>?/\\|:;'"\[\]{}=+=_()*&^%$#@!~`]/;

// const inputChange=(val)=>{
//   countWatch+=1;
//   change(val);
// }

// const humanNumber=(val)=>{
//   let temp = val.toString().replace(/(?!^-)[^,0-9]/g, "");
//   if(temp=="") return [0,0];
//   let tempArr = temp.split(",");
//   let shift = tempArr.shift();
//   let realNumber = shift+(tempArr.length == 0 ? "" :  ("." + tempArr.join("")));
//   let newVal = shift.replace(/\B(?=(\d{3})+(?!\d))/g, ".")+ (tempArr.length == 0 ? "" :  ("," + tempArr.join("")));
//   return [realNumber, newVal];
// }

// const fromDBToHuman=(val)=>{
//   let temp = val.toString().replace(/\./g, ",");
//   if(temp=="") return 0;
//   let tempArr = temp.split(",");
//   let newVal = tempArr.shift().replace(/\B(?=(\d{3})+(?!\d))/g, ".")+(tempArr.length == 0 ? "" :  ("," + tempArr.join(""))) ;
//   return newVal;
// }


// const change=(val,outsider=false)=>{
 

//   let rn=0;
//   let hn="";
//   if(countWatch==0 || outsider){
//     rn = val;
//     hn = fromDBToHuman(val);
//   }else{
//     [rn,hn] = humanNumber(val);
//   }
//   // console.log("vrn",rn,"vhn",hn);

//   inputVal.value = hn;

 

//   }

// const excludeList=["Backspace","ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Delete","Tab"];

// const checkKey=(e)=>{
//   if(
//     e.ctrlKey==false && 
//     !excludeList.includes(e.key) && 
//     e.key.match(reAbj)
//   ) e.preventDefault();

//   if(e.key == '0' && (e.target.value === 0 || e.target.value === '0')) e.preventDefault();
// }

// const blockAll=(e)=>{
//   e.target.select();
//   e.target.setSelectionRange(0, 99999);
// }


// watch(() => props.show, (newVal, oldVal) => {
//   countWatch = 0;
//   // console.log(newVal);
// }, {
//   immediate: true
// });


// watch(() => props.value, (newVal, oldVal) => {

//   change(newVal,true);
// }, {
//   immediate: true,
//   deep:true
// });

const toggle = (a:any)=>{
  let idx = props.arr.map(x=>x.id).indexOf(a.id);
  if(idx==-1) return;

  props.arr[idx].checked=!props.arr[idx].checked;
}
</script>
<style scoped>

</style>
