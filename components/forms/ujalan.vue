<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Form Ujalan'" :fn="fnClose" class="w-100 flex align-items-center"
        style="color:white;" />

        <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white">
          <div class="w-full flex flex-col items-center grow overflow-auto">
            <div class="w-full flex flex-row flex-wrap">

              <div class="w-full sm:w-4/12 md:w-3/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">To</label>
                <input v-model="ujalan.xto" :disabled="role=='PabrikTransport' || disabled">
                <p class="text-red-500">{{ field_errors.xto }}</p>
              </div>
              
              

              <!-- <div class="w-full sm:w-4/12 md:w-3/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Status</label>
                <select v-model="ujalan.status">
                  <option value="Y">Y</option>
                  <option value="N">N</option>
                </select>
                <p class="text-red-500">{{ field_errors.status }}</p>
              </div> -->

              <div class="w-full sm:w-4/12 md:w-3/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Jenis</label>
                <select v-model="ujalan.jenis" :disabled="role=='PabrikTransport' || disabled">
                  <option value="PK">PK</option>
                  <option value="CPO">CPO</option>
                  <option value="TBS">TBS</option>
                </select>
                <p class="text-red-500">{{ field_errors.jenis }}</p>
              </div>
              <div class="w-full sm:w-4/12 md:w-3/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Harga</label>
                <div class="card-border disabled">
                  {{pointFormat(total_harga) }}
                </div>
                <p class="text-red-500">{{ field_errors.harga }}</p>
              </div>

              <div class="w-full sm:w-4/12 md:w-3/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Asal Peralihan</label>
                <select v-model="ujalan.transition_from" :disabled="role=='PabrikTransport' || disabled">
                  <option value=""></option>
                  <option v-for="v in useCommonStore().list_pabrik" :value="v">{{ v }}</option>
                </select>
                <p class="text-red-500">{{ field_errors.transition_from }}</p>
              </div>
              
              <div class="w-full sm:w-4/12 md:w-6/12 lg:w-6/12 flex flex-col flex-wrap p-1">
                <label for="">Tipe</label>
                <textarea v-model="ujalan.tipe" :disabled="role=='PabrikTransport' || disabled"></textarea>
                <p class="text-red-500">{{ field_errors.tipe }}</p>
              </div>

              <div class="w-full sm:w-4/12 md:w-6/12 lg:w-6/12 flex flex-col flex-wrap p-1">
                <label for="">Ket. Untuk Remarks</label>
                <textarea v-model="ujalan.note_for_remarks" :disabled="role=='PabrikTransport' || disabled"></textarea>
                <p class="text-red-500">{{ field_errors.note_for_remarks }}</p>
              </div>

            </div>

            <div class="w-full flex flex-col sm:flex-row grow p-1 justify-between flex-wrap 2xl:overflow-hidden">
              <div class="w-full max-w-full p-0 2xl:pr-1 2xl:w-1/2 2xl:max-h-full 2xl:overflow-auto">
                <div class="w-full" role="sticky">
                  <table class="tacky w-full" style="white-space:normal;">
                    <thead >
                      <tr class="sticky -top-1 !z-[2]">
                        <td :colspan="role!='PabrikTransport' && !disabled ? 7 : 6" class="!bg-slate-800 text-white font-bold">
                          Detail Uang Jalan
                        </td>
                      </tr>
                      <tr class="sticky top-7 !z-[2]">
                        <th v-if="role!='PabrikTransport' && !disabled" class="min-w-[50px] !w-[50px] max-w-[50px] ">
                          <button type="button" name="button" class="bg-yellow-600" @click="insertDefault()">
                            Default In
                          </button>
                        </th>
                        <th class="min-w-[50px] !w-[50px] max-w-[50px] ">No</th>
                        <th>Desc</th>
                        <th class="min-w-[100px] !w-[100px] max-w-[100px] ">Harga @</th>
                        <th class="min-w-[50px] !w-[50px] max-w-[50px] ">Qty</th>
                        <th class="min-w-[100px] !w-[100px] max-w-[100px] ">Total <br> <span class="text-sm">({{pointFormat(total_harga) }})</span>  </th>
                        <th class="min-w-[50px] !w-[50px] max-w-[50px] ">For Remarks</th>
                      </tr>
                    </thead>
                    <tbody ref="to_move">
                      <template v-for="(detail, index) in details" :key="index">
                        <!-- <tr v-if="detail.p_status!='Remove'"  :data-index="index" draggable="true" @dragstart="handleDragStart($event,index)" @dragover.prevent @drop="handleDrop($event,index)"> -->
                        <tr v-if="detail.p_status!='Remove'"  :data-index="index">
                          <td v-if="role!='PabrikTransport' && !disabled" class="tools cell">
                            <div class="w-full h-full flex items-center justify-center">
                              <button  type="button" name="button"
                                @click="showAction($event, index)">
                                <IconsTools />
                              </button>
                            </div>
                          </td>
                          <td>{{ index + 1 }}.</td>
                          <td class="cell">
                            <div class="w-full h-full flex items-center justify-center">
                              <textarea :disabled="role=='PabrikTransport' || disabled" class="p-1 w-full" v-model="detail.xdesc" cols="7" rows="2"></textarea>
                            </div>
                          </td>
                          <td class="cell bold" :class="role=='PabrikTransport' || disabled ? 'unselectable' : ''">
                            <div class="w-full h-full flex items-center justify-center">
                              <InputPointFormat
                              :key="index" 
                              class="w-full h-full p-1" 
                              type="text" 
                              :value="detail.harga || 0" 
                              @input="detail.harga = $event"
                              :show="show" :disabled="role=='PabrikTransport' || disabled"/>
                            </div>
                          </td>
                          <td class="cell" :class="role=='PabrikTransport' || disabled ? 'unselectable' : ''">
                            <div class="w-full h-full flex items-center justify-center">
                              <InputPointFormat
                              :key="index" 
                              class="w-full h-full p-1" 
                              type="text" 
                              :value="detail.qty || 0" 
                              @input="detail.qty = $event"
                              :show="show" :disabled="role=='PabrikTransport' || disabled"/>
                            </div>
                          </td>
                          <td class="cell">
                            <div class="w-full h-full flex items-center justify-center unselectable">                       
                              {{ pointFormat(detail.qty * detail.harga || 0) }}   
                            </div>
                          </td>

                          <td class="cell" :class="role=='PabrikTransport' || disabled ? 'unselectable' : ''">
                            <div class="w-full h-full flex items-center justify-center">
                              <div v-if="role=='PabrikTransport' || disabled" class="text-3xl">
                                <IconsTimes v-if="detail.for_remarks==0" class="text-red-800"/>
                                <IconsCheck v-else class="text-green-800"/>                                           
                              </div>

                              <button v-else type="button" @click="detail.for_remarks = (detail.for_remarks ? 0 : 1)" class="text-white w-auto rounded text-xl" :class="detail.for_remarks?'bg-green-600' : 'bg-red-600'">
                                <IconsTimes v-if="detail.for_remarks==0"/>
                                <IconsCheck v-else/>             
                              </button>
                            </div>
                          </td>

                        </tr>
                      </template>
                      
                      <tr v-if="role!='PabrikTransport' && !disabled">
                        <td class="tools cell">
                          <button type="button" name="button" @click="addList()">
                            <IconsPlus />
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="w-full max-w-full max-h-full px-0 py-2 2xl:pl-1 2xl:py-0 2xl:w-1/2 2xl:overflow-auto">
                <div class="w-full" role="sticky">
                  <table class="tacky w-full !table-auto" style="white-space:normal;">
                    <thead >
                      <tr class="sticky -top-1 !z-[2]">
                        <td :colspan="!disabled  ? 11 : 9" class="!bg-slate-800 text-white font-bold">
                          Detail PVR
                        </td>
                      </tr>
                      <tr class="sticky top-7 !z-[2]">
                        <th v-if="!disabled" class="min-w-[30px] !w-[30px] max-w-[30px] ">
                          <!-- <button type="button" name="button" class="bg-yellow-600" @click="insertDefault2()">
                            In
                          </button> -->
                        </th> 
                        <th class="min-w-[50px] !w-[50px] max-w-[50px] ">No</th>
                        <th v-if="!disabled" class="min-w-[30px] !w-[30px] max-w-[30px] "></th>
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
                          <td v-if="!disabled" class="tools cell">
                            <div class="w-full h-full flex items-center justify-center">
                              <button  type="button" name="button"
                                @click="showAction2($event, index)">
                                <IconsTools />
                              </button>
                            </div>
                          </td>
                          <td>{{ index + 1 }}.</td>
                          <td v-if="!disabled" class="cell">
                            <div class="w-full h-full flex items-center justify-center">
                              <button v-if="!detail.ac_account_id" type="button" name="button" @click="showSNSItem($event, index)">
                                ...
                              </button>
                              <button type="button" v-else @click="deleteSNSItem($event, index)" :disabled="detail.confirm_by">
                                <IconsTimes class=" font-bold text-2xl"/>
                              </button>
                            </div>
                          </td>
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
                          <td class="cell">
                            <div class="w-full h-full flex items-center justify-center">
                              <textarea :disabled="disabled" class="p-1 w-full" v-model="detail.description" cols="7" rows="2"></textarea>
                            </div>
                          </td>
                          <td class="cell bold" :class="disabled ? 'unselectable' : ''">
                            <div class="w-full h-full flex items-center justify-center">
                              <InputPointFormat
                              :key="index" 
                              class="w-full h-full p-1" 
                              type="text" 
                              :value="detail.amount || 0" 
                              @input="detail.amount = $event"
                              :show="show" :disabled="disabled"/>
                            </div>
                          </td>
                          <td class="cell" :class="disabled ? 'unselectable' : ''">
                            <div class="w-full h-full flex items-center justify-center">
                              <InputPointFormat
                              :key="index" 
                              class="w-full h-full p-1" 
                              type="text" 
                              :value="detail.qty || 0" 
                              @input="detail.qty = $event"
                              :show="show" :disabled="disabled"/>
                            </div>
                          </td>
                          <td class="cell" :class="disabled ? 'unselectable' : ''">
                            <div class="w-full h-full flex items-center justify-center">                       
                              <select class="h-full" v-model="detail.xfor" :disabled="disabled">
                                <option value="Supir">Supir</option>
                                <option value="Kernet">Kernet</option>
                              </select>
                            </div>
                          </td>
                          <td class="cell">
                            <div class="w-full h-full flex items-center justify-center unselectable">                       
                              {{ pointFormat(detail.qty * detail.amount || 0) }}   
                            </div>
                          </td>
                        </tr>
                      </template>
                      
                      <tr v-if="!disabled">
                        <td class="tools cell">
                          <button type="button" name="button" @click="addList2()">
                            <IconsPlus />
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
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

  <ToolsPopup :show="tools_popup" :coor="coor" :fn="closeToolsPopup" :data="details" :data_index="row" @replyAct="replyAction($event)" />
  <ToolsPopup :show="tools_popup2" :coor="coor2" :fn="closeToolsPopup2" :data="details2" :data_index="row2" @replyAct="replyAction2($event)" />
  <SearchSelectAcAccs :show="show_item" :fnClose="closeSNSItem" :fnSelect="selectSNSItem"/>

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
  is_copy: {
    type: [Boolean,Number],
    required: true,
    default: false,
  },
  
})

