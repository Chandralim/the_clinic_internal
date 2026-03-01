<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Form fin_payment_req'" :fn="fnClose" class="w-100 flex align-items-center"
        style="color:white;" />

        <form action="#" class="w-full flex grow flex-col h-0 overflow-auto p-2 bg-white">
          <div class="w-full flex flex-col items-center grow overflow-auto ">

            <div class="w-full" role="sticky">
              <table class="tacky" style="white-space:normal;">
                <thead >
                  <tr class="sticky top-0 !z-[2]">
                    <td :colspan="8" class="!bg-slate-800 text-white font-bold">
                      List Transaksi
                    </td>
                  </tr>
                  <tr class="sticky top-7 !z-[2]">
                    <th rowspan="2" class="min-w-[50px] !w-[50px] max-w-[50px]">
                      <button type="button" name="button" class="bg-yellow-600" @click="unCheckedAll()">
                        U/Ch
                      </button>
                    </th>
                    <th rowspan="2" class="min-w-[50px] !w-[50px] max-w-[50px] ">No</th>
                    
                    <th colspan="2">Transaction</th>
                    <th colspan="2">PVR</th>
                    <th colspan="2">PV</th>
                  </tr>
                  <tr class="sticky top-[60px] !z-[2]">
                    <th>ID</th>
                    <th>Amount</th>
                    <th>No</th>
                    <th>Amount</th>
                    <th>No</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody ref="to_move">
                  <template v-for="(detail, index) in details" :key="index">
                    <tr :data-index="index">
                      <td class="tools cell">
                        <div class="w-full h-full flex items-center justify-center">
                          <input type="checkbox" :checked="isExists(detail)" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600 cursor-pointer" @click="addOrRemoveFromList(detail)">
                        </div>
                      </td>
                      <td>{{ index + 1 }}.</td>
                      <td class="cell min-w-[50px] !w-[50px] max-w-[50px]">
                        <div class="w-full h-full flex items-center justify-center">
                          {{ detail.id }}
                        </div>
                      </td>
                      <td class="cell">
                        <div class="w-full h-full flex items-center justify-center">
                          {{ pointFormat(detail.amount || 0) }}   
                        </div>
                      </td>
                      <td class="cell min-w-[150px] !w-[150px] max-w-[150px]">
                        <div class="w-full h-full flex items-center justify-center">
                          {{ detail.pvr_no }}   
                        </div>
                      </td>
                      <td class="cell">
                        <div class="w-full h-full flex items-center justify-center">
                          {{ pointFormat(detail.pvr_total || 0) }}   
                        </div>
                      </td>
                      <td class="cell">
                        <div class="w-full h-full flex items-center justify-center">
                          {{ detail.pv_no }}   
                        </div>
                      </td>
                      <td class="cell">
                        <div class="w-full h-full flex items-center justify-center unselectable">                       
                          {{ pointFormat(detail.pv_total || 0) }}   
                        </div>
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </div>
          
          <div class="w-full flex items-center justify-end">
            <button type="button" name="button" class="w-36 m-1" @click="fnClose()">
              Cancel
            </button>
            <button  type="submit" name="button" class="w-36 m-1 bg-blue-600 text-white  rounded-sm" @click.prevent="doSave()">
              Generate Request
            </button>
          </div>
        </form>
    </div>
  </section>
</template>

<script setup>

const { $moment } = useNuxtApp()
import { storeToRefs } from 'pinia';

import { useAuthStore } from '~/store/auth';
import { useErrorStore } from '~/store/error';
import { useCommonStore } from '~/store/common';
import { useAlertStore } from '~/store/alert';

const { pointFormat } = useUtils();

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  fnClose: {
    type: Function,
    required: false,
  },
  fnSelect: {
    type: Function,
    required: false,
  },
  excludes: {
    type: String,
    required: false,
    // default: '',
  },
  exclude_lists: {
    type: Array,
    required: false,
    // default: '',
  },
  id:{
    type: Number,
    required: false,
    default: 0,
  },
  p_data:{
    type:Array,
    required:true,
    default:[]
  },
})

const fin_payment_req_temp = {
    id: -1,
    xto: "",
    tipe: "",
    // status: "Y",
    jenis: "",
    harga:0,
    note_for_remarks:"",
    details: [],
    details2: [],
};

const fin_payment_req = ref({...fin_payment_req_temp});


const token = useCookie('token');

const field_errors = ref({})

const { display } = useAlertStore();


