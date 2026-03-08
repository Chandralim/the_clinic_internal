<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Form Transaction'" :fn="fnClose" class="w-100 flex align-items-center"
        style="color:white;" />

        <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white">
          <div class="w-full flex flex-col items-center grow overflow-auto">
            <div class="w-full flex flex-row flex-wrap">

              <div class="w-6/12 sm:w-3/12 md:w-2/12 lg:w-2/12 flex flex-col flex-wrap p-1">
                <label for="">U.Jalan Per</label>
                <div class="grow" v-if="trx_trp.pvr_no==''">
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
                  <div class="card-border" :class="trx_trp.pvr_no!='' ? 'unselectable':''">
                    {{ trx_trp.tanggal ? $moment(trx_trp.tanggal).format("DD-MM-YYYY") : "" }}
                  </div>
                </div>
                <p class="text-red-500">{{ field_errors.tanggal }}</p>
              </div>

              <div class="w-6/12 sm:w-3/12 md:w-2/12 lg:w-2/12 flex flex-col flex-wrap p-1">
                <label for="">Jenis</label>
                <select v-model="trx_trp.jenis" @change="changeJenis($event)" :disabled="trx_trp.pvr_no!=''">
                  <option value="TBS">TBS</option>
                  <option value="TBSK">TBSK</option>
                  <option value="CPO">CPO</option>
                  <option value="PK">PK</option>
                </select>
                <p class="text-red-500">{{ field_errors.jenis }}</p>
              </div>

              <div class="w-6/12 sm:w-3/12 md:w-3/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Supir</label>
                <input type="text" list="supir"  v-model="trx_trp.supir" :disabled="trx_trp.pvr_no!=''"/>
                <datalist id="supir">
                  <option v-for="lk in list_supir" :value="lk.name" >{{lk.name}}</option>
                </datalist>
                <p class="text-red-500">{{ field_errors.supir }}</p>
              </div>

              <div class="w-6/12 sm:w-3/12 md:w-3/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Kernet</label>
                <input type="text" list="kernet"  v-model="trx_trp.kernet" :disabled="trx_trp.pvr_no!=''"/>
                <datalist id="kernet">
                  <option v-for="lk in list_kernet" :value="lk.name" >{{lk.name}}</option>
                </datalist>
                <p class="text-red-500">{{ field_errors.kernet }}</p>
              </div>

              <div class="w-6/12 sm:w-3/12 md:w-2/12 lg:w-2/12 flex flex-col flex-wrap p-1">
                <label for="">No Pol</label>
                <input type="text" list="vehicle"  v-model="trx_trp.no_pol" :disabled="trx_trp.pvr_no!=''"/>
                <datalist id="vehicle">
                  <option v-for="lv in list_vehicle" :value="lv.no_pol" >{{lv.no_pol}}</option>
                </datalist>
                <p class="text-red-500">{{ field_errors.no_pol }}</p>
              </div>
          

              <div v-if="trx_trp.jenis!=''" class="w-full flex flex-wrap">
                <div class="w-6/12 sm:w-4/12 md:w-4/12 lg:w-4/12 flex flex-col flex-wrap p-1">
                  <label for="">Tujuan</label>
                  <select v-model="trx_trp.xto" :disabled="trx_trp.pvr_no!=''">
                    <option v-for="lt in list_to">{{lt}}</option>
                  </select>
                  <p class="text-red-500">{{ field_errors.xto }}</p>
                </div>

                <div class="w-6/12 sm:w-4/12 md:w-4/12 lg:w-4/12 flex flex-col flex-wrap p-1">
                  <label for="">Tipe</label>
                  <select v-model="trx_trp.id_uj" :disabled="trx_trp.pvr_no!=''">
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
                  <input type="text" list="pv"  v-model="trx_trp.pv_no" :disabled="trx_trp.pvr_no!=''"/>
                  <datalist id="pv">
                    <option v-for="lp in list_pv" :value="lp.VoucherNo" >{{lp.VoucherNo +'-'+ lp.AssociateName}}</option>
                  </datalist>
                  <!-- {{list_pv_to_minilist}} -->
                  <div>
                    <!-- <MiniList  
                    class="w-full h-full p-1" 
                    type="text" 
                    :value="trx_trp.pv_no" 
                    @input="trx_trp.pv_no = $event"
                    :lists="list_pv_to_minilist"
                    /> -->
                    
                  </div>
                  <p class="text-red-500">{{ field_errors.pv }}</p>
                </div>
  
                <div class="w-6/12 sm:w-4/12 flex flex-col flex-wrap p-1">
                  <label for="">PV Amount</label>
                  <div class="card-border disabled">
                    {{  pointFormat(trx_trp.pv_total) }}
                  </div>
                </div>
              </div>

              <div v-if="trx_trp.jenis=='TBS'" class="w-full p-1" @change="changeTransitionTo($event)">
                <label for="">Peralihan</label>
                <select v-model="trx_trp.transition_to">
                  <option value=""></option>
                  <option v-for="v in useCommonStore().list_pabrik" :value="v">{{ v }}</option>
                </select>
                <p class="text-red-500">{{ field_errors.transition_to }}</p>
              </div>

              <div v-if="trx_trp.jenis!='' && trx_trp.jenis!='TBSK'" class="w-full flex flex-col flex-wrap p-1">
                <label for="">Tiket A</label>
                <input type="text" list="ticket_a"  v-model="trx_trp.ticket_a_no"/>
                <datalist id="ticket_a">
                  <option v-for="lat1 in list_a_ticket" :value="lat1.TicketNo">{{lat1.TicketNo + "-" + lat1.VehicleNo + "-" + lat1.NamaSupir}}</option>
                </datalist>
                <p class="text-red-500">{{ field_errors.ticket }}</p>
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
              

              <div v-if="['TBS','TBSK'].indexOf(trx_trp.jenis) > -1" class="w-full flex flex-col flex-wrap p-1">
                <label for="">Tiket B</label>
                <input type="text" list="ticket_b"  v-model="trx_trp.ticket_b_no"/>
                <datalist id="ticket_b">
                  <option v-for="lbt1 in list_b_ticket" :value="lbt1.TicketNo">{{lbt1.TicketNo + "-" + lbt1.VehicleNo + "-" + lbt1.NamaSupir}}</option>
                </datalist>
                <p class="text-red-500">{{ field_errors.ticket }}</p>
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

              <div v-if="['CPO','PK'].indexOf(trx_trp.jenis) > -1" class="w-full sm:w-6/12 md:w-3/12 lg:w-2/12 flex flex-col p-1">
                <label for="">In At</label>
                <ClientOnly>
                  <vue-date-picker  v-model="trx_trp.ticket_b_in_at" 
                  type="datetime" 
                  format="dd-MM-yyyy HH:mm" 
                  :enable-time-picker = "true" 
                  text-input
                  teleport-center></vue-date-picker>
                </ClientOnly>
                <p class="text-red-500">{{ field_errors.ticket_b_in_at }}</p>
              </div>

              <div v-if="['CPO','PK'].indexOf(trx_trp.jenis) > -1" class="w-full sm:w-6/12 md:w-3/12 lg:w-2/12 flex flex-col p-1">
                <label for="">Out At</label>
                <ClientOnly>
                  <vue-date-picker  v-model="trx_trp.ticket_b_out_at" 
                  type="datetime" 
                  format="dd-MM-yyyy HH:mm" 
                  :enable-time-picker = "true" 
                  text-input
                  teleport-center></vue-date-picker>
                </ClientOnly>
                <p class="text-red-500">{{ field_errors.ticket_b_out_at }}</p>
              </div>
                     
              <div v-if="['CPO','PK'].indexOf(trx_trp.jenis) > -1" class="w-3/12 sm:w-2/12 md:w-1/12 lg:w-1/12 flex flex-col flex-wrap p-1">
                <label for="">Bruto</label>
                <div>
                  <InputPointFormat
                    class="card-border p-1" 
                    type="text" 
                    :value="trx_trp.ticket_b_bruto || 0" 
                    @input="trx_trp.ticket_b_bruto = $event"
                    :show="show"/>
                </div>
                <p class="text-red-500">{{ field_errors.ticket_b_bruto }}</p>
              </div>

              <div v-if="['CPO','PK'].indexOf(trx_trp.jenis) > -1" class="w-3/12 sm:w-2/12 md:w-1/12 lg:w-1/12 flex flex-col flex-wrap p-1">
                <label for="">Tara</label>
                <div>
                  <InputPointFormat
                    class="card-border p-1" 
                    type="text" 
                    :value="trx_trp.ticket_b_tara || 0" 
                    @input="trx_trp.ticket_b_tara = $event"
                    :show="show"/>
                </div>
                <p class="text-red-500">{{ field_errors.ticket_b_tara }}</p>
              </div>

              <div v-if="['CPO','PK'].indexOf(trx_trp.jenis) > -1" class="w-3/12 sm:w-2/12 md:w-1/12 lg:w-1/12 flex flex-col flex-wrap p-1">
                <label for="">Netto</label>
                <div class="card-border disabled">
                    {{ trx_trp.ticket_b_bruto ? pointFormat(trx_trp.ticket_b_bruto - trx_trp.ticket_b_tara): 0 }}
                </div>
              </div>

            </div>
          </div>
          
          <div class="w-full flex items-center justify-end">
            <!-- <button type="button" name="button" class="w-36 m-1 bg-yellow-600 text-white" @click="fnLoadDBData()">
              Load DB Data
            </button> -->
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
  list_ticket:{
    type:Array,
    required:true,
    default:[]
  },
  list_pv:{
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
    cost_center_code:"",
    cost_center_desc:"",
    pvr_id:"",
    pvr_no:"",
    pvr_total:0,
    pvr_had_detail:"",
    transition_to:"",
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
  trx_trp.value.ticket_a_no = "";
  
  trx_trp.value.ticket_b_id = "";
  trx_trp.value.ticket_b_bruto = "";
  trx_trp.value.ticket_b_tara = "";
  trx_trp.value.ticket_b_netto = "";
  trx_trp.value.ticket_b_in_at = "";
  trx_trp.value.ticket_b_out_at = "";
  trx_trp.value.ticket_b_supir = "-";
  trx_trp.value.ticket_b_no_pol = "-";
  trx_trp.value.ticket_b_no = "";
  
  trx_trp.value.transition_to = ($e.target.value=="TBS") ? trx_trp.value.transition_to : "";
  props.fnLoadDBData($e.target.value,trx_trp.value.transition_to);
}