const ujalan_temp = {
    id: -1,
    xto: "",
    tipe: "",
    // status: "Y",
    jenis: "",
    harga:0,
    note_for_remarks:"",
    transition_from:"",
    details: [],
    details2: [],
};

const ujalan = ref({...ujalan_temp});

// const { checkScopes,checkRole } = useAuthStore();

// const { countClickListFn } = useUtils();

const token = useCookie('token');

// const field_errors = ref<Record<string, any>>({})
  const field_errors = ref({})
// const router = useRouter();
// const route = useRoute();




// const exclude_lists = ref(dt_async.value?.exclude_lists || []);
const details_temp = ref([
  {xdesc:"Timbangan", qty:1, harga:55000},
  {xdesc:"Retribusi TPR", qty:1, harga:23000},
  {xdesc:"Parkir & Nginap", qty:1, harga:10000},
  {xdesc:"Penitipan Alat (Dongkrak)", qty:1, harga:5000},
  {xdesc:"Ikas Danau", qty:1, harga:10000},
  {xdesc:"U.Bongkar + Ambil surat", qty:1, harga:35000},
  {xdesc:"Perbaikan Jalan Pujut", qty:1, harga:10000},
  {xdesc:"Gaji Supir", qty:1, harga:0},
  {xdesc:"Gaji Kernet", qty:1, harga:0},
  {xdesc:"U.Extrafooding", qty:1, harga:20000},
]);

