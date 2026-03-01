<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Form Employee'" :fn="fnClose" class="w-100 flex align-items-center" style="color:white;" />

      <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white">
        <div class="w-full flex flex-col items-center grow overflow-auto">
          <div class="w-full flex flex-row flex-wrap">
            <div class="w-full flex flex-col flex-wrap p-1">
              <label for="">Nama</label>
              <input type="text" v-model="employee.name">
              <p class="text-red-500">{{ field_errors.name }}</p>
            </div>

            <div class="w-full flex flex-col flex-wrap p-1">
              <label for="">Jabatan</label>
              <select v-model="employee.role">
                <option value="Supir">Supir</option>
                <option value="Kernet">Kernet</option>
              </select>
              <p class="text-red-500">{{ field_errors.role }}</p>
            </div>

            <div class="w-full flex flex-col flex-wrap p-1">
              <label for="">No KTP</label>
              <input type="text" v-model="employee.ktp_no">
              <p class="text-red-500">{{ field_errors.ktp_no }}</p>
            </div>

            <div class="w-full flex flex-col flex-wrap p-1">
              <label for="">No SIM</label>
              <input type="text" v-model="employee.sim_no">
              <p class="text-red-500">{{ field_errors.sim_no }}</p>
            </div>

            <div class="w-full flex flex-col flex-wrap p-1">
              <label for="">Nama Bank</label>
              <input type="text" v-model="employee.bank_name">
              <p class="text-red-500">{{ field_errors.bank_name }}</p>
            </div>

            <div class="w-full flex flex-col flex-wrap p-1">
              <label for="">No Rek</label>
              <input type="text" v-model="employee.rek_no">
              <p class="text-red-500">{{ field_errors.rek_no }}</p>
            </div>

            <div class="w-full flex flex-col flex-wrap p-1">
              <label for="">Nama Rek</label>
              <input type="text" v-model="employee.rek_name">
              <p class="text-red-500">{{ field_errors.rek_name }}</p>
            </div>

            <div class="w-full flex flex-col flex-wrap p-1">
              <label for="">Phone Number</label>
              <input type="text" v-model="employee.phone_number">
              <p class="text-red-500">{{ field_errors.phone_number }}</p>
            </div>

          </div>
        </div>
        
        <div class="w-full flex items-center justify-end">
          <button type="button" name="button" class="w-36 m-1" @click="fnClose()">
            Cancel
          </button>
          <button type="submit" name="button" class="w-36 m-1 bg-blue-600 text-white  rounded-sm" @click.prevent="doSave()">
            Save
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup>
import { useErrorStore } from '~/store/error';
import { useCommonStore } from '~/store/common';

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
})

const employee_temp = {
  id: -1,
  name: "",
  role: "Supir",
  ktp_no: "",
  sim_no: "",
  bank_name: "",
  rek_no: "",
  rek_name: "",
  phone_number: "",
};

const employee = ref({...employee_temp});

const token = useCookie('token');
const field_errors = ref({})

const doSave = async () => { 
  useCommonStore().loading_full = true;
  field_errors.value = {};

  const data_in = new FormData();
  
  data_in.append("name", employee.value.name);
  data_in.append("role", employee.value.role);
  data_in.append("ktp_no", employee.value.ktp_no);
  data_in.append("sim_no", employee.value.sim_no);
  data_in.append("bank_name", employee.value.bank_name);
  data_in.append("rek_no", employee.value.rek_no);
  data_in.append("rek_name", employee.value.rek_name);
  data_in.append("phone_number", employee.value.phone_number);

  let $method = "post";

  let id = props.id;
  if (id == 0) {
  } else {
    data_in.append("id", id);
    data_in.append("_method", "PUT");
  }

  const { data, error, status } = await useMyFetch("/employee", {
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

  employee.value.updated_at = data.value.updated_at;
  
  if(props.id<=0){
    employee.value.id = data.value.id;
    employee.value.created_at = data.value.created_at;
    props.p_data.unshift(employee.value);
  }else{
    let idx= props.p_data.map((x)=>x.id).indexOf(props.id);
    if(idx>=-1){
      props.p_data.splice(idx,1,{...employee.value});    
    }
  }
  props.fnClose();
}


const callData = async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/employee", {
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

  employee.value = data.value.data;
}

watch(() => props.show, (newVal, oldVal) => {
  if (newVal == true){
    employee.value = {...employee_temp};
    field_errors.value = {};
    if(props.id!=0)
    callData();
  }
}, {
  immediate: true
});

</script>
