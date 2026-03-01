<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Form Transaction Validation'" :fn="fnClose" class="w-100 flex align-items-center"
        style="color:white;" />

      <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white">
        <div class="w-full flex flex-col items-center grow overflow-auto">
          <div class="w-full flex flex-row flex-wrap">

            <div class="w-6/12 sm:w-3/12 md:w-2/12 lg:w-2/12 flex flex-col flex-wrap p-1">
              <label for="">U.Jalan Per</label>
              <div class="card-border">
                {{ trx_trp.tanggal ? $moment(trx_trp.tanggal).format("DD-MM-YYYY") : "" }}
              </div>
            </div>

            <div class="w-6/12 sm:w-3/12 md:w-2/12 lg:w-2/12 flex flex-col flex-wrap p-1">
              <label for="">Jenis</label>
              <div class="card-border">
                {{ trx_trp.jenis }}
              </div>
            </div>

            <div class="w-6/12 sm:w-3/12 md:w-2/12 lg:w-2/12 flex flex-col flex-wrap p-1">
              <label for="">No Pol</label>
              <div class="card-border">
                {{ trx_trp.no_pol }}
              </div>
            </div>

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
          
            <div v-if="trx_trp.jenis!=''" class="w-full flex flex-wrap">
              <div class="w-6/12 sm:w-4/12 md:w-4/12 lg:w-4/12 flex flex-col flex-wrap p-1">
                <label for="">Tujuan</label>
                <div class="card-border">
                  {{ trx_trp.xto }}
                </div>
              </div>

              <div class="w-6/12 sm:w-4/12 md:w-4/12 lg:w-4/12 flex flex-col flex-wrap p-1">
                <label for="">Tipe</label>
                <div class="card-border">
                  {{ trx_trp.tipe }}
                </div>
              </div>

              <div class="w-6/12 sm:w-4/12 md:w-4/12 lg:w-4/12 flex flex-col flex-wrap p-1">
                <label for="">Total Dari U.Jalan</label>
                <div class="card-border ">
                  {{pointFormat(trx_trp.amount || 0) }}
                </div>
              </div>
            </div>

            <div v-if="trx_trp.jenis!=''" class="w-full flex flex-wrap">
              <div class="w-6/12 sm:w-4/12 flex flex-col flex-wrap p-1">
                <label for="">Cost Center Code</label>
                <div class="card-border">
                  {{ trx_trp.cost_center_code }}
                </div>
              </div>

              <div class="w-6/12 sm:w-8/12 flex flex-col flex-wrap p-1">
                <label for="">Cost Center Desc</label>
                <div class="card-border">
                  {{ trx_trp.cost_center_desc }}
                </div>
              </div>

              <div class="w-6/12 sm:w-8/12 flex flex-col flex-wrap p-1">
                <label for="">PVR No</label>
                <div class="card-border">
                  {{ trx_trp.pvr_no }}
                </div>
              </div>

              <div class="w-6/12 sm:w-4/12 flex flex-col flex-wrap p-1">
                <label for="">PVR Total</label>
                <div class="card-border">
                  {{ pointFormat(trx_trp.pvr_total || 0) }}
                </div>
              </div>


              <div class="w-6/12 sm:w-8/12 flex flex-col flex-wrap p-1">
                <label for="">PV</label>
                <div class="card-border">
                  {{ trx_trp.pv_no }}
                </div>
              </div>

              <div class="w-6/12 sm:w-4/12 flex flex-col flex-wrap p-1">
                <label for="">PV Amount</label>
                <div class="card-border ">
                  {{  pointFormat(trx_trp.pv_total || 0) }}
                </div>
              </div>
            </div>

          </div>
        </div>
        
        <div class="w-full flex items-center justify-end">
          <div class="w-full flex flex-wrap p-3 items-center">
            <div>
              Di Validasi oleh : 
            </div>
            <div v-if="trx_trp.val || trx_trp.val1 || trx_trp.val2" class="border-solid border-2 w-fit p-1 bg-slate-700 text-white text-xs">
              <div v-if="trx_trp.val">
                App 1 : {{ trx_trp.val_by.username}} ( {{ trx_trp.val_at ? $moment(trx_trp.val_at).format("DD-MM-YYYY HH:mm:ss") :"" }} )
              </div>
              <div v-if="trx_trp.val1">
                App 2 : {{ trx_trp.val1_by.username}} ( {{ trx_trp.val1_at ? $moment(trx_trp.val1_at).format("DD-MM-YYYY HH:mm:ss") :"" }} )
              </div>
              <div v-if="trx_trp.val2">
                App 3 : {{ trx_trp.val2_by.username}} ( {{ trx_trp.val2_at ? $moment(trx_trp.val2_at).format("DD-MM-YYYY HH:mm:ss") :"" }} )
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
import { useErrorStore } from '~/store/error';
import { useCommonStore } from '~/store/common';
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

const trx_trp_temp = {
    id: -1,
    tanggal: new Date(),
    id_uj: -1,
    xto: "",
    tipe: "",
    jenis:"",
    amount: 0,
    pv_id: -1,
    pv_no:"",
    pv_total:0,
    supir: "",
    kernet: "",
    no_pol: '',
    val:0,
    val_by:{ username:"" },
    val_at:"",
    val1:0,
    val1_by:{ username:"" },
    val1_at:"",
    val2:0,
    val2_by:{ username:"" },
    val2_at:"",
    cost_center_code:"",
    cost_center_desc:"",
    pvr_id:"",
    pvr_no:"",
    pvr_total:"",
    pvr_had_detail:"",
};
const trx_trp = ref({...trx_trp_temp});

const token = useCookie('token');


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

  const data_in = new FormData();
  
  let $method = "post";

  let id = props.id;
  if (id == 0) {
  } else {
    data_in.append("id", id);
    data_in.append("_method", "PUT");
  }

  const { data, error, status } = await useMyFetch("/trx_trp_validasi", {
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
    useErrorStore().trigger(error);
    return;
  }
  
  trx_trp.value.val = data.value.val;
  trx_trp.value.val_user = data.value.val_user;
  trx_trp.value.val_by = data.value.val_by;
  trx_trp.value.val_at = data.value.val_at;

  trx_trp.value.val1 = data.value.val1;
  trx_trp.value.val1_user = data.value.val1_user;
  trx_trp.value.val1_by = data.value.val1_by;
  trx_trp.value.val1_at = data.value.val1_at;

  trx_trp.value.val2 = data.value.val2;
  trx_trp.value.val2_user = data.value.val2_user;
  trx_trp.value.val2_by = data.value.val2_by;
  trx_trp.value.val2_at = data.value.val2_at;

  let idx= props.p_data.map((x)=>x.id).indexOf(props.id);
  if(idx>=-1){
    props.p_data.splice(idx,1,{...trx_trp.value});    
  }

  props.fnClose();
}

const callData = async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/trx_trp", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json'
    },
    params: {id:props.id},
    retry: 0,
  });
  useCommonStore().loading_full = false;

  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return;
  }


  let dt =data.value.data;
  trx_trp.value = dt;
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

}

watch(() => props.show, (newVal, oldVal) => {
  if (newVal == true){
    callData();
  }
}, {
  immediate: true
});
</script>