const details_temp2 = ref([
  // {xdesc:"Timbangan", qty:1, harga:55000},
  // {xdesc:"Retribusi TPR", qty:1, harga:23000},
  // {xdesc:"Parkir & Nginap", qty:1, harga:10000},
  // {xdesc:"Penitipan Alat (Dongkrak)", qty:1, harga:5000},
  // {xdesc:"Ikas Danau", qty:1, harga:10000},
  // {xdesc:"U.Bongkar + Ambil surat", qty:1, harga:35000},
  // {xdesc:"Perbaikan Jalan Pujut", qty:1, harga:10000},
  // {xdesc:"Gaji Supir", qty:1, harga:0},
  // {xdesc:"Gaji Kernet", qty:1, harga:0},
  // {xdesc:"U.Extrafooding", qty:1, harga:20000},
]);

const details = ref([]);
const details2 = ref([]);


// const details = ref<Record<any, any>>([]);
// const details = ref([]);
const detail = ref({
  ordinal:0,
  id:-1,
  xdesc:"",
  qty:1,
  harga:0,
  for_remarks:0,
  // status:"",
  p_status:""
});
const detail2 = ref({
  ordinal:0,
  id:-1,
  ac_account_id:"",
  ac_account_name:"",
  ac_account_code:"",
  description:"",
  qty:1,
  amount:0,
  xfor:"",
  // status:"",
  p_status:""
});

