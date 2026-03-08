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

              <div class="w-6/12 sm:w-3/12 md:w-3/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Supir</label>
                <div class="card-border">
                  {{ trx_trp.supir }}
                </div>
              </div>

              <div class="w-6/12 sm:w-3/12 md:w-3/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Kernet</label>
                <div class="card-border">
                  {{ trx_trp.kernet }}
                </div>
              </div>

              <div class="w-6/12 sm:w-3/12 md:w-2/12 lg:w-2/12 flex flex-col flex-wrap p-1">
                <label for="">No Pol</label>
                <div class="card-border">
                  {{ trx_trp.no_pol }}
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

              <div v-if="trx_trp.jenis=='TBS'" class="w-full p-1">
                <label for="">Peralihan</label>
                <div class="card-border">
                  {{ trx_trp.transition_target }}
                </div>
              </div>

              <div v-if="trx_trp.jenis!='' && trx_trp.jenis!='TBSK'" class="w-full flex flex-col flex-wrap p-1">
                <label for="">Tiket A</label>
                <div class="card-border">
                  {{ trx_trp.ticket_a_no }}
                </div>
              </div>
              
              <div v-if="trx_trp.jenis!='' && trx_trp.jenis!='TBSK'" class="w-full flex flex-wrap">
                <div class="w-6/12 sm:w-6/12 md:w-3/12 lg:w-2/12 flex flex-col flex-wrap p-1">
                  <label for="">In At</label>
                  <div class="card-border disabled">
                    {{ trx_trp.ticket_a_in_at ? $moment(trx_trp.ticket_a_in_at).format("DD-MM-Y HH:mm:ss") : "-" }}
                  </div>
                </div>
                <div class="w-6/12 sm:w-6/12 md:w-3/12 lg:w-2/12 flex flex-col flex-wrap p-1">
                  <label for="">Out At</label>
                  <div class="card-border disabled">
                    {{ trx_trp.ticket_a_out_at ? $moment(trx_trp.ticket_a_out_at).format("DD-MM-Y HH:mm:ss") : "-" }}
                  </div>
                </div>
                <div class="w-3/12 sm:w-2/12 md:w-1/12 lg:w-1/12 flex flex-col flex-wrap p-1">
                  <label for="">Bruto</label>
                  <div class="card-border disabled">
                    {{ trx_trp.ticket_a_bruto ? pointFormat(trx_trp.ticket_a_bruto): 0 }}
                  </div>
                </div>
                <div class="w-3/12 sm:w-2/12 md:w-1/12 lg:w-1/12 flex flex-col flex-wrap p-1">
                  <label for="">Tara</label>
                  <div class="card-border disabled">
                    {{ trx_trp.ticket_a_tara ? pointFormat(trx_trp.ticket_a_tara): 0 }}
                  </div>
                </div>
                <div class="w-3/12 sm:w-2/12 md:w-1/12 lg:w-1/12 flex flex-col flex-wrap p-1">
                  <label for="">Netto</label>
                  <div class="card-border disabled">
                    {{ trx_trp.ticket_a_bruto ? pointFormat(trx_trp.ticket_a_bruto - trx_trp.ticket_a_tara): 0 }}
                  </div>
                </div>

                <div class="w-3/12 sm:w-2/12 md:w-2/12 lg:w-1/12 flex flex-col flex-wrap p-1">
                  <label for="">No Pol</label>
                  <div class="card-border disabled">
                    {{ trx_trp.ticket_a_no_pol }}
                  </div>
                </div>

                <div class="w-full sm:w-4/12 md:w-4/12 lg:w-4/12 flex flex-col flex-wrap p-1">
                  <label for="">Supir</label>
                  <div class="card-border disabled">
                    {{ trx_trp.ticket_a_supir }}
                  </div>
                </div>
                
              </div>
              

              <div  v-if="['TBS','TBSK'].indexOf(trx_trp.jenis) > -1" class="w-full flex flex-col flex-wrap p-1">
                <label for="">Tiket B</label>
                <div class="card-border">
                  {{ trx_trp.ticket_b_no }}
                </div>
              </div>
              <div v-if="['TBS','TBSK'].indexOf(trx_trp.jenis) > -1" class="w-full flex flex-wrap">
                <div class="w-6/12 sm:w-6/12 md:w-3/12 lg:w-2/12 flex flex-col flex-wrap p-1">
                  <label for="">In At</label>
                  <div class="card-border disabled">
                    {{ trx_trp.ticket_b_in_at ? $moment(trx_trp.ticket_b_in_at).format("DD-MM-Y HH:mm:ss") : "-" }}
                  </div>
                </div>
                <div class="w-6/12 sm:w-6/12 md:w-3/12 lg:w-2/12 flex flex-col flex-wrap p-1">
                  <label for="">Out At</label>
                  <div class="card-border disabled">
                    {{ trx_trp.ticket_b_out_at ? $moment(trx_trp.ticket_b_out_at).format("DD-MM-Y HH:mm:ss") : "-" }}
                  </div>
                </div>
                <div class="w-3/12 sm:w-2/12 md:w-1/12 lg:w-1/12 flex flex-col flex-wrap p-1">
                  <label for="">Bruto </label>
                  <div class="card-border disabled">
                    {{ trx_trp.ticket_b_bruto ? pointFormat(trx_trp.ticket_b_bruto): 0 }}
                  </div>
                </div>
                <div class="w-3/12 sm:w-2/12 md:w-1/12 lg:w-1/12 flex flex-col flex-wrap p-1">
                  <label for="">Tara </label>
                  <div class="card-border disabled">
                    {{ trx_trp.ticket_b_tara ? pointFormat(trx_trp.ticket_b_tara): 0 }}
                  </div>
                </div>
                <div class="w-3/12 sm:w-2/12 md:w-1/12 lg:w-1/12 flex flex-col flex-wrap p-1">
                  <label for="">Netto </label>
                  <div class="card-border disabled">
                    {{ trx_trp.ticket_b_bruto ? pointFormat(trx_trp.ticket_b_bruto - trx_trp.ticket_b_tara): 0 }}
                  </div>
                </div>

                <div class="w-3/12 sm:w-2/12 md:w-2/12 lg:w-1/12 flex flex-col flex-wrap p-1">
                  <label for="">No Pol</label>
                  <div class="card-border disabled">
                    {{ trx_trp.ticket_b_no_pol }}
                  </div>
                </div>

                <div class="w-full sm:w-4/12 md:w-4/12 lg:w-4/12 flex flex-col flex-wrap p-1">
                  <label for="">Supir</label>
                  <div class="card-border disabled">
                    {{ trx_trp.ticket_b_supir }}
                  </div>
                </div>
              </div>
              
              <div v-if="['CPO','PK'].indexOf(trx_trp.jenis) > -1" class="w-full sm:w-6/12 md:w-3/12 lg:w-2/12 flex flex-col flex-wrap p-1">
                <label for="">In At</label>
                <div class="card-border">
                  {{ trx_trp.ticket_b_in_at ? $moment(trx_trp.ticket_b_in_at).format("DD-MM-Y HH:mm:ss") : "" }}
                </div>
              </div>

              <div v-if="['CPO','PK'].indexOf(trx_trp.jenis) > -1" class="w-full sm:w-6/12 md:w-3/12 lg:w-2/12 flex flex-col flex-wrap p-1">
                <label for="">Out At</label>
                <div class="card-border">
                  {{trx_trp.ticket_b_out_at ? $moment(trx_trp.ticket_b_out_at).format("DD-MM-Y HH:mm:ss"):"" }}
                </div>
              </div>
                     
              <div v-if="['CPO','PK'].indexOf(trx_trp.jenis) > -1" class="w-3/12 sm:w-2/12 md:w-1/12 lg:w-1/12 flex flex-col flex-wrap p-1">
                <label for="">Bruto</label>
                <div class="card-border">
                    {{ pointFormat(trx_trp.ticket_b_bruto || 0) }}
                  </div>
              </div>

              <div v-if="['CPO','PK'].indexOf(trx_trp.jenis) > -1" class="w-3/12 sm:w-2/12 md:w-1/12 lg:w-1/12 flex flex-col flex-wrap p-1">
                <label for="">Tara</label>
                <div class="card-border">
                    {{ pointFormat(trx_trp.ticket_b_tara || 0) }}
                  </div>
              </div>

              <div v-if="['CPO','PK'].indexOf(trx_trp.jenis) > -1" class="w-3/12 sm:w-2/12 md:w-1/12 lg:w-1/12 flex flex-col flex-wrap p-1">
                <label for="">Netto</label>
                <div class="card-border ">
                    {{ pointFormat(trx_trp.ticket_b_netto || 0) }}
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
    ticket_a_id: -1,
    ticket_a_no: "",
    ticket_a_bruto:0,
    ticket_a_tara:0,
    ticket_a_netto:0,
    ticket_a_supir:"",
    ticket_a_no_pol:"",
    ticket_a_in_at:"",
    ticket_a_out_at:"",

    ticket_b_id: -1,
    ticket_b_no: "",
    ticket_b_bruto:0,
    ticket_b_tara:0,
    ticket_b_netto:0,
    ticket_b_supir:"",
    ticket_b_no_pol:"",
    ticket_b_in_at:"",
    ticket_b_out_at:"",

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
};
const trx_trp = ref({...trx_trp_temp});

const token = useCookie('token');

const it_val = ref(null);

const doSave = async () => {
  useCommonStore().loading_full = true;

  const data_in = new FormData();
  // data_in.append("tanggal", $moment(trx_trp.value.tanggal).format("Y-MM-DD"));
  // data_in.append("tipe", trx_trp.value.tipe);
  
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

  trx_trp.value = data.value.data;
}

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
