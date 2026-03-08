<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Form Permission Group'" :fn="fnClose" class="w-100 flex align-items-center"
        style="color:white;" />

        <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white">
          <div class="w-full flex flex-col items-center grow overflow-auto">
            <div class="w-full flex flex-row flex-wrap">
              <div class="w-full flex flex-col flex-wrap p-1">
                <label for="">Name</label>
                <input v-model="role.name">
                <p class="text-red-500">{{ field_errors.name }}</p>
              </div>
            </div>

            <div class="w-full flex flex-col sm:flex-row grow p-1 justify-between flex-wrap 2xl:overflow-hidden">
              <div class="w-full max-w-full p-0 2xl:pr-1 2xl:w-1/2 2xl:max-h-full 2xl:overflow-auto">
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
              <div class="w-full max-w-full max-h-full px-0 py-2 2xl:pl-1 2xl:py-0 2xl:w-1/2 2xl:overflow-auto">
                <div class="w-full" role="sticky">
                  <table class="tacky w-full !table-auto" style="white-space:normal;">
                    <thead >
                      <tr class="sticky -top-1 !z-[2]">
                        <td colspan="2" class="!bg-slate-800 text-white font-bold">
                          Detail Permission User
                        </td>
                      </tr>
                      <tr class="sticky top-7 !z-[2]">
                        <th class="min-w-[10px] !w-[10px] max-w-[10px]">
                          <button type="button" name="button" class="text-xs" :class="(users_checked.length != users.length) ?'bg-green-500' :'bg-red-500'" @click="unChUser()">
                            {{ (users_checked.length != users.length) ? 'Allow' : 'Deny' }}
                          </button>
                        </th> 
                        <th>Name</th>
                      </tr>
                    </thead>
                    <tbody ref="to_move">
                      <template v-for="(user, index) in users" :key="index">
                        <tr>
                          <td class="!w-[10px]">
                            <div class="w-full h-full flex items-center justify-center">
                              <input type="checkbox" v-model="user.checked" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600 cursor-pointer">
                            </div>
                          </td>
                          <td>
                            <div class="w-full h-full flex items-center justify-start">
                              {{ user.username }}
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

const role_temp = {
    name: "",
    list: [],
};

const role = ref({...role_temp});
const token = useCookie('token');
const field_errors = ref({})

const doSave = async () => {
  useCommonStore().loading_full = true;
  field_errors.value = {};

  const data_in = new FormData();
  data_in.append("name", role.value.name);
  data_in.append("permission_list", JSON.stringify(permission_list_checked.value));
  data_in.append("users", JSON.stringify(users_checked.value));


  let $method = "post";

  let id = props.is_copy ? 0 : props.id;
  if (id == 0) {
  } else {
    data_in.append("id", id);
    data_in.append("_method", "PUT");
  }

  const { data, error, status } = await useMyFetch("/role", {
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

  if(id<=0){
    role.value.id = data.value.id;
    role.value.created_at = data.value.created_at;
    role.value.updated_at = data.value.updated_at;
    props.p_data.unshift(role.value);
  }else{
    role.value.updated_at = data.value.updated_at;

    let idx= props.p_data.map((x)=>x.id).indexOf(id);
    if(idx>=-1){
      props.p_data.splice(idx,1,{...role.value});    
    }
  }
  props.fnClose();
}

const callData = async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/role", {
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

  role.value = data.value.data;

  let p_status = "Edit";
  if(props.is_copy){
    p_status = "Add";
    role.value.val = 0;
    role.value.val1 = 0;
  }

  data.value.data.details.forEach((v,k)=>{
    permission_list.value = permission_list.value.map(x=>{
      if(x.name == v.i_perm_list_name)
      x.checked = true;
      return x
    })
  })


  data.value.data.users.forEach((v,k)=>{
    users.value = users.value.map(x=>{
      if(x.username == v.username)
      x.checked = true;
      return x
    })
  })

  // details.value = data.value.data.details.map((x)=>{
  //   x["p_status"]= p_status;
  //   x["key"] = x["ordinal"];
  //   return x;
  // });
  
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

  permission_list.value = data.value.data.map((x)=>{
    x["checked"] = false;
    return x;
  });
}

const users=ref([]);
const callUserData = async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/users", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      // 'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    params: {sort: "username:asc"},
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

  users.value = data.value.data.map((x)=>{
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


const users_checked = computed((x)=>{
  return users.value.filter((x)=>x.checked);
})
const unChUser=(item)=>{
  if(users_checked.value.length != users.value.length){
    users.value = users.value.map(x=>{
      x.checked = true;
      return x;
    });
  }else{
    users.value = users.value.map(x=>{
      x.checked = false;
      return x;
    });
  }
};

watch(() => props.show, async(newVal, oldVal) => {
  if (newVal == true){
    role.value = {...role_temp};
    permission_list.value = [];

    await callPermissionListData();
    await callUserData();

    if(props.id!=0)
    await callData();
  }
}, {
  immediate: true
});

</script>
