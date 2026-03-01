<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Form User'" :fn="fnClose" class="w-100 flex align-items-center"
        style="color:white;" />

        <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white">
          <div class="w-full flex flex-col items-center grow overflow-auto">
            <div class="w-full flex flex-row flex-wrap">

              <div class="w-full flex flex-col flex-wrap p-1">
                <label for="">Fullname</label>
                <input type="text" v-model="m_user.full_name">
                <p class="text-red-500">{{ field_errors.full_name }}</p>
              </div>

              <div class="w-full flex flex-col flex-wrap p-1">
                <label for="">Birth Date</label>
                <ClientOnly>
                  <vue-date-picker  v-model="m_user.birth_date" 
                  type="datetime" 
                  format="dd-MM-yyyy" 
                  :enable-time-picker = "false" 
                  text-input
                  teleport-center></vue-date-picker>
                </ClientOnly>
                <p class="text-red-500">{{ field_errors.birth_date }}</p>
              </div>

              <div class="w-full flex flex-col flex-wrap p-1">
                <label for="">Birth Place</label>
                <input type="text" v-model="m_user.birth_place">
                <p class="text-red-500">{{ field_errors.birth_place }}</p>
              </div>

              <div class="w-full flex flex-col flex-wrap p-1 ">
                <label for="">Foto</label>
                <div class="flex justify-center items-center w-36 h-36 border-[1px] border-gray-300 mb-1">
                  <img :src="useUtils().imgloc(m_user.photo_location)" alt="" class=" max-w-full max-h-full">
                </div>
                <button type="button" v-show="photo" class="bg-gray-600 w-36 text-white" @click="resetPhoto()">Remove Avatar</button>
                <input class="w-64" v-show="!photo" @change="changePhoto($event)" ref="photo_input" type="file" name="photo" value="">

                <small>Upload file image : jpg, jpeg</small>
                <p class="help-err">{{ field_errors.photo }}</p>
              </div>

              <div class="w-full flex flex-col flex-wrap p-1">
                <label for="">Email</label>
                <input type="email" v-model="m_user.email">
                <p class="text-red-500">{{ field_errors.email }}</p>
              </div>

              <div class="w-full flex flex-col flex-wrap p-1">
                <label for="">Phone Number</label>
                <input type="text" v-model="m_user.phone_number">
                <p class="text-red-500">{{ field_errors.phone_number }}</p>
              </div>

              <div class="w-full flex flex-col flex-wrap p-1">
                <label for="">Whatsapp Number</label>
                <input type="text" v-model="m_user.whatsapp_number">
                <p class="text-red-500">{{ field_errors.whatsapp_number }}</p>
              </div>

              <div class="w-full flex flex-col flex-wrap p-1">
                <label for="">Username</label>
                <input type="text" v-model="m_user.user_name">
                <p class="text-red-500">{{ field_errors.user_name }}</p>
              </div>

              <div class="w-full flex flex-col flex-wrap p-1">
                <label for="">Password</label>
                <input type="password" v-model="m_user.password">
                <p class="text-red-500">{{ field_errors.password }}</p>
              </div>

              <div class="w-full sm:w-4/12 md:w-3/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Role</label>
                <select v-model="m_user.role">
                  <option value="ADMIN">ADMIN</option>
                  <option value="OWNER">OWNER</option>
                </select>
                <p class="text-red-500">{{ field_errors.role }}</p>
              </div>
              
              <div class="w-full sm:w-4/12 md:w-3/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Status</label>
                <select v-model="m_user.is_active">
                  <option value="1">Aktif</option>
                  <option value="0">Nonaktif</option>
                </select>
                <p class="text-red-500">{{ field_errors.is_active }}</p>
              </div>

              <div class="w-full sm:w-6/12 md:w-6/12 lg:w-6/12 flex flex-col flex-wrap p-1">
                  <label for="">Clinic</label>

                  <WidthMiniList2 :fnOpen="()=>{showClinic=true}" :dclass="clinic_sl"/>
                  <!-- {{ selected_clinic }} -->
                    <p class="text-red-500">{{ field_errors.clinic_id }}</p>
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
    <FullMClinic :ispop="true" :showpop="showClinic" :fnClose="() => {
      showClinic = false; 
    }" @selectedList="clinic_sl.build($event)"/>
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
import { SelectList } from '~/mycl/SelectList'

const clinic_sl = new SelectList()
clinic_sl.base = [
  { key: "id", text: "ID", icon: "IconsBaselineNumbers" },
  { key: "code", text: "Code", icon: "IconsNumber" },
  { key: "name", text: "Name", icon: "IconsPerson" },
];

