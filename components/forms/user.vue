<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Form User'" :fn="fnClose" class="w-100 flex align-items-center"
        style="color:white;" />

        <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white">
          <div class="w-full flex flex-col items-center grow overflow-auto">
            <div class="w-full flex flex-row flex-wrap">

              <div class="w-full flex flex-col flex-wrap p-1">
                <label for="">Email</label>
                <input type="text" v-model="user.email">
                <p class="text-red-500">{{ field_errors.email }}</p>
              </div>

              <div class="w-full flex flex-col flex-wrap p-1">
                <label for="">Fullname</label>
                <input type="text" v-model="user.fullname">
                <p class="text-red-500">{{ field_errors.fullname }}</p>
              </div>

              <div class="w-full flex flex-col flex-wrap p-1">
                <label for="">Password</label>
                <input type="password" v-model="user.password">
                <p class="text-red-500">{{ field_errors.password }}</p>
              </div>

              <!-- <div class="w-full sm:w-4/12 flex flex-col flex-wrap p-1">
                <label for="">Birth Date</label>
                <ClientOnly>
                  <vue-date-picker  v-model="user.birth_date" 
                  type="datetime" 
                  format="dd-MM-yyyy" 
                  :enable-time-picker = "false" 
                  text-input
                  teleport-center></vue-date-picker>
                </ClientOnly>
                <p class="text-red-500">{{ field_errors.birth_date }}</p>
              </div>

              <div class="w-full sm:w-4/12 flex flex-col flex-wrap p-1">
                <label for="">Birth Place</label>
                <input type="text" v-model="user.birth_place">
                <p class="text-red-500">{{ field_errors.birth_place }}</p>
              </div> -->

              <div class="w-full sm:w-4/12 flex flex-col flex-wrap p-1">
                <label for="">Phone Number</label>
                <input type="text" v-model="user.phone_number">
                <p class="text-red-500">{{ field_errors.phone_number }}</p>
              </div>

              <div class="w-full sm:w-4/12 flex flex-col flex-wrap p-1">
                <label for="">Whatsapp Number</label>
                <input type="text" v-model="user.whatsapp_number">
                <p class="text-red-500">{{ field_errors.whatsapp_number }}</p>
              </div>

            
              <div class="w-full sm:w-4/12 md:w-3/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Status</label>
                <select v-model="user.is_active">
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

const { $DateTime,$parseDate } = useNuxtApp()
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
  is_copy: {
    type: [Boolean,Number],
    required: true,
    default: false,
  },
})

const user_temp = {
  id: -1,
  email: "",
  fullname: "",
  password: "",
  // birth_date: new Date(),
  birth_date: "",
  birth_place: "",
  phone_number:"",
  whatsapp_number: "",
  is_active: 1,
};

const user = ref({...user_temp});

const token = useCookie('token');
const field_errors = ref({})

const doSave = async () => { 
  useCommonStore().loading_full = true;
  field_errors.value = {};

  const data_in = new FormData();
  
  data_in.append("email", user.value.email);
  data_in.append("fullname", user.value.fullname);
  if(user.value.password) data_in.append("password", user.value.password);
  data_in.append("is_active", user.value.is_active);
  data_in.append("birth_date", user.value.birth_date ? $parseDate(user.value.birth_date).toFormat("y-MM-dd") : "");
  data_in.append("birth_place", user.value.birth_place);
  data_in.append("phone_number", user.value.phone_number);
  data_in.append("whatsapp_number", user.value.whatsapp_number);

  let $method = "post";

  let id = props.is_copy ? 0 : props.id;
  if (id == 0) {
  } else {
    // $method = "put";
    // data_in['id'] = id;
    data_in.append("id", id);
    data_in.append("_method", "PUT");
  }

  const { data, error, status } = await useMyFetch("/user", {
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
    user.value.id = data.value.id;
    user.value.birth_date = $parseDate(user.value.birth_date).toFormat("y-MM-dd");
    user.value.created_utc_at = data.value.created_utc_at;
    user.value.updated_utc_at = data.value.updated_utc_at;
    props.p_data.unshift(user.value);
  }else{
    user.value.updated_utc_at = data.value.updated_utc_at;

    let idx= props.p_data.map((x)=>x.id).indexOf(props.id);
    if(idx>=-1){
      props.p_data.splice(idx,1,{...user.value});    
    }
  }
  props.fnClose();
  // router.go(-1);
}


const callData = async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/user", {
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

  user.value = data.value.data;
}

watch(() => props.show, async(newVal, oldVal) => {
  if (newVal == true){
    user.value = {...user_temp};

    field_errors.value = {};
    if(props.id!=0)
    await callData();
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
