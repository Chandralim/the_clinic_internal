<template>
    <div class="w-full h-full flex flex-col">
      <HeaderCustom :title="'Change Password'" :back="true" />
      <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white">
        <div class="w-full align-items-center justify-content-center grow overflow-auto">
          <div class="w-full flex flex-col flex-wrap p-1">
            <label for="">Old Password</label>
            <input class="" type="password" v-model="user.old_password">
            <p class="text-red-500">{{ field_errors.old_password }}</p>
          </div>
          <div class="w-full flex flex-col flex-wrap p-1">
            <label for="">New Password</label>
            <input class="" type="password" v-model="user.password">
            <p class="text-red-500">{{ field_errors.password }}</p>
          </div>
          <div class="w-full flex flex-col flex-wrap p-1">
            <label for="">Confirm Password</label>
            <input class="" type="password" v-model="user.password_confirmation">
            <p class="text-red-500">{{ field_errors.password_confirmation }}</p>
          </div>
        </div>
        <div class="w-full flex items-center justify-end">
          <button type="button" name="button" class="w-36 m-1" @click="$router.go(-1)">
            Cancel
          </button>
          <button type="submit" name="button" class="w-36 m-1 bg-blue-600 text-white rounded-sm" @click.prevent="doSave()">
            Save
          </button>
        </div>
      </form>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { useAuthStore } from '~/store/auth';
  
  import { storeToRefs } from 'pinia';
  import { useErrorStore } from '~/store/error';
  import { useCommonStore } from '~/store/common';
  import { useAlertStore } from '~/store/alert';
  
  const { checkScopes,checkRole } = useAuthStore();
    definePageMeta({
        layout: "clear",
    });
  const photo = ref(false);

  const token = useCookie('token');
  const field_errors = ref<Record<string, any>>({})
  
  const router = useRouter();
  const route = useRoute();

  useCommonStore().loading_full = false;
   

  const user = ref({
    old_password:"",
    password:"",
    password_confirmation:"",
  })

  const doSave = async () => {
    useCommonStore().loading_full = true;
    field_errors.value = {};
  
    const data_in = new FormData();
    data_in.append("old_password", user.value.old_password);
    data_in.append("password", user.value.password);
    data_in.append("password_confirmation", user.value.password_confirmation);
    data_in.append("_method", "PUT");

    let req_method: any = "post";
  
    const { data, error, status }: any = await useMyFetch("/change_password", {
      method: req_method,
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
    }else{
        // username.value = user.value.username;
        // fullname.value = user.value.fullname;

        useAlertStore().display({
            show: true,
            status: "Success",
            message: data.value.message
        })
    }


    // router.go(-1);
  }
  
  
  </script>