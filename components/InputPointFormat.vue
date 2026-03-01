<template>
    <input type="text" :value="inputVal"
      @keydown ="checkKey($event)"
      @keyup="inputChange($event.target.value)" 
      @blur="blur($event),$emit('nextBlur',$event)"
      @focus="blockAll($event)"
    >
</template>

<script lang="ts" setup>
let countWatch = -1;
let decimal
const props = defineProps({
  value: {
    type: [Number,String],
    required: true,
    default: 0,
  },
  show: {
    type: Boolean,
    required: false,
    default:true
  },
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
  let [rn,hn] = humanNumber(result);

  // console.log("rn",rn,"hn",hn);

  inputVal.value = hn;
  emit('input',rn);
  
  // console.log("b",result);
  
  // if(parseInt(result) < 0){
  //   inputVal.value = "-"+blurIDFormat(result);  
  //   emit('input',Number(oriIDFormat(result)) * -1); 
  // }else{
  //   inputVal.value = blurIDFormat(result);  
  //   emit('input',Number(oriIDFormat(result))); 
  // }


  // console.log("bx",blurIDFormat(result),Number(oriIDFormat(result)));

}

// onMounted(() => {
//   console.log("m",parseInt(props.value),props.value);

//   // change(parseInt(props.value))
//   change(props.value,true)
// });

const point = computed((value) =>{
  if (!value) return 0
  return new Intl.NumberFormat('id-ID',{minimumFractionDigits: 2}).format(value);
});


// const reAbj = /[a-zA-Z .,<>?/\\|:;'"\[\]{}=+=_()*&^%$#@!~`]/;
const reAbj = /[a-zA-Z .<>?/\\|:;'"\[\]{}=+=_()*&^%$#@!~`]/;
// let full = before.replace(/([.?*+^$[\]\\/(){}|-])/g, "");
const clearNumber = (val)=>{

  val = val.toString().replace(/^[a-zA-Z .,<>?/\\|:;'"\[\]{}=+=_()*&^%$#@!~`0]/g, "");

}
let isNegative = false;

const inputChange=(val)=>{
  countWatch+=1;
  change(val);
}

const humanNumber=(val)=>{
  let temp = val.toString().replace(/(?!^-)[^,0-9]/g, "");
  if(temp=="") return [0,0];
  let tempArr = temp.split(",");
  let shift = tempArr.shift();
  let realNumber = shift+(tempArr.length == 0 ? "" :  ("." + tempArr.join("")));
  let newVal = shift.replace(/\B(?=(\d{3})+(?!\d))/g, ".")+ (tempArr.length == 0 ? "" :  ("," + tempArr.join("")));
  return [realNumber, newVal];
}

const fromDBToHuman=(val)=>{
  let temp = val.toString().replace(/\./g, ",");
  if(temp=="") return 0;
  let tempArr = temp.split(",");
  let newVal = tempArr.shift().replace(/\B(?=(\d{3})+(?!\d))/g, ".")+(tempArr.length == 0 ? "" :  ("," + tempArr.join(""))) ;
  return newVal;
}


const change=(val,outsider=false)=>{
  // if(val=="-") {
  //   inputVal.value = "-";
  //   return;
  // }
  // console.log("val",val);

  let rn=0;
  let hn="";
  if(countWatch==0 || outsider){
    rn = val;
    hn = fromDBToHuman(val);
  }else{
    [rn,hn] = humanNumber(val);
  }
  // console.log("vrn",rn,"vhn",hn);

  inputVal.value = hn;

 

  // if(parseInt(val)<0) isNegative = true;
  // else isNegative = false;

  
  // let newVal = outsider ? parseInt(val):val;
  // // console.log("newval1",newVal);
  

  // if(val.toString().length > 1)
  // newVal = newVal.toString().replace(/^0/g, "");
  // // newVal = val.toString().replace(/^0/g, "");

  // // console.log("newval2",newVal);
  
  // inputVal.value = (isNegative ? "-" : "")+writeIDFormat(newVal);
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

watch(() => props.show, (newVal, oldVal) => {
  countWatch = 0;
  // console.log(newVal);
}, {
  immediate: true
});


watch(() => props.value, (newVal, oldVal) => {
  // console.log("w",parseInt(newVal),newVal);
  // change(parseInt(newVal));
  change(newVal,true);
}, {
  immediate: true,
  deep:true
});
</script>
<style scoped>

</style>