const changeTransitionTo=($e)=>{
  if(trx_trp.value.jenis=="TBS"){
    props.fnLoadDBData(trx_trp.value.jenis,$e.target.value);
  }
}
const { display } = useAlertStore();

const doSave = async () => {

  if(trx_trp.value.pv_no && parseInt(trx_trp.value.pv_total) != parseInt(trx_trp.value.amount))
  {
    display({ show: true, status: "Failed", message: "Total dari Ujalan dan PV tidak cocok" });
    return;
  }
  
  useCommonStore().loading_full = true;
  field_errors.value = {};

  const data_in = new FormData();
  data_in.append("tanggal", $moment(trx_trp.value.tanggal).format("Y-MM-DD"));
  // data_in.append("tanggalx", $moment(trx_trp.value.tanggal).format("Y-MM-DD HH:mm:ss"));
  // data_in.append("tanggaly", trx_trp.value.tanggal);
  
  data_in.append("jenis", trx_trp.value.jenis);
  data_in.append("id_uj", trx_trp.value.id_uj);
  data_in.append("xto", trx_trp.value.xto);
  data_in.append("cost_center_code", trx_trp.value.cost_center_code);
  data_in.append("online_status", props.online_status);
  data_in.append("transition_to", trx_trp.value.transition_to);
  // data_in.append("amount", trx_trp.value.amount);


  if(trx_trp.value.pv_no){
    let pv = props.list_pv.filter(
      (x)=>x.VoucherNo == trx_trp.value.pv_no
    );
    if(pv.length == 0 && trx_trp.value.pv_no == trx_trp_loaded.pv_no)
    data_in.append("pv_id", trx_trp_loaded.pv_id);
    else
    data_in.append("pv_id", pv[0].VoucherID);
  }

  if(trx_trp.value.ticket_a_no){
    let ticket = list_a_ticket.value.filter(
      (x)=>x.TicketNo == trx_trp.value.ticket_a_no
    );
    if(ticket.length == 0 && trx_trp.value.ticket_a_no == trx_trp_loaded.ticket_a_no)
    data_in.append("ticket_a_id", trx_trp_loaded.ticket_a_id);
    else
    data_in.append("ticket_a_id", ticket[0].TicketID);
  }

  if(trx_trp.value.ticket_b_no){
    let ticket = list_b_ticket.value.filter(
      (x)=>x.TicketNo == trx_trp.value.ticket_b_no
    );
    if(ticket.length == 0 && trx_trp.value.ticket_b_no == trx_trp_loaded.ticket_b_no)
    data_in.append("ticket_b_id", trx_trp_loaded.ticket_b_id);
    else
    data_in.append("ticket_b_id", ticket[0].TicketID);
  }

  data_in.append("ticket_a_no", trx_trp.value.ticket_a_no);
  data_in.append("ticket_b_no", trx_trp.value.ticket_b_no);

  data_in.append("ticket_b_bruto", trx_trp.value.ticket_b_bruto);
  data_in.append("ticket_b_tara", trx_trp.value.ticket_b_tara);
  // data_in.append("ticket_b_netto", trx_trp.value.ticket_b_netto);
  if(trx_trp.value.ticket_b_in_at)
  data_in.append("ticket_b_in_at", $moment(trx_trp.value.ticket_b_in_at).format("Y-MM-DD HH:mm:ss"));
  if(trx_trp.value.ticket_b_out_at)
  data_in.append("ticket_b_out_at", $moment(trx_trp.value.ticket_b_out_at).format("Y-MM-DD HH:mm:ss"));

  data_in.append("supir", trx_trp.value.supir);
  data_in.append("kernet", trx_trp.value.kernet);
  data_in.append("no_pol", trx_trp.value.no_pol);
  
  let $method = "post";

  let id = props.id;
  if (id == 0) {
  } else {
    // $method = "put";
    // data_in['id'] = id;
    data_in.append("id", id);
    data_in.append("_method", "PUT");
  }

  const { data, error, status } = await useMyFetch("/trx_trp", {
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

  
  trx_trp.value.ticket_a_netto = trx_trp.ticket_a_bruto - trx_trp.ticket_a_tara;
  trx_trp.value.ticket_b_netto = trx_trp.ticket_b_bruto - trx_trp.ticket_b_tara;

  trx_trp.value.pvr_id = data.value.pvr_id;
  trx_trp.value.pvr_no = data.value.pvr_no;
  trx_trp.value.pvr_total = data.value.pvr_total;
  trx_trp.value.pvr_had_detail = data.value.pvr_had_detail;
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
  // router.go(-1);
}

// // const exclude_id = computed({
// //   get(){
// //     return trx_trp.value.warehouse?.id || trx_trp.value.warehouse_target?.id;
// //   },
// //   set(){
    
// //   }
// // })

const list_to = computed(()=>{
  let jenisF = trx_trp.value.jenis == 'TBSK' ? 'TBS' : trx_trp.value.jenis;
  return [...new Set(list_ujalan.value.filter((x)=>x.jenis==jenisF).map((x)=>x.xto))];
})

const list_tipe = computed(()=>{
  let jenisF = trx_trp.value.jenis == 'TBSK' ? 'TBS' : trx_trp.value.jenis;
  return list_ujalan.value.filter((x)=>x.xto == trx_trp.value.xto && x.jenis==jenisF);
})

const list_supir = computed(()=>{
  return [...new Set(list_employee.value.filter((x)=>x.role=="Supir"))];
})

const list_kernet = computed(()=>{
  return [...new Set(list_employee.value.filter((x)=>x.role=="Kernet"))];
})

// const list_pv_to_minilist = computed(()=>{
//   // return list_ujalan.value.map((x)=>{return {get:x.TicketNo,show:x.TicketNo + "-" + x.AssociateName}});
//   return props.list_pv.map((x)=>{return {get:x.TicketNo,show:x.TicketNo + "-" + x.AssociateName}});
// })



const list_a_ticket = computed(()=>{
  let jenis = [];
  if(trx_trp.value.jenis == "CPO"){
    jenis=["cpo"];
  }else if(trx_trp.value.jenis == "PK"){
    jenis=["kernel"];
  }else{
    jenis=["mtbs"];
  }
  return props.list_ticket.filter((x)=>jenis.indexOf(x.ProductName.toLowerCase())>-1);
})

const list_b_ticket = computed(()=>{
  let jenis = [];
  if(trx_trp.value.jenis == "TBSK" || trx_trp.value.transition_to!=""){
    jenis=["tbs"];
  }else if(trx_trp.value.jenis == "TBS"){
    jenis=["rtbs"];
  }
  return props.list_ticket.filter((x)=>jenis.indexOf(x.ProductName.toLowerCase())>-1);
  // return props.list_ticket.filter((x)=>["RTBS"].indexOf(x.ProductName)>-1);
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
  trx_trp_loaded = {...data.value.data};

  props.fnLoadDBData(trx_trp.value.jenis,trx_trp.value.transition_to);
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
      // 'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    // params: {id:props.id},
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

  list_ujalan.value = data.value.list_ujalan;
  list_vehicle.value = data.value.list_vehicle;
  list_employee.value = data.value.list_employee;
}



watch(() => props.show, (newVal, oldVal) => {
  if (newVal == true){
    loadLocalDT();
    trx_trp.value = {...trx_trp_temp};
    field_errors.value = {};
    if(props.id!=0)
    callData();
  }
}, {
  immediate: true
});

let $return_ticket = {id:-1,bruto:0,tara:0,netto:0,supir:"-",no_pol:"-",in_at:"",out_at:""}; 
watch(()=>trx_trp.value.ticket_a_no, (newVal, oldVal) => {
  if (newVal=="" || newVal){
    if(newVal){
      let hrg = list_a_ticket.value.filter(
        (x)=>x.TicketNo == trx_trp.value.ticket_a_no
      );
      if(hrg.length  > 0)  
      $return_ticket = {
        id:hrg[0].TicketID,
        bruto:hrg[0].Bruto,
        tara:hrg[0].Tara,
        netto:hrg[0].Netto,
        supir:hrg[0].NamaSupir,
        no_pol:hrg[0].VehicleNo,
        in_at:hrg[0].DateTimeIn,
        out_at:hrg[0].DateTimeOut,
      };
      else if(trx_trp.value.ticket_a_no == trx_trp_loaded.ticket_a_no)
      $return_ticket = {
        id:trx_trp_loaded.ticket_a_id,
        bruto:trx_trp_loaded.ticket_a_bruto,
        tara:trx_trp_loaded.ticket_a_tara,
        netto:trx_trp_loaded.ticket_a_netto,
        supir:trx_trp_loaded.ticket_a_supir,
        no_pol:trx_trp_loaded.ticket_a_no_pol,
        in_at:trx_trp_loaded.ticket_a_in_at,
        out_at:trx_trp_loaded.ticket_a_out_at,
      };
    }

    if(newVal==""){
      $return_ticket = {id:-1,bruto:0,tara:0,netto:0,supir:"-",no_pol:"-",in_at:"",out_at:""}; 
    }

    trx_trp.value.ticket_a_id = $return_ticket.id;
    trx_trp.value.ticket_a_bruto = $return_ticket.bruto;
    trx_trp.value.ticket_a_tara = $return_ticket.tara;
    trx_trp.value.ticket_a_netto = $return_ticket.netto;
    trx_trp.value.ticket_a_in_at = $return_ticket.in_at;
    trx_trp.value.ticket_a_out_at = $return_ticket.out_at;

    trx_trp.value.ticket_a_supir = $return_ticket.supir;
    trx_trp.value.ticket_a_no_pol = $return_ticket.no_pol;
  }

}, {
  deep:true,
  immediate: true
});

watch(()=>trx_trp.value.ticket_b_no, (newVal, oldVal) => {
  if (["TBS","TBSK"].indexOf(trx_trp.value.jenis) > -1 && (newVal=="" || newVal)){
    if(newVal){
      let hrg = list_b_ticket.value.filter(
        (x)=>x.TicketNo == trx_trp.value.ticket_b_no
      );
      if(hrg.length  > 0)  
      $return_ticket = {
        id:hrg[0].TicketID,
        bruto:hrg[0].Bruto,
        tara:hrg[0].Tara,
        netto:hrg[0].Netto,
        supir:hrg[0].NamaSupir,
        no_pol:hrg[0].VehicleNo,
        in_at:hrg[0].DateTimeIn,
        out_at:hrg[0].DateTimeOut,
      };
      else if(trx_trp.value.ticket_b_no == trx_trp_loaded.ticket_b_no)
      $return_ticket = {
        id:trx_trp_loaded.ticket_b_id,
        bruto:trx_trp_loaded.ticket_b_bruto,
        tara:trx_trp_loaded.ticket_b_tara,
        netto:trx_trp_loaded.ticket_b_netto,
        supir:trx_trp_loaded.ticket_b_supir,
        no_pol:trx_trp_loaded.ticket_b_no_pol,
        in_at:trx_trp_loaded.ticket_b_in_at,
        out_at:trx_trp_loaded.ticket_b_out_at,
      };
    }

    if(newVal==""){
      $return_ticket = {id:-1,bruto:0,tara:0,netto:0,supir:"-",no_pol:"-",in_at:"",out_at:""}; 
    }

    trx_trp.value.ticket_b_id = $return_ticket.id;
    trx_trp.value.ticket_b_bruto = $return_ticket.bruto;
    trx_trp.value.ticket_b_tara = $return_ticket.tara;
    trx_trp.value.ticket_b_netto = $return_ticket.netto;
    trx_trp.value.ticket_b_in_at = $return_ticket.in_at;
    trx_trp.value.ticket_b_out_at = $return_ticket.out_at;

    trx_trp.value.ticket_b_supir = $return_ticket.supir;
    trx_trp.value.ticket_b_no_pol = $return_ticket.no_pol;
  }

}, {
  deep:true,
  immediate: true
});


watch(()=>trx_trp.value.pv_no, (newVal, oldVal) => {
  let $total = 0;
  if (newVal=="" || newVal){
    let hrg = props.list_pv.filter(
      (x)=>x.VoucherNo == trx_trp.value.pv_no
    );

    if(hrg.length  > 0) 
    $total = hrg[0].total_amount;
    else if(trx_trp.value.pv_no == trx_trp_loaded.pv_no) 
    $total = trx_trp_loaded.pv_total;

    trx_trp.value.pv_total = $total;
  }
}, {
  deep:true,
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
