<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Form Transaction Standby Validation'" :fn="fnClose" class="w-100 flex align-items-center"
        style="color:white;" />

        <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white">
          <div class="w-full flex flex-col items-center grow overflow-auto">
            <div class="w-full flex flex-row flex-wrap">

              <div class="w-full sm:w-9/12 flex px-2 py-3">                
                <div class="w-full flex flex-wrap ring-1 ring-gray-500 p-2 relative">
                  
                  <div class="absolute bg-white -top-3"> Standby </div>

                  <div class="w-6/12 sm:w-2/12 flex flex-col flex-wrap p-1">
                    <label for="">ID</label>
                    <div class="card-border">
                      {{ standby_trx.standby_mst_id }}
                    </div>
                  </div>
    
                  <div class="w-6/12 sm:w-4/12 flex flex-col flex-wrap p-1">
                    <label for="">Name</label>
                    <div class="card-border">
                      {{ standby_trx.standby_mst_?.name }}
                    </div>
                  </div>
    
                  <div class="w-6/12 sm:w-4/12 flex flex-col flex-wrap p-1">
                    <label for="">Type</label>
                    <div class="card-border">
                      {{ standby_trx.standby_mst_?.tipe }}
                    </div>
                  </div>
    
                  <div class="w-6/12 sm:w-2/12 flex flex-col flex-wrap p-1">
                    <label for="">Amount</label>
                    <div class="card-border ">
                      {{ pointFormat(standby_trx.standby_mst_?.amount) }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="w-full sm:w-3/12 flex px-2 py-3">                
                <div class="w-full flex flex-wrap ring-1 ring-gray-500 p-2 relative items-end">
                  
                  <div class="absolute bg-white -top-3"> Peralihan </div>
                  
                  <div class="w-6/12 flex flex-col flex-wrap p-1">
                    <div class="card-border">
                      {{ standby_trx.transition_type }}
                    </div>
                  </div>

                  <div class="w-6/12 flex flex-col flex-wrap p-1">
                    <div class="card-border">
                      {{ standby_trx.transition_target }}
                    </div>
                  </div>

                </div>
              </div>

              <div class="w-full flex flex-wrap">
                <div class="w-full sm:w-6/12 md:w-6/12 lg:w-6/12 flex flex-col flex-wrap p-1">
                  <label for="">Supir</label>
                  <div class="card-border !flex">
                    <WidthMiniPart :selected="selected_supir"/>
                  </div>
                </div>

                <div class="w-full sm:w-6/12 md:w-6/12 lg:w-6/12 flex flex-col flex-wrap p-1">
                  <label for="">Kernet</label>
                  <div class="card-border !flex">
                    <WidthMiniPart :selected="selected_kernet"/>
                  </div>
                </div>
  
                <div class="w-6/12 sm:w-4/12 md:w-4/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                  <label for="">No Pol</label>
                  <div class="card-border">
                    {{ standby_trx.no_pol }}
                  </div>
                </div>
            
                <div class="w-6/12 sm:w-4/12 md:w-4/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                  <label for="">Tujuan</label>
                  <div class="card-border">
                    {{ standby_trx.xto }}
                  </div>
                </div>
  
                <div class="w-6/12 sm:w-4/12 md:w-4/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                  <label for="">Note For Remarks</label>
                  <div class="card-border">
                    {{ standby_trx.note_for_remarks }}
                  </div>
                </div>
                <div class="w-6/12 sm:w-4/12 md:w-4/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                  <label for="">Referensi</label>
                  <div class="card-border">
                    {{ standby_trx.ref }}
                  </div>
                </div>
              </div>


              <div class="w-full sm:w-6/12 md:w-6/12 lg:w-4/12 flex px-2 py-3">                
                <div class="w-full flex flex-wrap ring-1 ring-gray-500 p-2 relative">
                  <div class="absolute bg-white -top-3"> Cost Center </div>
                  <div class="w-6/12 sm:w-4/12 flex flex-col flex-wrap p-1">
                    <label for=""> Code</label>
                    <div class="card-border">
                      {{ standby_trx.cost_center_code }}
                    </div>
                  </div>

                  <div class="w-6/12 sm:w-8/12 flex flex-col flex-wrap p-1">
                    <label for="">Desc</label>
                    <div class="card-border disabled">
                      {{  standby_trx.cost_center_desc }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="w-full sm:w-6/12 md:w-6/12 lg:w-4/12 flex px-2 py-3">                
                <div class="w-full flex flex-wrap ring-1 ring-gray-500 p-2 relative">
                  <div class="absolute bg-white -top-3"> PVR </div>
                    <div class="w-6/12 sm:w-8/12 flex flex-col flex-wrap p-1">
                    <label for="">No</label>
                    <div class="card-border disabled">
                      {{  standby_trx.pvr_no }}
                    </div>
                  </div>

                  <div class="w-6/12 sm:w-4/12 flex flex-col flex-wrap p-1">
                    <label for="">Total</label>
                    <div class="card-border disabled">
                      {{ pointFormat(standby_trx.pvr_total || 0) }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="w-full sm:w-6/12 md:w-6/12 lg:w-4/12 flex px-2 py-3">                
                <div class="w-full flex flex-wrap ring-1 ring-gray-500 p-2 relative">
                  <div class="absolute bg-white -top-3"> PV </div>
                  
                  <div class="w-6/12 sm:w-8/12 flex flex-col flex-wrap p-1">
                    <label for="">No</label>
                    <div class="card-border disabled">
                      {{ standby_trx.pv_no }}
                    </div>
                  </div>

                  <div class="w-6/12 sm:w-4/12 flex flex-col flex-wrap p-1">
                    <label for="">Total</label>
                    <div class="card-border disabled">
                      {{  pointFormat(standby_trx.pv_total) }}
                    </div>
                  </div>
                  
                </div>
              </div>

              <div class="w-full flex grow p-1 overflow-auto 2xl:overflow-hidden justify-between flex-wrap">
                <div class="w-full" role="sticky">
                  <table class="tacky w-full !table-auto" style="white-space:normal;">
                    <thead >
                      <tr class="sticky -top-1 !z-[2]">
                        <td :colspan="!disabled  ? 4 : 3" class="!bg-slate-800 text-white font-bold">
                          Detail Transaction
                        </td>
                      </tr>
                      <tr class="sticky top-7 !z-[2]">
                        <th class="!min-w-[50px] !w-[50px] !max-w-[50px] ">No</th>
                        <th class="!min-w-[150px] !w-[150px] !max-w-[150px] ">Tanggal</th>
                        <th class="!min-w-[200px] !w-[200px] !max-w-[200px] ">Keterangan</th>
                      </tr>
                    </thead>
                    <tbody ref="to_move">
                      <template v-for="(detail, index) in details" :key="index">
                        <!-- <tr v-if="detail.p_status!='Remove'"  :data-index="index" draggable="true" @dragstart="handleDragStart($event,index)" @dragover.prevent @drop="handleDrop($event,index)"> -->
                        <tr v-if="detail.p_status!='Remove'"  :data-index="index">
                          <td>{{ index + 1 }}.</td>
                          <td class="cell">
                            <div class="w-full h-full flex items-center justify-center relative">
                              {{ $moment(detail.tanggal).format("DD-MM-YYYY") }}
                            </div>
                          </td>
                          <td class="cell">
                            <div class="w-full h-full flex items-center justify-center">
                              {{ detail.note }}
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
              <div v-if="standby_trx.val || standby_trx.val1 || standby_trx.val2" class="border-solid border-2 w-fit p-1 bg-slate-700 text-white text-xs">
                <div v-if="standby_trx.val">
                  App 1 : {{ standby_trx.val_by.username}} ( {{ standby_trx.val_at ? $moment(standby_trx.val_at).format("DD-MM-YYYY HH:mm:ss") :"" }} )
                </div>
                <div v-if="standby_trx.val1">
                  App 2 : {{ standby_trx.val1_by.username}} ( {{ standby_trx.val1_at ? $moment(standby_trx.val1_at).format("DD-MM-YYYY HH:mm:ss") :"" }} )
                </div>
                <div v-if="standby_trx.val2">
                  App 2 : {{ standby_trx.val2_by.username}} ( {{ standby_trx.val2_at ? $moment(standby_trx.val2_at).format("DD-MM-YYYY HH:mm:ss") :"" }} )
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

const standby_trx_temp = {
    id: -1,
    transition_target:"",
    transition_type:"",

    standby_mst_id: "",
    standby_mst_:{
      name: "",
      tipe: "",
      amount:0,
    },

    supir: "",
    kernet: "",
    no_pol: '',
    xto: "",
    note_for_remarks: "",
    ref: "",
    
    cost_center_code:"",
    cost_center_desc:"",

    pvr_id: "",
    pvr_no:"",
    pvr_total:0,
    pvr_had_detail:0,

    pv_id: "",
    pv_no:"",
    pv_total:0,
    pv_datetime:"",

    rv_id: "",
    rv_no:"",
    rv_total:0,
    rv_had_detail:"",

    details: [],
    val:0,
    val_by:{ username:"" },
    val_at:"",
    val1:0,
    val1_by:{ username:"" },
    val1_at:"",
    val2:0,
    val2_by:{ username:"" },
    val2_at:"",
};

const standby_trx = ref({...standby_trx_temp});

const token = useCookie('token');
const field_errors = ref({});
const it_val = ref(null);
const details = ref([]);


const selected_mini_temp={
  _:{
    id:{
      tcon:"IconsBaselineNumbers",
      text:"ID",
      val:"",
    },
    name:{
      tcon:"IconsPerson",
      text:"Nama",
      val:"",
    },
    rek_no:{
      tcon:"IconsNumber",
      text:"No Rek",
      val:"",
    },
    rek_name:{
      tcon:"IconsCreditCard",
      text:"Nama Rek",
      val:"",
    },
  },
  id:-1,
  name:"",
  title:"",
};

const selected_supir = ref(JSON.parse(JSON.stringify(selected_mini_temp)));
const selected_kernet = ref(JSON.parse(JSON.stringify(selected_mini_temp)));


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

  const { data, error, status } = await useMyFetch("/standby_trx_validasi", {
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


  standby_trx.value.val = data.value.val;
  standby_trx.value.val_user = data.value.val_user;
  standby_trx.value.val_by = data.value.val_by;
  standby_trx.value.val_at = data.value.val_at;

  standby_trx.value.val1 = data.value.val1;
  standby_trx.value.val1_user = data.value.val1_user;
  standby_trx.value.val1_by = data.value.val1_by;
  standby_trx.value.val1_at = data.value.val1_at;

  standby_trx.value.val2 = data.value.val2;
  standby_trx.value.val2_user = data.value.val2_user;
  standby_trx.value.val2_by = data.value.val2_by;
  standby_trx.value.val2_at = data.value.val2_at;



  let idx= props.p_data.map((x)=>x.id).indexOf(props.id);
  if(idx>=-1){
    props.p_data.splice(idx,1,{...standby_trx.value});    
  }


  props.fnClose();
}


const callData = async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/standby_trx", {
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

  let dt =data.value.data;

  standby_trx.value = dt;

  selected_supir.value._.id.val=dt.supir_id;
  selected_supir.value._.name.val=dt.supir;
  selected_supir.value._.rek_no.val=dt.supir_rek_no;
  selected_supir.value._.rek_name.val=dt.supir_rek_name;

  selected_supir.value.id=dt.supir_id;
  selected_supir.value.name=dt.supir;
  selected_supir.value.rek_no=(dt.supir_rek_no || '')+" "+(dt.supir_rek_name || '');


  selected_kernet.value._.id.val=dt.kernet_id;
  selected_kernet.value._.name.val=dt.kernet;
  selected_kernet.value._.rek_no.val=dt.kernet_rek_no;
  selected_kernet.value._.rek_name.val=dt.kernet_rek_name;
  selected_kernet.value.id=dt.kernet_id;
  selected_kernet.value.name=dt.kernet;
  selected_kernet.value.rek_no=(dt.kernet_rek_no || '')+" "+(dt.kernet_rek_name || '');

  details.value = data.value.data.details;
}

const total_amount = computed(()=>{
  let temp = 0;

  details.value.forEach(e => {
    if(e.p_status!="Remove")
    temp += e.amount;
  });
  return temp;
})

const disabled = computed(()=>{
  return false;
  // return standby_trx.value.confirmed_by || standby_trx.value.ref_id != null;
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