const insertDefault = ()=>{
  
  details_temp.value.forEach(e => {
    if(details.value.filter((x)=>x.xdesc == e.xdesc).length == 0){
      details.value.push({...e,ordinal:0,id:-1,p_status: "Add",})
    }       
  });
  
}

const insertDefault2 = ()=>{
  
  details_temp2.value.forEach(e => {
    if(details2.value.filter((x)=>x.ac_account_id == e.ac_account_id).length == 0){
      details2.value.push({...e,ordinal:0,id:-1,p_status: "Add",})
    }       
  });
  
}

//Start Select Account Item
const show_item = ref(false);

const closeSNSItem = () => {
  show_item.value = false;
};

const selectSNSItem = (item) => {
  details2.value[row2.value].ac_account_id = item.ac_account_id;
  details2.value[row2.value].ac_account_code = item.ac_account_code;
  details2.value[row2.value].ac_account_name = item.ac_account_name;
  // exclude_lists.value.push(item.ac_account_id);
  show_item.value = false;
}

const showSNSItem=(e, index)=>{
  // console.log(details.value);
  row2.value = index;
  // console.log(row.value,"row");
  
  show_item.value = true;
};



const deleteSNSItem=(e, index)=>{
  // let item_id = details2.value[index].ac_account_id;
  // let el_index = exclude_lists.value.indexOf(item_id);
  // if (el_index > -1)
  //   exclude_lists.value.splice(el_index, 1);

  details2.value[index].ac_account_id = "";
  details2.value[index].ac_account_code = "";
  details2.value[index].ac_account_name = "";
  // details2.value[index].item = {
  //   id: "",
  //   name: "",
  //   unit: {
  //     id:"",
  //     name:""
  //   }
  // };
};
//End Select Account Item

// let show_warehouse = ref(false);
// let selected_warehouse = "";
// const clearWarehouse = (val) => {
//   if(val=="from"){
//     ujalan.value.warehouse = { ...empty_warehouse };
//   }else if(val =='to'){
//     ujalan.value.warehouse_target = { ...empty_warehouse };
//   }
// };

// const searchWarehouse = (val) => {
//   selected_warehouse = val;
//   show_warehouse.value = true;
// };

// const closeSNSWarehouse = () => {
//   show_warehouse.value = false;
// };

// const selectSNSWarehouse = (warehouse: any) => {
//   if(selected_warehouse=='from'){
//     ujalan.value.warehouse = {...warehouse};
//   }else if(selected_warehouse=='to'){
//     ujalan.value.warehouse_target = {...warehouse};
//   }
//   show_warehouse.value = false;
// }

const { display } = useAlertStore();


