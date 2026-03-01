<template>
    <input type="text" :value="inputVal"
      @keydown ="checkKey($event)"
      @keyup="change($event.target.value)" 
      @blur="blur($event),$emit('nextBlur',$event)"
      @focus="blockAll($event)"
    >
</template>

<script lang="ts" setup>

const props = defineProps({
  value: {
    type: [Number,String],
    required: true,
    default: 0,
  },
  // show: {
  //   type: Boolean,
  //   required: true,
  // },
  // fn: {
  //   type: Function,
  //   required: false,
  // },
})

const look = ref(true);
const inputVal = ref(0);
const emit = defineEmits(['input','nextBlur']);
const writeIDFormat=(m:any)=>{
  m = m.toString().replace(/[^,0-9]/ig, '').replace(',','.').replace(/,/ig, '');
  let splitM = m.split(".");
  splitM[0] = splitM[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  let joinM= splitM.join(",");
  return joinM;
};

const blurIDFormat=(m:any)=>{
  m = m.toString().replace(/[^,0-9]/ig, '').replace(',','.').replace(/,/ig, '');
  let splitM = m.split(".");
  splitM[0] = splitM[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  if (splitM.length > 1) {
    splitM[1] = splitM[1].replace(/0+$/,"");
  }
  let joinM= splitM.join(",");
  return joinM;
};

const oriIDFormat=(m:any)=>{
  return m.toString().replace(/[^,0-9]/ig, '').replace(',','.').replace(/,/ig, '');
};

// const change=(val:any)=>{
//   // if(val.target) val.preventDefault();
//   // let result = (typeof val == 'object' ? val.target.value : val).toString();  
//   // // if(result && result.match(/[a-z]+/ig)){
//   // //   inputVal.value = 0;
//   // // }
//   // // else
//   // inputVal.value = writeIDFormat(result);
// }

const blur=(val:any)=>{
  
  let result = typeof val == 'object' ? val.target.value : val;
  result = result || props.value;
  console.log("b",parseInt(result),result);
  
  if(parseInt(result) < 0){
    inputVal.value = "-"+blurIDFormat(result);  
    emit('input',Number(oriIDFormat(result)) * -1); 
  }else{
    inputVal.value = blurIDFormat(result);  
    emit('input',Number(oriIDFormat(result))); 
  }


  console.log("bx",blurIDFormat(result),Number(oriIDFormat(result)));

}

onMounted(() => {
  console.log("m",parseInt(props.value),props.value);

  // change(parseInt(props.value))
  change(props.value)
});

const point = computed((value) =>{
  if (!value) return 0
  return new Intl.NumberFormat('id-ID',{minimumFractionDigits: 2}).format(value);
});


// const reAbj = /[a-zA-Z .,<>?/\\|:;'"\[\]{}=+=_()*&^%$#@!~`]/;
const reAbj = /[a-zA-Z <>?/\\|:;'"\[\]{}=+=_()*&^%$#@!~`]/;
// let full = before.replace(/([.?*+^$[\]\\/(){}|-])/g, "");
const clearNumber = (val)=>{

  val = val.toString().replace(/^[a-zA-Z .,<>?/\\|:;'"\[\]{}=+=_()*&^%$#@!~`0]/g, "");


}
let isNegative = false;
const change=(val)=>{
  console.log("ch",parseInt(val),val);
  if(val=="-") {
    inputVal.value = "-";
    return;
  }

  if(parseInt(val)<0) isNegative = true;

  let newVal = parseInt(val);
  // console.log("newval1",newVal);
  
  if(val.toString().length > 1)
  newVal = newVal.toString().replace(/^0/g, "");
  // newVal = val.toString().replace(/^0/g, "");

  // console.log("newval2",newVal);
  
  inputVal.value = (isNegative ? "-" : "")+writeIDFormat(newVal);
}

const excludeList=["Backspace","ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Delete","Tab"];

const checkKey=(e)=>{
  if(
    e.ctrlKey==false && 
    !excludeList.includes(e.key) && 
    e.key.match(reAbj)
  ) e.preventDefault();

  if(e.key == '0' && (e.target.value === 0 || e.target.value === '0')) e.preventDefault();
}

const blockAll=(e)=>{
  e.target.select();
  e.target.setSelectionRange(0, 99999);
}



// watch(inputVal, (newVal, oldVal) => {
//   blur(newVal);
// }, {
//   immediate: true,
//   deep:true
// });

watch(() => props.value, (newVal, oldVal) => {
  // console.log("w",parseInt(newVal),newVal);
  // change(parseInt(newVal));
  change(newVal);
}, {
  immediate: true,
  deep:true
});
</script>
<style scoped>

</style>
