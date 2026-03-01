<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Form Transaction'" :fn="fnClose" class="w-full flex align-items-center" style="color:white;" />

      <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white">
        <div class="w-full flex flex-col items-center grow overflow-auto">
          <div class="w-full flex flex-row flex-wrap">

            <div class="w-6/12 sm:w-3/12 md:w-2/12 lg:w-2/12 flex flex-col flex-wrap p-1">
              <label for="">U.Jalan Per</label>
              <div class="grow" v-if="trx_trp.val!==1">
                <ClientOnly>
                  <vue-date-picker  v-model="trx_trp.tanggal" 
                  type="datetime" 
                  format="dd-MM-yyyy"
                  :enable-time-picker = "false" 
                  text-input
                  teleport-center></vue-date-picker>
                </ClientOnly>
              </div>
              <div class="grow" v-else>
                <div class="card-border disabled" :class="trx_trp.pvr_no!='' ? 'unselectable':''">
                  {{ trx_trp.tanggal ? $moment(trx_trp.tanggal).format("DD-MM-YYYY") : "" }}
                </div>
              </div>
              <p class="text-red-500">{{ field_errors.tanggal }}</p>
            </div>

            <div class="w-6/12 sm:w-3/12 md:w-2/12 lg:w-2/12 flex flex-col flex-wrap p-1">
              <label for="">Jenis</label>
              <select v-model="trx_trp.jenis" @change="changeJenis($event)" :disabled="trx_trp.val==1">
                <option value="TBS">TBS</option>
                <option value="TBSK">TBSK</option>
                <option value="CPO">CPO</option>
                <option value="PK">PK</option>
              </select>
              <p class="text-red-500">{{ field_errors.jenis }}</p>
            </div>

            <div class="w-6/12 sm:w-3/12 md:w-2/12 lg:w-2/12 flex flex-col flex-wrap p-1">
              <label for="">No Pol</label>
              <input type="text" list="vehicle"  v-model="trx_trp.no_pol" :disabled="trx_trp.val==1"/>
              <datalist id="vehicle">
                <option v-for="lv in list_vehicle" :value="lv.no_pol" >{{lv.no_pol}}</option>
              </datalist>
              <p class="text-red-500">{{ field_errors.no_pol }}</p>
            </div>

            <div class="w-full sm:w-6/12 md:w-6/12 lg:w-6/12 flex flex-col flex-wrap p-1">
              <label for="">Supir</label>
              <WidthMiniList :arr="list_emp" :selected="selected_supir" @setSelected="selected_supir=$event"/>
              <p class="text-red-500">{{ field_errors.supir_id }}</p>
            </div>

            <div class="w-full sm:w-6/12 md:w-6/12 lg:w-6/12 flex flex-col flex-wrap p-1">
              <label for="">Kernet</label>
              <WidthMiniList :arr="list_emp" :selected="selected_kernet" @setSelected="selected_kernet=$event"/>
              <p class="text-red-500">{{ field_errors.kernet_id }}</p>
            </div>

            <div v-if="trx_trp.jenis!=''" class="w-full flex flex-wrap">
              <div class="w-6/12 sm:w-4/12 md:w-4/12 lg:w-4/12 flex flex-col flex-wrap p-1">
                <label for="">Tujuan</label>
                <select v-model="trx_trp.xto" :disabled="trx_trp.val==1">
                  <option v-for="lt in list_to">{{lt}}</option>
                </select>
                <p class="text-red-500">{{ field_errors.xto }}</p>
              </div>

              <div class="w-6/12 sm:w-4/12 md:w-4/12 lg:w-4/12 flex flex-col flex-wrap p-1">
                <label for="">Tipe</label>
                <select v-model="trx_trp.id_uj" :disabled="trx_trp.val==1">
                  <option v-for="lt in list_tipe" :value="lt.id" :selected="lt.id == trx_trp.id_uj">{{lt.tipe}}</option>
                </select>
                <p class="text-red-500">{{ field_errors.id_uj }}</p>
              </div>

              <div class="w-6/12 sm:w-4/12 md:w-4/12 lg:w-4/12 flex flex-col flex-wrap p-1">
                <label for="">Total Dari U.Jalan</label>
                <div class="card-border disabled">
                  {{pointFormat(trx_trp.amount) }}
                </div>
              </div>
            </div>

            <div v-if="trx_trp.jenis!=''" class="w-full flex flex-wrap">

              <div class="w-6/12 sm:w-4/12 flex flex-col flex-wrap p-1">
                <label for="">Cost Center Code</label>
                <input list="cost_center"  v-model="trx_trp.cost_center_code" @blur="blurCostCenterCode($event)" :disabled="trx_trp.pvr_no!=''">
                <datalist id="cost_center">
                  <option v-for="lcc in list_cost_center" :value="lcc.CostCenter">{{lcc.CostCenter +'-'+ lcc.Description}}</option>
                </datalist>
                <p class="text-red-500">{{ field_errors.cost_center_code }}</p>
              </div>

              <div class="w-6/12 sm:w-8/12 flex flex-col flex-wrap p-1">
                <label for="">Cost Center Desc</label>
                <div class="card-border disabled">
                  {{  trx_trp.cost_center_desc }}
                </div>
              </div>

              <div class="w-6/12 sm:w-8/12 flex flex-col flex-wrap p-1">
                <label for="">PVR No</label>
                <div class="card-border disabled">
                  {{  trx_trp.pvr_no }}
                </div>
              </div>

              <div class="w-6/12 sm:w-4/12 flex flex-col flex-wrap p-1">
                <label for="">PVR Total</label>
                <div class="card-border disabled">
                  {{ pointFormat(trx_trp.pvr_total || 0) }}
                </div>
              </div>


              <div class="w-6/12 sm:w-8/12 flex flex-col flex-wrap p-1">
                <label for="">PV</label>
                <div class="card-border disabled">
                  {{  trx_trp.pv_no }}
                </div>
              </div>

              <div class="w-6/12 sm:w-4/12 flex flex-col flex-wrap p-1">
                <label for="">PV Amount</label>
                <div class="card-border disabled">
                  {{  pointFormat(trx_trp.pv_total) }}
                </div>
              </div>
            </div>


          </div>
        </div>
        
        <div class="w-full flex items-center justify-end">
          <button type="button" name="button" class="w-36 m-1" @click="fnClose()">
            Cancel
          </button>
          <button v-if="!disabled" type="submit" name="button" class="w-36 m-1 bg-blue-600 text-white  rounded-sm" @click.prevent="doSave()">
            Save
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
  fnLoadDBData: {
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
  list_cost_center:{
    type:Array,
    required:true,
    default:[]
  },
  online_status:{
    type:Boolean,
    required:true,
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
    cost_center_code:"",
    cost_center_desc:"",
    pvr_id:"",
    pvr_no:"",
    pvr_total:0,
    pvr_had_detail:"",
    transition_target:"",
};
let trx_trp_loaded = {...trx_trp_temp};
const trx_trp = ref({...trx_trp_temp});

const token = useCookie('token');
const field_errors = ref({})

const blurCostCenterCode=($e)=>{
  let val = $e.target.value;
  if(!val) {
    trx_trp.value.cost_center_code='';
    trx_trp.value.cost_center_desc="";
    return;
  }
  let match = props.list_cost_center.filter(
    (x)=>x.CostCenter == val
  );

  if(match.length==0){
    trx_trp.value.cost_center_code='112';
    trx_trp.value.cost_center_desc="Transport";
  }
}

const changeJenis=($e)=>{  
  trx_trp.value.transition_target = ($e.target.value=="TBS") ? trx_trp.value.transition_target : "";
}


const { display } = useAlertStore();

const doSave = async () => {

  // if(trx_trp.value.pv_no && parseInt(trx_trp.value.pv_total) != parseInt(trx_trp.value.amount))
  // {
  //   display({ show: true, status: "Failed", message: "Total dari Ujalan dan PV tidak cocok" });
  //   return;
  // }
  
  useCommonStore().loading_full = true;
  field_errors.value = {};

  const data_in = new FormData();
  data_in.append("tanggal", $moment(trx_trp.value.tanggal).format("Y-MM-DD"));  
  data_in.append("jenis", trx_trp.value.jenis);
  data_in.append("id_uj", trx_trp.value.id_uj);
  data_in.append("xto", trx_trp.value.xto);
  data_in.append("cost_center_code", trx_trp.value.cost_center_code);
  data_in.append("online_status", props.online_status);
  data_in.append("transition_target", trx_trp.value.transition_target);

  data_in.append("no_pol", trx_trp.value.no_pol);
  data_in.append("supir_id", selected_supir.value.id);
  data_in.append("kernet_id", selected_kernet.value.id);
  
  let $method = "post";

  let id = props.id;
  if (id == 0) {
  } else {
    data_in.append("id", id);
    data_in.append("_method", "PUT");
  }

  const { data, error, status } = await useMyFetch("/trx_trp", {
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

  trx_trp.value.supir           = selected_supir.value.name;
  trx_trp.value.supir_rek_no    = selected_supir.value._.rek_no.val;
  trx_trp.value.supir_rek_name  = selected_supir.value._.rek_name.val;
  trx_trp.value.kernet          = selected_kernet.value.name;
  trx_trp.value.kernet_rek_no   = selected_kernet.value._.rek_no.val;
  trx_trp.value.kernet_rek_name = selected_kernet.value._.rek_name.val;

  trx_trp.value.updated_at = data.value.updated_at;
  if(props.id<=0){
    trx_trp.value.id = data.value.id;
    trx_trp.value.created_at = data.value.created_at;
    props.p_data.unshift(trx_trp.value);
  }else{
    let idx= props.p_data.map((x)=>x.id).indexOf(props.id);
    if(idx>=-1){
      props.p_data.splice(idx,1,{...trx_trp.value});    
    }
  }
  props.fnClose();
}

const list_to = computed(()=>{
  let jenisF = trx_trp.value.jenis == 'TBSK' ? 'TBS' : trx_trp.value.jenis;
  return [...new Set(list_ujalan.value.filter((x)=>x.jenis==jenisF).map((x)=>x.xto))];
})

const list_tipe = computed(()=>{
  let jenisF = trx_trp.value.jenis == 'TBSK' ? 'TBS' : trx_trp.value.jenis;
  return list_ujalan.value.filter((x)=>x.xto == trx_trp.value.xto && x.jenis==jenisF);
})

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
  id:"",
  name:"",
  title:"",
};

const selected_supir = ref(JSON.parse(JSON.stringify(selected_mini_temp)));
const selected_kernet = ref(JSON.parse(JSON.stringify(selected_mini_temp)));

const list_emp = computed(()=>{
  let results = [];
  list_employee.value.forEach((x,y)=>{
    let temp = JSON.parse(JSON.stringify(selected_mini_temp));
    temp._.id.val = x.id,
    temp._.name.val = x.name,
    temp._.rek_no.val = x.rek_no,
    temp._.rek_name.val = x.rek_name,

    temp.id = x.id,
    temp.name = x.name,
    temp.title = (x.rek_no || '')+" "+(x.rek_name || ''),
    
    results.push(JSON.parse(JSON.stringify(temp)));
  });
  return results;
})

const disabled = computed(()=>{
  return false;
  // return trx_trp.value.confirmed_by || trx_trp.value.ref_id != null;
});

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
  trx_trp_loaded = {...dt};
  
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

  props.fnLoadDBData();
}

const list_ujalan = ref([]);
const list_vehicle = ref([]);
const list_employee = ref([]);

const loadLocalDT = async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/trx_load_for_local", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json'
    },
    retry: 0,
  });
  useCommonStore().loading_full = false;

  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return;
  }

  list_ujalan.value = data.value.list_ujalan;
  list_vehicle.value = data.value.list_vehicle;
  list_employee.value = data.value.list_employee;
}



