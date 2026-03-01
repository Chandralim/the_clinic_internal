<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Form clinic'" :fn="fnClose" class="w-100 flex align-items-center" style="color:white;" />

      <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white">
        <div class="w-full flex flex-col items-center grow overflow-auto">
          <div class="w-full flex flex-row flex-wrap">
            
            <div class="w-full flex flex-col flex-wrap p-1">
              <label for="">Code</label>
              <input type="text" v-model="m_clinic.code">
              <p class="text-red-500">{{ field_errors.code }}</p>
            </div>

            <div class="w-full flex flex-col flex-wrap p-1">
              <label for="">Name</label>
              <input type="text" v-model="m_clinic.name">
              <p class="text-red-500">{{ field_errors.name }}</p>
            </div>

            <div class="w-full flex flex-col flex-wrap p-1">
              <label for="">Address</label>
              <textarea v-model="m_clinic.address"></textarea>
              <p class="text-red-500">{{ field_errors.address }}</p>
            </div>

            <div class="w-full flex flex-col flex-wrap p-1">
              <label for="">Contact Number</label>
              <input type="text" v-model="m_clinic.contact_number">
              <p class="text-red-500">{{ field_errors.contact_number }}</p>
            </div>

            <div class="w-full flex flex-col flex-wrap p-1">
              <label for="">Contact Person</label>
              <input type="text" v-model="m_clinic.contact_person">
              <p class="text-red-500">{{ field_errors.contact_person }}</p>
            </div>

            <div class="w-full flex flex-col flex-wrap p-1">
              <label for="">Note</label>
              <textarea v-model="m_clinic.note"></textarea>
              <p class="text-red-500">{{ field_errors.note }}</p>
            </div>

            <div class="w-full sm:w-4/12 md:w-3/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Status</label>
                <select v-model="m_clinic.is_active">
                  <option value="1">Aktif</option>
                  <option value="0">Nonaktif</option>
                </select>
                <p class="text-red-500">{{ field_errors.is_active }}</p>
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

const m_clinic_temp = {
  id: -1,
  code: "",
  name: "",
  contact_number: "",
  contact_person: "",
  note: "",
  is_active: 0,
  address: "",
};

const m_clinic = ref({...m_clinic_temp});

const token = useCookie('token');
const field_errors = ref({})

const doSave = async () => { 
  useCommonStore().loading_full = true;
  field_errors.value = {};

  const data_in = new FormData();
  
  data_in.append("code", m_clinic.value.code);
  data_in.append("name", m_clinic.value.name);
  data_in.append("contact_number", m_clinic.value.contact_number);
  data_in.append("contact_person", m_clinic.value.contact_person);
  data_in.append("address", m_clinic.value.address);
  data_in.append("note", m_clinic.value.note);
  data_in.append("is_active", m_clinic.value.is_active);

  let $method = "post";

  let id = props.id;
  if (id == 0) {
  } else {
    data_in.append("id", id);
    data_in.append("_method", "PUT");
  }

  const { data, error, status } = await useMyFetch("/m_clinic", {
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

  m_clinic.value.utc_updated_at = data.value.utc_updated_at;
  
  if(props.id<=0){
    m_clinic.value.id = data.value.id;
    m_clinic.value.utc_created_at = data.value.utc_created_at;
    props.p_data.unshift(m_clinic.value);
  }else{
    let idx= props.p_data.map((x)=>x.id).indexOf(props.id);
    if(idx>=-1){
      props.p_data.splice(idx,1,{...m_clinic.value});    
    }
  }
  props.fnClose();
}


const callData = async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/m_clinic", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      // 'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    params: {id:props.id},
    // body: {
    //   sort: "utc_updated_at:desc"
    // },
    retry: 0,
    // server: true
  });
  useCommonStore().loading_full = false;

  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return;
  }

  m_clinic.value = data.value.data;
}

watch(() => props.show, (newVal, oldVal) => {
  if (newVal == true){
    m_clinic.value = { ...m_clinic_temp };
    field_errors.value = {};
    if(props.id!=0)
    callData();
  }
}, {
  immediate: true
});

</script>
