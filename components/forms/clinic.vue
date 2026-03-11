<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Form clinic'" :fn="fnClose" class="w-100 flex align-items-center" style="color:white;" />

      <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white">
        <div class="w-full flex flex-col items-center grow overflow-auto">
          <div class="w-full flex flex-row flex-wrap">
            
            <div class="w-full flex flex-col flex-wrap p-1">
              <label for="">Code</label>
              <input type="text" v-model="clinic.code">
              <p class="text-red-500">{{ field_errors.code }}</p>
            </div>

            <div class="w-full flex flex-col flex-wrap p-1">
              <label for="">Name</label>
              <input type="text" v-model="clinic.in_name">
              <p class="text-red-500">{{ field_errors.in_name }}</p>
            </div>

            <div class="w-full flex flex-col flex-wrap p-1">
              <label for="">Address</label>
              <textarea v-model="clinic.in_address"></textarea>
              <p class="text-red-500">{{ field_errors.in_address }}</p>
            </div>

            <div class="w-full sm:w-6/12 flex flex-col flex-wrap p-1">
              <label for="">Contact Person Name</label>
              <input type="text" v-model="clinic.cp_name">
              <p class="text-red-500">{{ field_errors.cp_name }}</p>
            </div>

            <div class="w-full sm:w-6/12 flex flex-col flex-wrap p-1">
              <label for="">Contact Person Phone Number</label>
              <input type="text" v-model="clinic.cp_phone_number">
              <p class="text-red-500">{{ field_errors.cp_phone_number }}</p>
            </div>

            <div class="w-full sm:w-6/12 flex flex-col flex-wrap p-1">
              <label for="">Contact Person Whatsapp Number</label>
              <input type="text" v-model="clinic.cp_whatsapp_number">
              <p class="text-red-500">{{ field_errors.cp_whatsapp_number }}</p>
            </div>

            <!-- <div class="w-full flex flex-col flex-wrap p-1">
              <label for="">Note</label>
              <textarea v-model="clinic.note"></textarea>
              <p class="text-red-500">{{ field_errors.note }}</p>
            </div> -->

            <div class="w-full sm:w-6/12 flex flex-col flex-wrap p-1">
                <label for="">Status</label>
                <select v-model="clinic.is_active">
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
  is_copy: {
    type: [Boolean,Number],
    required: true,
    default: false,
  },
})

const clinic_temp = {
  id: -1,
  code: "",
  in_name: "",
  in_address: "",
  cp_name: "",
  cp_phone_number: "",
  cp_whatsapp_number: "",
  // note: "",
  is_active: 0,
};

const clinic = ref({...clinic_temp});

const token = useCookie('token');
const field_errors = ref({})

const doSave = async () => { 
  useCommonStore().loading_full = true;
  field_errors.value = {};

  const data_in = new FormData();
  
  data_in.append("code", clinic.value.code);
  data_in.append("in_name", clinic.value.in_name);
  data_in.append("in_address", clinic.value.in_address);
  data_in.append("cp_name", clinic.value.cp_name);
  data_in.append("cp_phone_number", clinic.value.cp_phone_number);
  data_in.append("cp_whatsapp_number", clinic.value.cp_whatsapp_number);
  // data_in.append("note", clinic.value.note);
  data_in.append("is_active", clinic.value.is_active);

  let $method = "post";

  let id = props.is_copy ? 0 : props.id;

  if (id == 0) {
  } else {
    data_in.append("id", id);
    data_in.append("_method", "PUT");
  }

  const { data, error, status } = await useMyFetch("/clinic", {
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

  clinic.value.updated_utc_at = data.value.updated_utc_at;
  
  if(id<=0){
    clinic.value.id = data.value.id;
    clinic.value.created_utc_at = data.value.created_utc_at;
    props.p_data.unshift(clinic.value);
  }else{
    let idx= props.p_data.map((x)=>x.id).indexOf(props.id);
    if(idx>=-1){
      props.p_data.splice(idx,1,{...clinic.value});    
    }
  }
  props.fnClose();
}


const callData = async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/clinic", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      // 'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    params: {id:props.id},
    // body: {
    //   sort: "updated_utc_at:desc"
    // },
    retry: 0,
    // server: true
  });
  useCommonStore().loading_full = false;

  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return;
  }

  clinic.value = data.value.data;
}

watch(() => props.show, (newVal, oldVal) => {
  if (newVal == true){
    clinic.value = { ...clinic_temp };
    field_errors.value = {};
    if(props.id!=0)
    callData();
  }
}, {
  immediate: true
});

</script>
