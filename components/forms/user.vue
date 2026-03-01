<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Form User'" :fn="fnClose" class="w-100 flex align-items-center"
        style="color:white;" />

        <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white">
          <div class="w-full flex flex-col items-center grow overflow-auto">
            <div class="w-full flex flex-row flex-wrap">

              <div class="w-full flex flex-col flex-wrap p-1">
                <label for="">Username</label>
                <input type="text" v-model="user.username">
                <p class="text-red-500">{{ field_errors.username }}</p>
              </div>

              <div class="w-full flex flex-col flex-wrap p-1">
                <label for="">Password</label>
                <input type="password" v-model="user.password">
                <p class="text-red-500">{{ field_errors.password }}</p>
              </div>

              <div class="w-full sm:w-4/12 md:w-3/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Jabatan</label>
                <select v-model="user.role">
                  <option value="Marketing">Marketing</option>
                  <option value="Admin">Admin</option>
                  <option value="SuperAdmin">SuperAdmin</option>
                </select>
                <p class="text-red-500">{{ field_errors.role }}</p>
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

            <div class="w-full flex flex-col sm:flex-row grow p-1 justify-between flex-wrap 2xl:overflow-hidden">
              <div class="w-full max-w-full p-0 2xl:pr-1 2xl:max-h-full 2xl:overflow-auto">
                <div class="w-full" role="sticky">
                  <table class="tacky w-full !table-auto" style="white-space:normal;">
                    <thead >
                      <tr class="sticky -top-1 !z-[2]">
                        <td colspan="2" class="!bg-slate-800 text-white font-bold">
                          Detail Permission List
                        </td>
                      </tr>
                      <tr class="sticky top-7 !z-[2]">
                        <th class="min-w-[20px] !w-[20px] max-w-[20px]">
                          <button type="button" name="button" class="text-xs" :class="(permission_list_checked.length != permission_list.length) ?'bg-green-500' :'bg-red-500'" @click="unChPerList()">
                            {{ (permission_list_checked.length != permission_list.length) ? 'Allow' : 'Deny' }}
                          </button>
                        </th> 
                        <th>Name</th>
                      </tr>
                    </thead>
                    <tbody ref="to_move">
                      <template v-for="(pl, index) in permission_list" :key="index">
                        <tr>
                          <td class="!w-[10px]">
                            <div class="w-full h-full flex items-center justify-center">
                              <input type="checkbox" v-model="pl.checked" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600 cursor-pointer">
                            </div>
                          </td>
                          <td>
                            <div class="w-full h-full flex items-center justify-start">
                              {{ pl.name }}
                            </div>
                          </td>
                        </tr>
                      </template>
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
            <button type="submit" name="button" class="w-36 m-1 bg-blue-600 text-white  rounded-sm" @click.prevent="doSave()">
              Save
            </button>
          </div>
        </form>
    </div>
  </section>

</template>

<script setup>

const { $DateTime } = useNuxtApp()
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
})

const user_temp = {
    id: -1,
    username: "",
    password: "",
    role:"Marketing",
    is_active: 1,
};

const user = ref({...user_temp});

const token = useCookie('token');
const field_errors = ref({})

const doSave = async () => { 
  useCommonStore().loading_full = true;
  field_errors.value = {};

  const data_in = new FormData();
  
  data_in.append("username", user.value.username);
  if(user.value.password) data_in.append("password", user.value.password);
  data_in.append("role", user.value.role);
  data_in.append("is_active", user.value.is_active);
  data_in.append("permission_list", JSON.stringify(permission_list_checked.value));

  let $method = "post";

  let id = props.id;
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

  
  if(props.id<=0){
    user.value.id = data.value.id;
    user.value.utc_created_at = data.value.utc_created_at;
    user.value.utc_updated_at = data.value.utc_updated_at;
    props.p_data.unshift(user.value);
  }else{
    user.value.utc_updated_at = data.value.utc_updated_at;

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

  user.value = data.value.data;

  data.value.data.details.forEach((v,k)=>{
    permission_list.value = permission_list.value.map(x=>{
      if(x.name == v.i_perm_list_name)
      x.checked = true;
      return x
    })
  })
}



const permission_list = ref([]);

const callPermissionListData = async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/permission_lists", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      // 'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    params: {sort: "name:asc"},
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

  permission_list.value = data.value.data.map((x)=>{
    x["checked"] = false;
    return x;
  });
}

const permission_list_checked = computed((x)=>{
  return permission_list.value.filter((x)=>x.checked);
})
const unChPerList=(item)=>{
  if(permission_list_checked.value.length != permission_list.value.length){
    permission_list.value = permission_list.value.map(x=>{
      x.checked = true;
      return x;
    });
  }else{
    permission_list.value = permission_list.value.map(x=>{
      x.checked = false;
      return x;
    });
  }
};

watch(() => props.show, async(newVal, oldVal) => {
  if (newVal == true){
    user.value = {...user_temp};
    permission_list.value = [];

    await callPermissionListData();

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
