<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Form Ujalan Validation'" :fn="fnClose" class="w-100 flex align-items-center"
        style="color:white;" />

        <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white">
          <div class="w-full flex flex-col items-center grow overflow-auto">
            <div class="w-full flex flex-row flex-wrap">

              <div class="w-full sm:w-4/12 md:w-3/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">To</label>
                <div class="card-border">
                  {{ ujalan.xto }}
                </div>
              </div>
              <div class="w-full sm:w-4/12 md:w-3/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Jenis</label>
                <div class="card-border">
                  {{ ujalan.jenis }}
                </div>
              </div>
              <div class="w-full sm:w-4/12 md:w-3/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Harga</label>
                <div class="card-border">
                  {{ pointFormat(ujalan.harga||0) }}
                </div>
              </div>
              <div class="w-full sm:w-4/12 md:w-3/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Asal Peralihan</label>
                <div class="card-border">
                  {{ ujalan.transition_from }}
                </div>
              </div>
              <div class="w-full sm:w-4/12 md:w-6/12 lg:w-6/12 flex flex-col flex-wrap p-1">
                <label for="">Tipe</label>
                <div class="card-border">
                  {{ ujalan.tipe }}
                </div>
              </div>
              <div class="w-full sm:w-4/12 md:w-6/12 lg:w-6/12 flex flex-col flex-wrap p-1">
                <label for="">Ket. Untuk Remarks</label>
                <div class="card-border">
                  {{ ujalan.note_for_remarks }}
                </div>
              </div>
            </div>

            <div class="w-full flex flex-col sm:flex-row grow p-1 justify-between flex-wrap 2xl:overflow-hidden">
              <div class="w-full p-0 2xl:pr-1 2xl:w-1/2 2xl:h-full  2xl:overflow-auto">
                <div class="w-full" role="sticky">
                  <table class="tacky w-full" style="white-space:normal;">
                    <thead >
                      <tr class="sticky top-0 !z-[2]">
                        <td colspan="6" class="!bg-slate-800 text-white font-bold">
                          Detail Uang Jalan
                        </td>
                      </tr>
                      <tr class="sticky top-8 !z-[2]">
                        <th class="min-w-[50px] !w-[50px] max-w-[50px] ">No</th>
                        <th>Desc</th>
                        <th class="min-w-[100px] !w-[100px] max-w-[100px] ">Harga @</th>
                        <th class="min-w-[50px] !w-[50px] max-w-[50px] ">Qty</th>
                        <th class="min-w-[100px] !w-[100px] max-w-[100px] ">Total <br> <span class="text-sm">({{pointFormat(ujalan.harga || 0) }})</span>  </th>
                        <th class="min-w-[50px] !w-[50px] max-w-[50px] ">For Remarks</th>
                      </tr>
                    </thead>
                    <tbody ref="to_move">
                      <template v-for="(detail, index) in details" :key="index">
                        <!-- <tr v-if="detail.p_status!='Remove'"  :data-index="index" draggable="true" @dragstart="handleDragStart($event,index)" @dragover.prevent @drop="handleDrop($event,index)"> -->
                        <tr v-if="detail.p_status!='Remove'"  :data-index="index">
                          <td>{{ index + 1 }}.</td>
                          <td class="cell">
                            <div class="w-full h-full flex items-center justify-center">
                              {{ detail.xdesc }}
                            </div>
                          </td>
                          <td class="cell bold">
                          <div class="w-full h-full flex items-center justify-center">
                            {{ pointFormat(detail.harga||0) }}
                          </div>
                        </td>
                        <td class="cell">
                          <div class="w-full h-full flex items-center justify-center">
                            {{ pointFormat(detail.qty||0) }}
                          </div>
                        </td>
                          <td class="cell">
                            <div class="w-full h-full flex items-center justify-center">                       
                              {{ pointFormat(detail.qty * detail.harga || 0) }}   
                            </div>
                          </td>
                          <td class="cell">
                            <div class="w-full h-full flex items-center justify-center">
                              <div class="text-white rounded text-xl w-5 h-5" :class="detail.for_remarks?'bg-green-600' : 'bg-red-600' ">
                                <IconsTimes v-if="detail.for_remarks==0"/>
                                <IconsCheck v-else/>             
                              </div>
                            </div>
                          </td>
                        </tr>
                      </template>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="w-full px-0 py-2 2xl:pl-1 2xl:py-0 2xl:w-1/2 2xl:h-full  2xl:overflow-auto">
                <div class="w-full" role="sticky">
                  <table class="tacky w-full !table-auto" style="white-space:normal;">
                    <thead >
                      <tr class="sticky top-0 !z-[2]">
                        <td colspan="9" class="!bg-slate-800 text-white font-bold">
                          Detail PVR
                        </td>
                      </tr>
                      <tr class="sticky top-8 !z-[2]">
                        <th class="min-w-[50px] !w-[50px] max-w-[50px] ">No</th>
                        <th class="min-w-[40px] !w-[40px] max-w-[40px] ">Acc ID</th>
                        <th class="!min-w-[100px] !w-[100px] !max-w-[100px] ">Acc Code</th>
                        <th class="!min-w-[150px] !w-[150px] !max-w-[150px] ">Acc Name</th>
                        <th class="!min-w-[150px] !w-[150px] !max-w-[150px] ">Desc</th>
                        <th class="min-w-[100px] !w-[100px] max-w-[100px] ">Amount</th>
                        <th class="min-w-[40px] !w-[40px] max-w-[40px] ">Qty</th>
                        <th class="min-w-[80px] !w-[80px] max-w-[80px] ">For</th>
                        <th class="min-w-[100px] !w-[100px] max-w-[100px] ">Total <br> <span class="text-sm">({{pointFormat(total_harga2) }})</span></th>
                      </tr>
                    </thead>
                    <tbody ref="to_move">
                      <template v-for="(detail, index) in details2" :key="index">
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
                            {{ pointFormat(detail.qty||0) }}
                          </td>
                          <td class="cell" :class="disabled ? 'unselectable' : ''">
                            {{ detail.xfor }}
                          </td>
                          <td class="cell">
                            <div class="w-full h-full flex items-center justify-center">                       
                              {{ pointFormat(detail.qty * detail.amount || 0) }}   
                            </div>
                          </td>
                        </tr>
                      </template>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            

          </div>
          
          <div class="w-full flex items-center justify-end">
            <div class="w-full flex flex-wrap p-3 items-center">
              <div>
                Di Validasi oleh : 
              </div>
              <div v-if="ujalan.val || ujalan.val1" class="border-solid border-2 w-fit p-1 bg-slate-700 text-white text-xs">
                <div v-if="ujalan.val">
                  App 1 : {{ ujalan.val_by.username}} ( {{ ujalan.val_at ? $moment(ujalan.val_at).format("DD-MM-YYYY HH:mm:ss") :"" }} )
                </div>
                <div v-if="ujalan.val1">
                  App 2 : {{ ujalan.val1_by.username}} ( {{ ujalan.val1_at ? $moment(ujalan.val1_at).format("DD-MM-YYYY HH:mm:ss") :"" }} )
                </div>
              </div>
            </div>

            <button type="button" name="button" class="w-36 m-1" @click="fnClose()">
              Cancel
            </button>
            <button type="submit" name="button" class="w-36 m-1 bg-blue-600 text-white  rounded-sm" @click.prevent="doSave()">
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
  }
  
})

