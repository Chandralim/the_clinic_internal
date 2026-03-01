<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Form clinic'" :fn="fnClose" class="w-100 flex align-items-center" style="color:white;" />

      <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white">
        <div class="w-full flex flex-col items-center grow overflow-auto">
          <div class="w-full flex flex-row flex-wrap">

            <div class="w-full flex flex-col flex-wrap p-1">
                        
                <div class="w-full">
                    <label for="">clinic ID</label>
                    <button type="button" v-if="m_clinic_member.m_clinic.id == -1" @click="show_item2=true"> Select clinic </button>
                    <div v-else class="ring-1 ring-gray-500 flex flex-wrap p-1">
                      <button type="button" class="mr-1 flex items-center justify-center" @click="m_clinic_member.m_clinic = useUtils().jpstring(clinic_temp)">
                          <IconsTimes/>
                      </button>
                        {{ m_clinic_member.m_clinic?.id }}
                    </div>
                    <p class="text-red-500">{{ field_errors.m_clinic_id }}</p>
                </div>

                <div class="w-full">
                    <label for="">clinic Code</label>
                    <div class="card-border">
                        {{ m_clinic_member.m_clinic?.code }}
                    </div>
                </div>

                <div class="w-full">
                    <label for="">clinic Name</label>
                    <div class="card-border">
                        {{ m_clinic_member.m_clinic.name }}
                    </div>
                </div>

            </div>

            <div class="w-full flex flex-col flex-wrap p-1">
                        
                <div class="w-full">
                    <label for="">User ID</label>
                    <button type="button" v-if="m_clinic_member.m_user.id == -1" @click="show_item=true"> Select User </button>
                    <div v-else class="ring-1 ring-gray-500 flex flex-wrap p-1">
                      <button type="button" class="mr-1 flex items-center justify-center" @click="m_clinic_member.m_user = useUtils().jpstring(user_temp)">
                          <IconsTimes/>
                      </button>
                        {{ m_clinic_member.m_user?.id }}
                    </div>
                    <p class="text-red-500">{{ field_errors.m_user_id }}</p>
                </div>

                <div class="w-full">
                    <label for="">User Fullname</label>
                    <div class="card-border">
                        {{ m_clinic_member.m_user?.full_name }}
                    </div>
                </div>

                <div class="w-full">
                    <label for="">User Name</label>
                    <div class="card-border">
                        {{ m_clinic_member.m_user.user_name }}
                    </div>
                </div>

            </div>

            <div class="w-full p-1">
                <label for="">Role</label>
                <select v-model="m_clinic_member.role">
                  <option value="STUDENT">Student</option>
                  <option value="TEACHER">Teacher</option>
                  <option value="ADMIN">Admin</option>
                </select>
                <p class="text-red-500">{{ field_errors.role }}</p>
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
  <SearchSelectMUser :show="show_item" :fnClose="closeSNSItem" :fnSelect="selectSNSItem"/>
  <SearchSelectMclinic :show="show_item2" :fnClose="closeSNSItem2" :fnSelect="selectSNSItem2"/>
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

const clinic_temp = ref({
  id: -1, code: "", name: "", contact_number: "", contact_person: "", address: "", note: "",
});

const user_temp = ref({
  id: -1, full_name: "", user_name: ""
});


const m_clinic_member_temp = {
  id: -1,
  m_user_id:-1,
  m_user: JSON.parse(JSON.stringify(user_temp.value)),
  m_clinic_id:-1,
  m_clinic: JSON.parse(JSON.stringify(clinic_temp.value)),
  role:"" //Admin,Teacher,Student
};




const m_clinic_member = ref(useUtils().jpstring(m_clinic_member_temp));

const token = useCookie('token');
const field_errors = ref({})

const photo = ref(false);
const photo_input = ref(null);

const doSave = async () => { 
  useCommonStore().loading_full = true;
  field_errors.value = {};

  const data_in = new FormData();
  
  data_in.append("role", m_clinic_member.value.role);
  data_in.append("m_user_id", m_clinic_member.value.m_user.id);
  data_in.append("m_clinic_id", m_clinic_member.value.m_clinic.id);

  let $method = "post";

  let id = props.id;
  if (id == 0) {
  } else {
    data_in.append("id", id);
    data_in.append("_method", "PUT");
  }

  const { data, error, status } = await useMyFetch("/m_clinic_member", {
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

  m_clinic_member.value.utc_updated_at = data.value.utc_updated_at;
  
  if(props.id<=0){
    m_clinic_member.value.id = data.value.id;
    m_clinic_member.value.utc_created_at = data.value.utc_created_at;
    props.p_data.unshift(m_clinic_member.value);
  }else{
    let idx= props.p_data.map((x)=>x.id).indexOf(props.id);
    if(idx>=-1){
      props.p_data.splice(idx,1,{...m_clinic_member.value});    
    }
  }
  props.fnClose();
}


const callData = async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/m_clinic_member", {
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
  m_clinic_member.value = data.value.data;
}

watch(() => props.show, (newVal, oldVal) => {
  if (newVal == true){
    m_clinic_member.value = useUtils().jpstring(m_clinic_member_temp);
    field_errors.value = {};
    if(props.id!=0)
    callData();
  }
}, {
  immediate: true
});

//Start Select Account Item
const show_item = ref(false);

const closeSNSItem = () => {
  show_item.value = false;
};

const selectSNSItem = (item) => {
  m_clinic_member.value.m_user = { ...item };
  m_clinic_member.value.m_user_id = item.id;
  show_item.value = false;
}

//Start Select Account Item
const show_item2 = ref(false);

const closeSNSItem2 = () => {
  show_item2.value = false;
};

const selectSNSItem2 = (item) => {
  m_clinic_member.value.m_clinic = { ...item };
  m_clinic_member.value.m_clinic_id = item.id;
  show_item2.value = false;
}

</script>