const showClinic = ref(false);
const selected_clinic = ref();
clinic_sl.buildRef(selected_clinic);
clinic_sl.buildStruct(); 
// const instanceB = new SelectList('Instance B')

// const resultA = instanceA.sayHello()
// const resultB = instanceB.sayHello()

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

const m_user_temp = {
    id: -1,
    user_name: "",
    full_name: "",
    password: "",
    is_active: 1,
    birth_date: new Date(),
    birth_place: "",
    photo:"",
    email:"",
    phone_number:"",
    whatsapp_number:"",
    role: 'ADMIN',
};

const m_user = ref({...m_user_temp});

const token = useCookie('token');
const field_errors = ref({})

// const selected_mini_temp={
//   _:{
//     id:{
//       tcon:"IconsBaselineNumbers",
//       text:"ID",
//       val:"",
//     },
//     code:{
//       tcon:"IconsPerson",
//       text:"Code",
//       val:"",
//     },
//     name:{
//       tcon:"IconsNumber",
//       text:"Name",
//       val:"",
//     },
//   },
//   id:"",
//   name:"",
//   title:"",
// };

const photo = ref(false);
const photo_input = ref(null);
const changePhoto = ($e) => {

  var files = $e.target.files;
  if (files.length > 0) {
    let reader = new FileReader();

    reader.onload = function (e) {
      let result = e.target?.result ;

      if (result.match(/image/)) {
        m_user.value.photo_location = result;
      }
    }
    reader.readAsDataURL(files[0]);
    photo.value = true;
  }
};


const resetPhoto = () => {
  photo.value = false;
  m_user.value.photo_location = '';
  let elPhotoInput = photo_input.value;
  if (elPhotoInput) {
    elPhotoInput.value = "";
  }
};

const doSave = async () => { 
  useCommonStore().loading_full = true;
  field_errors.value = {};

  const data_in = new FormData();

  // if (!m_user.value.user_name) m_user.value.user_name = m_user.value.full_name.replaceAll(" ","") + $moment(new Date()).format("YYYYMMDDHmmss");
  data_in.append("user_name", m_user.value.user_name);
  if(m_user.value.password) data_in.append("password", m_user.value.password);
  data_in.append("is_active", m_user.value.is_active);
  data_in.append("role", m_user.value.role);
  data_in.append("full_name", m_user.value.full_name);
  data_in.append("clinic_id", selected_clinic.value.id);
  data_in.append("birth_date", m_user.value.birth_date ? $parseDate(m_user.value.birth_date).toFormat("y-MM-dd") : "");
  data_in.append("birth_place", m_user.value.birth_place);

  if (photo_input.value?.files)
    data_in.append("photo", photo_input.value.files[0] || '');
  if (photo_input.value)
    data_in.append("photo_preview", m_user.value.photo_location);

  data_in.append("full_name", m_user.value.full_name);
  data_in.append("email", m_user.value.email);
  data_in.append("phone_number", m_user.value.phone_number);
  data_in.append("whatsapp_number", m_user.value.whatsapp_number);
  let $method = "post";

  let id = props.id;
  if (id == 0) {
  } else {
    // $method = "put";
    // data_in['id'] = id;
    data_in.append("id", id);
    data_in.append("_method", "PUT");
  }

  const { data, error, status } = await useMyFetch("/m_user", {
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

  clinic_sl.toData(m_user,"clinic");
  
  if(props.id<=0){
    m_user.value.id = data.value.id;
    m_user.value.birth_date = $parseDate(m_user.value.birth_date).toFormat("y-MM-dd");
    m_user.value.utc_created_at = data.value.utc_created_at;
    m_user.value.utc_updated_at = data.value.utc_updated_at;
    props.p_data.unshift(m_user.value);
  }else{
    m_user.value.utc_updated_at = data.value.utc_updated_at;

    let idx= props.p_data.map((x)=>x.id).indexOf(props.id);
    if(idx>=-1){
      props.p_data.splice(idx,1,{...m_user.value});    
    }
  }
  props.fnClose();
  // router.go(-1);
}


const callData = async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/m_user", {
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

if (data.value.data.photo_location) photo.value = true;

  m_user.value = data.value.data;
  let dt = data.value.data;
  clinic_sl.build(dt.clinic);
}

watch(() => props.show, async(newVal, oldVal) => {
  if (newVal == true) {
    m_user.value = { ...m_user_temp };
    clinic_sl.build()
    photo.value = false;
    photo_input.value.value = '';
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