watch(() => props.show, async(newVal, oldVal) => {
  if (newVal == true){
    await loadLocalDT();
    await props.fnLoadDBData();

    trx_trp.value = {...trx_trp_temp};
    selected_supir.value = JSON.parse(JSON.stringify(selected_mini_temp));
    selected_kernet.value = JSON.parse(JSON.stringify(selected_mini_temp));

    field_errors.value = {};
    if(props.id!=0)
    callData();
  }
}, {
  immediate: true
});

watch(()=>trx_trp.value.cost_center_code, (newVal, oldVal) => {
  let $desc = "";
  if (newVal=="" || newVal){
    let dt = props.list_cost_center.filter(
      (x)=>x.CostCenter == trx_trp.value.cost_center_code
    );

    if(dt.length  > 0) 
    $desc = dt[0].Description;
    else if(trx_trp.value.cost_center_code == trx_trp_loaded.cost_center_code) 
    $desc = trx_trp_loaded.cost_center_desc;

    trx_trp.value.cost_center_desc = $desc;
  }
}, {
  deep:true,
  immediate: true
});


const checkAmount = (newVal, oldVal)=>{
  let $total=0;
  let $tipe = "";
  if (newVal=="" || newVal){
    let hrg = list_ujalan.value.filter(
      (x)=>x.id == trx_trp.value.id_uj
    );

    if(hrg.length  > 0)
    {
      $total = hrg[0].harga;
      $tipe = hrg[0].tipe;
    }
    else if(trx_trp.value.id_uj == trx_trp_loaded.id_uj) 
    {
      $total = trx_trp_loaded.amount;
      $tipe = trx_trp_loaded.tipe;
    }
    trx_trp.value.tipe = $tipe
    trx_trp.value.amount=$total;
  }
}

watch(()=>trx_trp.value.xto, (newVal, oldVal) => {
  if(props.show)checkAmount(newVal, oldVal);
}, {
  deep:true,
  immediate: true
});

watch(()=>trx_trp.value.id_uj, (newVal, oldVal) => {
  if(props.show)checkAmount(newVal, oldVal);
}, {
  deep:true,
  immediate: true
});

</script>