const ujalan_temp = {
    id: -1,
    xto: "",
    tipe: "",
    // status: "Y",
    jenis: "",
    harga:0,
    note_for_remarks:0,
    details: [],
    val:0,
    val_by:{ username:"" },
    val_at:"",
    val1:0,
    val1_by:{ username:"" },
    val1_at:"",
};

const ujalan = ref({...ujalan_temp});

const token = useCookie('token');
const field_errors = ref({});

const details = ref([]);
const details2 = ref([]);

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

  const { data, error, status } = await useMyFetch("/ujalan_validasi", {
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


  ujalan.value.val = data.value.val;
  ujalan.value.val_user = data.value.val_user;
  ujalan.value.val_by = data.value.val_by;
  ujalan.value.val_at = data.value.val_at;

  ujalan.value.val1 = data.value.val1;
  ujalan.value.val1_user = data.value.val1_user;
  ujalan.value.val1_by = data.value.val1_by;
  ujalan.value.val1_at = data.value.val1_at;


  let idx= props.p_data.map((x)=>x.id).indexOf(props.id);
  if(idx>=-1){
    props.p_data.splice(idx,1,{...ujalan.value});    
  }


  props.fnClose();
}


const callData = async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/ujalan_", {
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

  ujalan.value = data.value.data;
  details.value = data.value.data.details;
  details2.value = data.value.data.details2;
}

const total_harga2 = computed(()=>{
  let temp = 0;

  details2.value.forEach(e => {
    if(e.p_status!="Remove")
    temp += e.qty * e.amount;
  });
  return temp;
})

const disabled = computed(()=>{
  return false;
  // return ujalan.value.confirmed_by || ujalan.value.ref_id != null;
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
