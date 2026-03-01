<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Finance Payment Request'" :fn="fnClose" class="w-100 flex align-items-center"
        style="color:white;" />

        <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white">
          <div class="w-full flex flex-col items-center grow overflow-auto">
            <div class="w-full flex p-1 2xl:overflow-hidden justify-between flex-wrap">
              <div class="w-full" role="sticky">
                <table class="tacky w-full !table-auto" style="white-space:normal;">
                  <thead >
                  <tr class="sticky top-0 !z-[2]">
                    <td :colspan="7" class="!bg-slate-800 text-white font-bold">
                      List Transaksi
                    </td>
                  </tr>
                  <tr class="sticky top-7 !z-[2]">
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
                      <!-- <tr v-if="detail.p_status!='Remove'"  :data-index="index" draggable="true" @dragstart="handleDragStart($event,index)" @dragover.prevent @drop="handleDrop($event,index)"> -->
                      <tr v-if="detail.p_status!='Remove'"  :data-index="index">
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
          </div>
          
          <div class="w-full flex items-center justify-end">
            <div class="w-full flex flex-wrap p-3 items-center">
              <div>
                Di Validasi oleh : 
              </div>
              <div v-if="fin_payment_req.val" class="border-solid border-2 w-fit p-1 bg-slate-700 text-white text-xs">
                <div v-if="fin_payment_req.val">
                  App 1 : {{ fin_payment_req.val_by.username}} ( {{ fin_payment_req.val_at ? $moment(fin_payment_req.val_at).format("DD-MM-YYYY HH:mm:ss") :"" }} )
                </div>
              </div>
            </div>

            <button type="button" name="button" class="w-36 m-1" @click="fnClose()">
              Cancel
            </button>
            <button v-if="is_view==0" type="submit" name="button" class="w-36 m-1 bg-blue-600 text-white  rounded-sm" @click.prevent="doSave()">
              Validasi
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
  is_view:{
    type:Boolean,
    required:false,
    default:false
  },
})

const fin_payment_req_temp = {
    details: [],
    val:0,
    val_by:{ username:"" },
    val_at:"",
};

const fin_payment_req = ref({...fin_payment_req_temp});

const token = useCookie('token');
const field_errors = ref({});

const details = ref([]);

const doSave = async () => {
  useCommonStore().loading_full = true;
  field_errors.value = {};

  const data_in = new FormData();
  
  let $method = "post";

  let id = props.id;
  if (id == 0) {
  } else {
    // $method = "put";
    // data_in['id'] = id;
    data_in.append("id", id);
    data_in.append("_method", "PUT");
  }

  const { data, error, status } = await useMyFetch("/fin_payment_req_validasi", {
    method: $method,
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json',
    },
    body: data_in,
    retry: 0,
  });
  useCommonStore().loading_full = false;
  if (status.value === 'error') {
    useErrorStore().trigger(error, field_errors);
    return;
  }


  fin_payment_req.value.val = data.value.val;
  fin_payment_req.value.val_user = data.value.val_user;
  fin_payment_req.value.val_by = data.value.val_by;
  fin_payment_req.value.val_at = data.value.val_at;

  fin_payment_req.value.val1 = data.value.val1;
  fin_payment_req.value.val1_user = data.value.val1_user;
  fin_payment_req.value.val1_by = data.value.val1_by;
  fin_payment_req.value.val1_at = data.value.val1_at;


  let idx= props.p_data.map((x)=>x.id).indexOf(props.id);
  if(idx>=-1){
    props.p_data.splice(idx,1,{...fin_payment_req.value});    
  }


  props.fnClose();
}


const callData = async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/fin_payment_req", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      // 'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    params: {id:props.id},
    // body: {
    //   sort: "updated_at:desc"
    // },
    retry: 0,
    // server: true
  });
  useCommonStore().loading_full = false;

  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return;
  }

  fin_payment_req.value = data.value.data;
  details.value = data.value.data.details;
}

const total_amount = computed(()=>{
  let temp = 0;

  details.value.forEach(e => {
    if(e.p_status!="Remove")
    temp += parseInt(e.amount);
  });
  return temp;
})

const disabled = computed(()=>{
  return false;
  // return fin_payment_req.value.confirmed_by || fin_payment_req.value.ref_id != null;
});

watch(() => props.show, (newVal, oldVal) => {
  if (newVal == true){
    callData();
  }
}, {
  immediate: true
});

</script>
<style scoped="">
/* table.sticky thead th:nth-child(2) {
  position: -webkit-sticky;
  position: sticky;
  left: 0;
  z-index: 2;
}

table.sticky thead tr {
  top: 0;
} */
</style>
