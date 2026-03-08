<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Form Master Standby Validation'" :fn="fnClose" class="w-100 flex align-items-center"
        style="color:white;" />

        <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white">
          <div class="w-full flex flex-col items-center grow overflow-auto">
            <div class="w-full flex flex-row flex-wrap">

              <div class="w-full sm:w-4/12 md:w-3/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Name</label>
                <div class="card-border">
                  {{ standby_mst.name }}
                </div>
              </div>

              <div class="w-full sm:w-4/12 md:w-3/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Tipe</label>
                <div class="card-border">
                  {{ standby_mst.tipe }}
                </div>
              </div>
              
              <div class="w-full sm:w-4/12 md:w-3/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Amount</label>
                <div class="card-border">
                  {{ pointFormat(standby_mst.amount||0) }}
                </div>
              </div>
              <div class="w-full sm:w-4/12 md:w-3/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Peralihan?</label>
                <div class="card-border !flex flex-row items-center">
                  <input :checked="standby_mst.is_transition" disabled="disabled" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded">
                  <label class="w-full ml-1"> {{standby_mst.is_transition ? 'Ya' : 'Tidak'}} </label>
                </div>
                <p class="text-red-500">{{ field_errors.is_transition }}</p>
              </div>
              
            </div>

            <div class="w-full flex grow p-1 2xl:overflow-hidden justify-between flex-wrap">

              <div class="w-full" role="sticky">
                  <table class="tacky w-full !table-auto" style="white-space:normal;">
                    <thead >
                      <tr class="sticky top-0 !z-[2]">
                        <td colspan="7" class="!bg-slate-800 text-white font-bold">
                          Detail PVR
                        </td>
                      </tr>
                      <tr class="sticky top-8 !z-[2]">
                        <th class="min-w-[50px] !w-[50px] max-w-[50px] ">No</th>
                        <th class="min-w-[40px] !w-[40px] max-w-[40px] ">Acc ID</th>
                        <th class="!min-w-[100px] !w-[100px] !max-w-[100px] ">Acc Code</th>
                        <th class="!min-w-[150px] !w-[150px] !max-w-[150px] ">Acc Name</th>
                        <th class="!min-w-[150px] !w-[150px] !max-w-[150px] ">Desc</th>
                        <th class="min-w-[100px] !w-[100px] max-w-[100px] ">Amount <br> <span class="text-sm">({{pointFormat(total_amount) }})</span></th>
                        <th class="min-w-[80px] !w-[80px] max-w-[80px] ">For</th>
                      </tr>
                    </thead>
                    <tbody ref="to_move">
                      <template v-for="(detail, index) in details" :key="index">
                        <!-- <tr v-if="detail.p_status!='Remove'"  :data-index="index" draggable="true" @dragstart="handleDragStart($event,index)" @dragover.prevent @drop="handleDrop($event,index)"> -->
                        <tr v-if="detail.p_status!='Remove'"  :data-index="index">
                          <td>{{ index + 1 }}.</td>
                          
                          <td class="cell bold" :class="disabled ? 'unselectable' : ''">
                            <div class="w-full h-full flex items-center justify-center">
                              {{ detail.ac_account_id }}
                            </div>
                          </td>
                          <td class="cell bold" :class="disabled ? 'unselectable' : ''">
                            <div class="w-full h-full flex items-center justify-center">
                              {{ detail.ac_account_code }}
                            </div>
                          </td>
                          <td class="cell bold" :class="disabled ? 'unselectable' : ''">
                            <div class="w-full h-full flex items-center justify-center">
                              {{ detail.ac_account_name }}
                            </div>
                          </td>
                          <td v-if="!disabled" class="cell">
                            <div class="w-full h-full flex items-center justify-center">
                              {{ detail.description }}
                            </div>
                          </td>
                          <td class="cell bold" :class="disabled ? 'unselectable' : ''">
                            <div class="w-full h-full flex items-center justify-center">
                              {{ pointFormat(detail.amount||0) }}
                            </div>
                          </td>
                          <td class="cell" :class="disabled ? 'unselectable' : ''">
                            {{ detail.xfor }}
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
              <div v-if="standby_mst.val || standby_mst.val1" class="border-solid border-2 w-fit p-1 bg-slate-700 text-white text-xs">
                <div v-if="standby_mst.val">
                  App 1 : {{ standby_mst.val_by.username}} ( {{ standby_mst.val_at ? $moment(standby_mst.val_at).format("DD-MM-YYYY HH:mm:ss") :"" }} )
                </div>
                <div v-if="standby_mst.val1">
                  App 2 : {{ standby_mst.val1_by.username}} ( {{ standby_mst.val1_at ? $moment(standby_mst.val1_at).format("DD-MM-YYYY HH:mm:ss") :"" }} )
                </div>
              </div>
            </div>

            <button type="button" name="button" class="w-36 m-1" @click="fnClose()">
              Cancel
            </button>
            <button ref="it_val" v-if="is_view==0" type="submit" name="button" class="w-36 m-1 bg-blue-600 text-white  rounded-sm" @click.prevent="doSave()">
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

const standby_mst_temp = {
    id: -1,
    name: "",
    tipe: "",
    is_transition: false,
    amount:0,
    details: [],
    val:0,
    val_by:{ username:"" },
    val_at:"",
    val1:0,
    val1_by:{ username:"" },
    val1_at:"",
};

const standby_mst = ref({...standby_mst_temp});

const token = useCookie('token');
const field_errors = ref({});
const it_val = ref(null);
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

  const { data, error, status } = await useMyFetch("/standby_mst_validasi", {
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


  standby_mst.value.val = data.value.val;
  standby_mst.value.val_user = data.value.val_user;
  standby_mst.value.val_by = data.value.val_by;
  standby_mst.value.val_at = data.value.val_at;

  standby_mst.value.val1 = data.value.val1;
  standby_mst.value.val1_user = data.value.val1_user;
  standby_mst.value.val1_by = data.value.val1_by;
  standby_mst.value.val1_at = data.value.val1_at;


  let idx= props.p_data.map((x)=>x.id).indexOf(props.id);
  if(idx>=-1){
    props.p_data.splice(idx,1,{...standby_mst.value});    
  }


  props.fnClose();
}


const callData = async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/standby_mst", {
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

  standby_mst.value = data.value.data;
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
  // return standby_mst.value.confirmed_by || standby_mst.value.ref_id != null;
});

watch(() => props.show, (newVal, oldVal) => {
  if (newVal == true){
    if(props.is_view==false){
      setTimeout(()=>{
        it_val.value.focus();
      },1);
    }
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
