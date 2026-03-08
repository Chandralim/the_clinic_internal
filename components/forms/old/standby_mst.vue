<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Form StandBy Mst'" :fn="fnClose" class="w-100 flex align-items-center"
        style="color:white;" />

        <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white">
          <div class="w-full flex flex-col items-center grow overflow-auto">
            <div class="w-full flex flex-row flex-wrap">
              <div class="w-full sm:w-4/12 md:w-3/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Name</label>
                <input v-model="standby_mst.name" :disabled="disabled">
                <p class="text-red-500">{{ field_errors.name }}</p>
              </div>
              <div class="w-full sm:w-4/12 md:w-3/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Tipe</label>
                <input v-model="standby_mst.tipe" :disabled="disabled">
                <p class="text-red-500">{{ field_errors.tipe }}</p>
              </div>
              <div class="w-full sm:w-4/12 md:w-3/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Amount</label>
                <div class="card-border disabled">
                  {{pointFormat(total_amount) }}
                </div>
                <p class="text-red-500">{{ field_errors.amount }}</p>
              </div>
              <div class="w-full sm:w-4/12 md:w-3/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Peralihan?</label>
                <div class="card-border !flex flex-row items-center">
                  <input id="checkbox" :checked="standby_mst.is_transition" v-model="standby_mst.is_transition" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded">
                  <label for="checkbox" class="w-full ml-1"> {{standby_mst.is_transition ? 'Ya' : 'Tidak'}} </label>
                </div>
                <p class="text-red-500">{{ field_errors.is_transition }}</p>
              </div>
            </div>

            <div class="w-full flex p-1 2xl:overflow-hidden justify-between flex-wrap">
              <div class="w-full" role="sticky">
                <table class="tacky w-full !table-auto" style="white-space:normal;">
                  <thead >
                    <tr class="sticky -top-1 !z-[2]">
                      <td :colspan="!disabled  ? 9 : 7" class="!bg-slate-800 text-white font-bold">
                        Detail
                      </td>
                    </tr>
                    <tr class="sticky top-7 !z-[2]">
                      <th v-if="!disabled" class="min-w-[30px] !w-[30px] max-w-[30px] ">
                        <!-- <button type="button" name="button" class="bg-yellow-600" @click="insertDefault()">
                          In
                        </button> -->
                      </th> 
                      <th class="min-w-[50px] !w-[50px] max-w-[50px] ">No</th>
                      <th v-if="!disabled" class="min-w-[30px] !w-[30px] max-w-[30px] "></th>
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
                        <td v-if="!disabled" class="tools cell">
                          <div class="w-full h-full flex items-center justify-center">
                            <button  type="button" name="button"
                              @click="showAction($event, index)">
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
                            <select v-model="detail.xfor" :disabled="disabled">
                              <option value="Supir">Supir</option>
                              <option value="Kernet">Kernet</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    </template>
                    
                    <tr v-if="!disabled">
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

const standby_mst_temp = {
    id: -1,
    name: "",
    tipe: "",
    amount:0,
    is_transition:0,
    details: [],
};

const standby_mst = ref({...standby_mst_temp});

// const { checkScopes,checkRole } = useAuthStore();

// const { countClickListFn } = useUtils();

const token = useCookie('token');

// const field_errors = ref<Record<string, any>>({})
  const field_errors = ref({})
// const router = useRouter();
// const route = useRoute();




// const exclude_lists = ref(dt_async.value?.exclude_lists || []);
const details_temp = ref([
  {xdesc:"Gaji Kernet", qty:1, harga:0},
  {xdesc:"U.Extrafooding", qty:1, harga:20000},
]);


const details = ref([]);

const detail = ref({
  ordinal:0,
  id:-1,
  ac_account_id:"",
  ac_account_name:"",
  ac_account_code:"",
  description:"",
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


//Start Select Account Item
const show_item = ref(false);

const closeSNSItem = () => {
  show_item.value = false;
};

const selectSNSItem = (item) => {
  details.value[row.value].ac_account_id = item.ac_account_id;
  details.value[row.value].ac_account_code = item.ac_account_code;
  details.value[row.value].ac_account_name = item.ac_account_name;
  // exclude_lists.value.push(item.ac_account_id);
  show_item.value = false;
}

const showSNSItem=(e, index)=>{
  // console.log(details.value);
  row.value = index;
  // console.log(row.value,"row");
  
  show_item.value = true;
};



const deleteSNSItem=(e, index)=>{
  // let item_id = details2.value[index].ac_account_id;
  // let el_index = exclude_lists.value.indexOf(item_id);
  // if (el_index > -1)
  //   exclude_lists.value.splice(el_index, 1);

  details.value[index].ac_account_id = "";
  details.value[index].ac_account_code = "";
  details.value[index].ac_account_name = "";
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

const doSave = async () => {
  useCommonStore().loading_full = true;
  field_errors.value = {};

  const data_in = new FormData();
  data_in.append("name", standby_mst.value.name);
  data_in.append("tipe", standby_mst.value.tipe);
  data_in.append("is_transition", standby_mst.value.is_transition);
  data_in.append("amount", standby_mst.value.amount);
  data_in.append("details", JSON.stringify(details.value));
  
  let $method = "post";

  let id = props.is_copy ? 0 : props.id;
  if (id == 0) {
  } else {
    data_in.append("id", id);
    data_in.append("_method", "PUT");
  }

  const { data, error, status } = await useMyFetch("/standby_mst", {
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
    standby_mst.value.id = data.value.id;
    standby_mst.value.created_at = data.value.created_at;
    standby_mst.value.updated_at = data.value.updated_at;
    props.p_data.unshift(standby_mst.value);
  }else{
    standby_mst.value.updated_at = data.value.updated_at;

    let idx= props.p_data.map((x)=>x.id).indexOf(id);
    if(idx>=-1){
      props.p_data.splice(idx,1,{...standby_mst.value});    
    }
  }
  props.fnClose();
  // router.go(-1);
}


const total_amount = computed(()=>{
  let temp = 0;

  details.value.forEach(e => {
    if(e.p_status!="Remove")
    temp += 1 * e.amount; 
  });
  standby_mst.value.amount = temp;
  return temp;
})

const row = ref(-1);
const tools_popup = ref(false);
const coor = ref({
  left:0,
  top:0
});




const showAction=(e, index)=>{
  row.value = index;
  tools_popup.value = true;
  coor.value = { left: e.clientX, top: e.clientY };
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
const closeToolsPopup=()=>{
  tools_popup.value = false;
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

const role = useCookie('role');
const disabled = computed(()=>{
  return (standby_mst.value.val && standby_mst.value.val1) || (role.value == "Logistic" && standby_mst.value.val) || (role.value == "PabrikTransport" && standby_mst.value.val1);
});


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

  let p_status = "Edit";
  if(props.is_copy){
    p_status = "Add";
    standby_mst.value.val = 0;
    standby_mst.value.val1 = 0;
  }

  details.value = data.value.data.details.map((x)=>{
    x["p_status"]= p_status;
    x["key"] = x["ordinal"];
    return x;
  });
  
}

watch(() => props.show, (newVal, oldVal) => {
  if (newVal == true){
    standby_mst.value = {...standby_mst_temp};
    details.value = [];

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