const doSave = async () => {
  useCommonStore().loading_full = true;
  field_errors.value = {};

  const data_in = new FormData();
  data_in.append("details", JSON.stringify(selected_items.value));
  
  let $method = "post";

  let id = props.is_copy ? 0 : props.id;
  if (id == 0) {
  } else {
    // $method = "put";
    // data_in['id'] = id;
    data_in.append("id", id);
    data_in.append("_method", "PUT");
  }

  const { data, error, status } = await useMyFetch("/fin_payment_req", {
    method: $method,
    headers: {
      'Authorization': `Bearer ${token.value}`,
      // 'Content-Type': 'application/json',
      'Accept': 'application/json',
      // "Content-Type": "multipart/form-data",
    },
    body: data_in,
    retry: 0,
    // server: true
  });
  useCommonStore().loading_full = false;
  if (status.value === 'error') {
    useErrorStore().trigger(error, field_errors);
    return;
  }

  
  if(id<=0){
    fin_payment_req.value.id = data.value.id;
    fin_payment_req.value.created_at = data.value.created_at;
    fin_payment_req.value.updated_at = data.value.updated_at;
    props.p_data.unshift(fin_payment_req.value);
  }else{
    fin_payment_req.value.updated_at = data.value.updated_at;

    let idx= props.p_data.map((x)=>x.id).indexOf(id);
    if(idx>=-1){
      props.p_data.splice(idx,1,{...fin_payment_req.value});    
    }
  }
  props.fnClose();
  // router.go(-1);
}


// const total_harga = computed(()=>{
//   let temp = 0;

//   details.value.forEach(e => {
//     if(e.p_status!="Remove")
//     temp += e.qty * e.harga; 
//   });
//   fin_payment_req.value.harga = temp;
//   return temp;
// })

// const role = useCookie('role');
// const disabled = computed(()=>{
//   return (fin_payment_req.value.val && fin_payment_req.value.val1) || (role.value == "Logistic" && fin_payment_req.value.val) || (role.value == "PabrikTransport" && fin_payment_req.value.val1);
// });

// const callData = async () => {
//   useCommonStore().loading_full = true;
//   const { data, error, status } = await useMyFetch("/fin_payment_req/get_detail_unprocessed", {
//     method: 'get',
//     headers: {
//       'Authorization': `Bearer ${token.value}`,
//       // 'Content-Type': 'application/json',
//       'Accept': 'application/json'
//     },
//     params: {id:props.id},
//     // body: {
//     //   sort: "updated_at:desc"
//     // },
//     retry: 0,
//     // server: true
//   });
//   useCommonStore().loading_full = false;

//   if (status.value === 'error') {
//     useErrorStore().trigger(error);
//     return;
//   }

//   fin_payment_req.value = data.value.data;

//   let p_status = "Edit";
//   if(props.is_copy){
//     p_status = "Add";
//     fin_payment_req.value.val = 0;
//     fin_payment_req.value.val1 = 0;
//   }

//   details.value = data.value.data.details.map((x)=>{
//     x["p_status"]= p_status;
//     x["key"] = x["ordinal"];
//     return x;
//   });

//   details2.value = data.value.data.details2.map((x)=>{
//     x["p_status"]= p_status;
//     x["key"] = x["ordinal"];
//     return x;
//   });
  
// }


const selected_items = ref([]);

const isExists=(item)=>{
  const index = selected_items.value.map((x)=>x.id).indexOf(item.id);
  return index !== -1;
}

const addOrRemoveFromList=(item)=>{
  const index = selected_items.value.map((x)=>x.id).indexOf(item.id);
  if (index === -1) {
  // not exist in the list
    selected_items.value.push(item);
  }else{
    // remove from the list
    selected_items.value.splice(index, 1);
  }
};

const unCheckedAll=(item)=>{
  if (selected_items.value.length < details.value.length) {
    selected_items.value=[...details.value];
  }else{
    selected_items.value=[];
  }
};

const details=ref([]);
const callTrxTrpData = async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/fin_payment_req/get_trx_trp_unprocessed", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json'
    },
    params: {},
    retry: 0,
  });
  useCommonStore().loading_full = false;

  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return;
  }

  details.value = data.value.data;
}
watch(() => props.show, async(newVal, oldVal) => {
  if (newVal == true){
    await callTrxTrpData();
    fin_payment_req.value = {...fin_payment_req_temp};
    // if(props.id!=0)
    // callData();
  }
}, {
  immediate: true
});

</script>