const doSave = async () => {
  if(details2.value.length > 0 && total_harga.value != total_harga2.value){    
    display({ show: true, status: "Failed", message: "Total tidak cocok" });
    return;
  }

  useCommonStore().loading_full = true;
  field_errors.value = {};

  const data_in = new FormData();
  data_in.append("xto", ujalan.value.xto);
  data_in.append("tipe", ujalan.value.tipe);
  // data_in.append("status", ujalan.value.status);
  data_in.append("jenis", ujalan.value.jenis);
  data_in.append("harga", ujalan.value.harga);
  data_in.append("note_for_remarks", ujalan.value.note_for_remarks);
  data_in.append("transition_from", ujalan.value.transition_from);
  data_in.append("details", JSON.stringify(details.value));
  data_in.append("details2", JSON.stringify(details2.value));

  // let data_in = {
  //   "xto": ujalan.value.xto,
  //   "tipe": ujalan.value.tipe,
  //   "status": ujalan.value.status,
  //   "jenis": ujalan.value.jenis,
  //   "details":JSON.stringify(details.value)
  // };
  
  let $method = "post";

  let id = props.is_copy ? 0 : props.id;
  if (id == 0) {
  } else {
    // $method = "put";
    // data_in['id'] = id;
    data_in.append("id", id);
    data_in.append("_method", "PUT");
  }

  const { data, error, status } = await useMyFetch("/ujalan", {
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
    ujalan.value.id = data.value.id;
    ujalan.value.created_at = data.value.created_at;
    ujalan.value.updated_at = data.value.updated_at;
    props.p_data.unshift(ujalan.value);
  }else{
    ujalan.value.updated_at = data.value.updated_at;

    let idx= props.p_data.map((x)=>x.id).indexOf(id);
    if(idx>=-1){
      props.p_data.splice(idx,1,{...ujalan.value});    
    }
  }
  props.fnClose();
  // router.go(-1);
}

// // const exclude_id = computed({
// //   get(){
// //     return ujalan.value.warehouse?.id || ujalan.value.warehouse_target?.id;
// //   },
// //   set(){
    
// //   }
// // })

// const exclude_id = computed(()=>{
//   return ujalan.value.warehouse?.id || ujalan.value.warehouse_target?.id || 0;
// })

const total_harga = computed(()=>{
  let temp = 0;

  details.value.forEach(e => {
    if(e.p_status!="Remove")
    temp += e.qty * e.harga; 
  });
  ujalan.value.harga = temp;
  return temp;
})

const total_harga2 = computed(()=>{
  let temp = 0;

  details2.value.forEach(e => {
    if(e.p_status!="Remove")
    temp += e.qty * e.amount;
  });
  return temp;
})


const row = ref(-1);
const row2 = ref(-1);
const tools_popup = ref(false);
const coor = ref({
  left:0,
  top:0
});

const tools_popup2 = ref(false);
const coor2 = ref({
  left:0,
  top:0
});



const showAction=(e, index)=>{
  row.value = index;
  tools_popup.value = true;
  coor.value = { left: e.clientX, top: e.clientY };
};

const showAction2=(e, index)=>{
  row2.value = index;
  tools_popup2.value = true;
  coor2.value = { left: e.clientX, top: e.clientY };
};

const addList=()=>{
  details.value.push({
    ...detail.value,
    p_status: "Add",

    // item: { ...this.item },
    // unit: { ...this.unit },
    // creator: { ...this.creator }
  });
};

const addList2=()=>{
  details2.value.push({
    ...detail2.value,
    p_status: "Add",

    // item: { ...this.item },
    // unit: { ...this.unit },
    // creator: { ...this.creator }
  });
};
const closeToolsPopup=()=>{
  tools_popup.value = false;
};
const closeToolsPopup2=()=>{
  tools_popup2.value = false;
};
const replyAction=(act = "")=>{
  if (act == "insert") {
    details.value.splice(row.value, 0, {
      ...detail.value,
      p_status: "Add",

      // item: { ...this.item },
      // unit: { ...this.unit },
      // creator: { ...this.creator }
    });
  } else if (act == "delete") {
    // let item_id = details.value[row.value].key;
    // let el_index = exclude_lists.value.indexOf(item_id);
    // if (el_index > -1)
    //   exclude_lists.value.splice(el_index, 1);

    if (details.value[row.value].p_status == "Edit")
      details.value[row.value].p_status = "Remove";
    else
      details.value.splice(row.value, 1);
    
  } else if(act=="move_top"){
    let old = details.value[row.value];
    details.value.splice(row.value,1);
    details.value.splice(row.value - 1,0,{...old});
  } else if(act=="move_bottom"){
    let old = details.value[row.value];
    details.value.splice(row.value,1);
    details.value.splice(row.value + 1,0,{...old});
  }
  tools_popup.value = false;
};
const replyAction2=(act = "")=>{
  if (act == "insert") {
    details2.value.splice(row2.value, 0, {
      ...detail2.value,
      p_status: "Add",

      // item: { ...this.item },
      // unit: { ...this.unit },
      // creator: { ...this.creator }
    });
  } else if (act == "delete") {
    // let item_id = details.value[row.value].key;
    // let el_index = exclude_lists.value.indexOf(item_id);
    // if (el_index > -1)
    //   exclude_lists.value.splice(el_index, 1);

    if (details2.value[row2.value].p_status == "Edit")
      details2.value[row2.value].p_status = "Remove";
    else
      details2.value.splice(row2.value, 1);
    
  } else if(act=="move_top"){
    let old = details2.value[row2.value];
    details2.value.splice(row2.value,1);
    details2.value.splice(row2.value - 1,0,{...old});
  } else if(act=="move_bottom"){
    let old = details2.value[row2.value];
    details2.value.splice(row2.value,1);
    details2.value.splice(row2.value + 1,0,{...old});
  }
  tools_popup2.value = false;
};

const role = useCookie('role');
const disabled = computed(()=>{
  return (ujalan.value.val && ujalan.value.val1) || (role.value == "Logistic" && ujalan.value.val) || (role.value == "PabrikTransport" && ujalan.value.val1);
});



// const handleDragStart=(event,key)=>{
//   event.dataTransfer.setData('application/json',JSON.stringify(key));
// }

// const handleDrop=(event,key)=>{
//   let dragged_key = JSON.parse(event.dataTransfer.getData('application/json'));
//   let old = details.value[dragged_key];
//   details.value.splice(dragged_key,1);
//   details.value.splice(key,0,{...old});
// }

// const to_move = ref<HTMLElement | null>(null);
// onMounted(()=>{
//   if(!disabled.value) useMoveDOM(to_move,details);
// });

// const users = ref([]);


// const search = ref("");
// const sort = ref({
//   field: "created_at",
//   by: "desc"
// });
// const selected = ref(-1);
// const scrolling = ref({
//   page: 1,
//   is_last_record: false,
//   scrollLeft: 0,
//   may_get_data: true
// });
// const params = {};
// params._TimeZoneOffset = new Date().getTimezoneOffset();

// const inject_params = () => {
//   params.like = "";
//   if (search.value != "") {
//     params.like = `email:%${search.value}%,fullname:%${search.value}%`;
//   }
//   params.sort = "";
//   if (sort.value.field) {
//     params.sort = sort.value.field + ":" + sort.value.by;
//   }
// };

// const loadRef = ref(null);

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

  let p_status = "Edit";
  if(props.is_copy){
    p_status = "Add";
    ujalan.value.val = 0;
    ujalan.value.val1 = 0;
  }

  details.value = data.value.data.details.map((x)=>{
    x["p_status"]= p_status;
    x["key"] = x["ordinal"];
    return x;
  });

  details2.value = data.value.data.details2.map((x)=>{
    x["p_status"]= p_status;
    x["key"] = x["ordinal"];
    return x;
  });
  
}


// const loadMore = async () => {

//   if (!scrolling.value.may_get_data) return;
//   let parent = loadRef.value;

//   if (parent.scrollLeft != scrolling.value.scrollLeft) {
//     scrolling.value.scrollLeft = parent.scrollLeft;
//     return;
//   }

//   if (scrolling.value.is_last_record) return;

//   let stuck = Math.round(parent.scrollTop) + parent.clientHeight >= parent.scrollHeight - 1 ? true : false;
//   if (!stuck) return;

//   scrolling.value.page++;
//   await callData();

// }

// const searching = () => {
//   scrolling.value.page = 1;
//   scrolling.value.is_last_record = false;
//   inject_params();
//   callData();
// }

// const selectRow = () => {
//   if (selected.value > -1) {
//     props.fnSelect(users.value[selected.value]);
//   } else {
//     props.fnSelect({
//       id: "",
//       email: "",
//       fullname: ""
//     });
//   }
// }




watch(() => props.show, (newVal, oldVal) => {
  if (newVal == true){
    ujalan.value = {...ujalan_temp};
    details.value = [];
    details2.value = [];

    if(props.id!=0)
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
