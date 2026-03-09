<template>
    <div v-show="!ispop || (ispop && showpop)" class="w-full flex grow flex-col overflow-auto h-0 z-10" :class="ispop ?'fixed':'relative'">
        <HeaderPopup v-if="ispop" :title="'Form Clinic'" :fn="fnClose" class="w-100 flex align-items-center"
        style="color:white;" />
        <div class="w-full flex grow flex-col overflow-auto h-0">
            <div class="w-full flex justify-between flex-wrap">
            <div class="grow flex">
                <div class="m-1">
                <select class="" v-model="filter_status" >
                    <option value="active">Active</option>
                    <option value="nonactive">Nonactive</option>
                    <!-- <option value="deleted">Trash</option> -->
                    <option value="all">All</option>
                </select>
              </div>
              <button v-if="enabled_copy" type="button" name="button" class="m-1 text-2xl "
                @click="form_copy()">
                <IconsCopy />
              </button>
              <button v-if="enabled_add" type="button" name="button" class="m-1 text-2xl "
                @click="form_add()">
                <IconsPlus />
              </button>
              <button v-if="enabled_edit" type="button" name="button" class="m-1 text-2xl "
                @click="form_edit()">
                <IconsEdit/>
              </button>
              <!-- <button v-if="selected > -1" type="button" name="button" class="m-1 text-2xl "
                @click="form_view()">
                <IconsEyes/>
              </button> -->
              <!-- <button  v-if="enabled_remove" type="button" name="button" class="m-1 text-2xl "
                @click="remove()">
                <IconsDelete />
              </button> -->
            </div>
          </div>
          <TableView :thead="fields_thead" :selected="selected" @setSelected="selected = $event" :tbody="clinics" :fnCallData="callData" :scrolling="scrolling" @setScrollingPage="scrolling.page=$event"  @doFilter="searching()" :rowBgColor="rowBgColor" :frmName="frmName">
            <!-- <template #[`group`]="{item}">
              {{ name_of_groups(item) }}
            </template> -->
            <template #[`is_active`]="{item}">
              {{ item.is_active==1 ? "Aktif" : "Tidak Aktif" }}
            </template>
            
          </TableView>
        </div>
      <PopupMini :type="'delete'" :show="delete_box" :data="delete_data" :fnClose="toggleDeleteBox"
        :fnConfirm="confirmed_delete" :enabledOk="enabledOk">
        <template #footer>
          Masukkan Alasan Penghapusan:
          <div class="grow mb-5">
            <textarea v-model="deleted_reason"></textarea>
          </div>
        </template>
      </PopupMini>
      <FormsClinic :show="forms_clinic_show" :fnClose="() => { forms_clinic_show = false }"
        :id="forms_clinic_id" :p_data="clinics" :is_copy="forms_clinic_copy"/>
        <div v-if="ispop && selected>-1 && clinics[selected].is_active" class="w-full flex justify-end p-2">
          <button @click="selectRow()" class=" bg-blue-600 text-white">
            Select
          </button>
        </div>
    </div>
  <!-- <FormsclinicValidasi :show="forms_clinic_valid_show" :fnClose="()=>{forms_clinic_valid_show=false}" :id="forms_clinic_valid_id" :p_data="clinics"/> -->

</template>

<script setup>
const { $DateTime } = useNuxtApp()
import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/store/auth';
import { useErrorStore } from '~/store/error';
import { useCommonStore } from '~/store/common';
import { useAlertStore } from '~/store/alert';

// definePageMeta({
//   // layout: "clear",
//   middleware: [
//     function (to, from) {
//       if (!useAuthStore().checkPermission('clinic.views')) {
//         useCommonStore().loading_full = false;
//         return navigateTo('/');
//       }
//     },
//     // 'auth',
//   ],
// });

const props = defineProps({
  ispop: {
    type: Boolean,
    required: false,
    default:false
  },
  showpop: {
    type: Boolean,
    required: false,
    default:false
    },
  fnClose: {
    type: Function,
    required: false,
  },
})
const frmName = 'fullmclinic';
const emit = defineEmits(['selectedList']);

const selectRow = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else if (clinics.value[selected.value].is_active != 1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Yang Aktif" });
  }
  else {
    emit('selectedList', clinics.value[selected.value]);
    props.fnClose();
  }
}

const rowBgColor=(data)=>{
  if(data.is_active==0) return "!bg-red-400";
  // if(data.pvr_id > 0 && data.req_deleted == 1) return "!bg-yellow-300"; 
  // if(data.pv_id > 0) return "!bg-blue-300"; 
  // if(data.val == 0 || data.val1 == 0) return "!bg-gray-300"; 
  return "";
}

const filter_status = ref("active")
watch(()=>filter_status.value,(newval)=>{
  // fields_thead.value.map((x)=>{
  //   let in_list=["deleted_by_username","deleted_at","deleted_reason"].indexOf(x.key) > -1;
  //   if(["all","deleted"].indexOf(newval) > -1){
  //     if( in_list )
  //       x.tbl_show =  1; 
  //   }else{
  //     if( in_list )
  //       x.tbl_show =  0; 
  //   }
  //   return x;
  // });

  searching();
}, {
  immediate: false
})


const params = {};
params._TimeZoneOffset = new Date().getTimezoneOffset();


const token = useCookie('token');
const { data: clinics } = await useAsyncData(async () => {
    if (props.ispop) return;
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/clinics", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json'
    },
    params: params,
    retry: 0,
  });
  useCommonStore().loading_full = false;

  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return [];
  }

  return data.value.data;
});


const search = ref("");
const sort = ref({
  field: "",
  by: "desc"
});
const selected = ref(-1);
const scrolling = ref({
  page: 1,
  is_last_record: false,
  scrollLeft: 0,
  may_get_data: true
});

const dt_selected = computed(()=>{  
  return clinics.value[selected.value];
})


const inject_params = () => {
  params.like = "";
  // console.log("globalkey",useCommonStore()._tv.global_keyword);
  let words = JSON.parse(JSON.stringify(useCommonStore()._tv.global_keyword[frmName]));
  if (words != "") {
    params.like = `id:%${words}%,name:%${words}%,phone_number:%${words}%,whatsapp_number:%${words}%`;
  }
  params.sort = "";
  if (sort.value.field) {
    params.sort = sort.value.field + ":" + sort.value.by;
  }
  params.filter_model = JSON.stringify(useCommonStore()._tv.filter_model[frmName]);

};

const loadRef = ref(null);

const callData = async () => {
  useCommonStore().loading_full = true;
  scrolling.value.may_get_data = false;
  params.page = scrolling.value.page;
  if (params.page == 1) clinics.value = [];
  params.filter_status = filter_status.value;

  const { data, error, status } = await useMyFetch("/clinics", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      // 'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    params: params,
    // body: {
    //   sort: "updated_at:desc"
    // },
    retry: 0,
    // server: true
  });
  useCommonStore().loading_full = false;
  scrolling.value.may_get_data = true;

  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return;
  }

  if (scrolling.value.page == 1) {
    clinics.value = data.value.data;
    if (loadRef.value) loadRef.value.scrollTop = 0;
  } else if (scrolling.value.page > 1) {
    clinics.value = [...clinics.value, ...data.value.data];
  }
  if (data.value.data.length == 0) {
    scrolling.value.is_last_record = true;
  }
  useCommonStore()._tv.filter_box = false;

}

const loadMore = async () => {

  if (!scrolling.value.may_get_data) return;
  let parent = loadRef.value;

  if (parent.scrollLeft != scrolling.value.scrollLeft) {
    scrolling.value.scrollLeft = parent.scrollLeft;
    return;
  }

  if (scrolling.value.is_last_record) return;

  let stuck = Math.round(parent.scrollTop) + parent.clientHeight >= parent.scrollHeight - 1 ? true : false;
  if (!stuck) return;

  scrolling.value.page++;
  await callData();

}

const searching = () => {
  selected.value = -1;
  scrolling.value.page = 1;
  scrolling.value.is_last_record = false;
  inject_params();
  callData();
}

const router = useRouter();

const forms_clinic_show = ref(false);
const forms_clinic_id = ref(0);
const forms_clinic_copy = ref(0);
const forms_clinic_is_view = ref(false)
const form_add = () => {
  forms_clinic_id.value = 0;
  forms_clinic_is_view.value = false;
  forms_clinic_copy.value = false;
  forms_clinic_show.value = true;
}

const { display } = useAlertStore();
const { show, status, message } = storeToRefs(useAlertStore());

const form_edit = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    forms_clinic_id.value = clinics.value[selected.value].id;
    forms_clinic_is_view.value = false;
    forms_clinic_copy.value = false;
    forms_clinic_show.value = true;
  }
};

const form_copy = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    forms_clinic_id.value = clinics.value[selected.value].id;
    forms_clinic_is_view.value = false;
    forms_clinic_copy.value = true;
    forms_clinic_show.value = true;
    // router.push({ name: 'data_trx_trp-form', query: { id: trx_trps.value[selected.value].id } });
  }
};

const forms_clinic_valid_show = ref(false);
const forms_clinic_valid_id = ref(0);
const validasi = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    forms_clinic_valid_id.value = clinics.value[selected.value].id;
    forms_clinic_valid_show.value = true;
  }
};

const enabledOk = ref(false);
const delete_data = ref({});
const delete_box = ref(false);
const deleted_reason = ref("");
const toggleDeleteBox = async () => {
  if (delete_box.value) {
    delete_box.value = false;
  }
};

const remove = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    deleted_reason.value = '';
    delete_data.value = { id: clinics.value[selected.value].id };
    delete_box.value = true;
  }
};

watch(() => deleted_reason.value, (newval) => {
  if (newval.trim().length > 0) enabledOk.value = true;
  else enabledOk.value = false;
}, {
  immediate: false
})

const confirmed_delete = async () => {
  useCommonStore().loading_full = true;

  const data_in = new FormData();
  data_in.append("id", clinics.value[selected.value].id);
  data_in.append("deleted_reason", deleted_reason.value);
  data_in.append("_method", "DELETE");

  const { data, error, status } = await useMyFetch("/clinic", {
    method: "post",
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json',
    },
    body: data_in,
    retry: 0,
  });
  useCommonStore().loading_full = false;
  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return;
  }
  let old = {...clinics.value[selected.value]};
  old['deleted'] = data.value.deleted;
  old['deleted_user'] = data.value.deleted_user;
  old['deleted_at'] = data.value.deleted_at;
  old['deleted_by'] = data.value.deleted_by;
  old['deleted_reason'] = data.value.deleted_reason;
  if(filter_status.value!='all'){
    clinics.value.splice(selected.value,1);
  }else{
    clinics.value.splice(selected.value,1,{...old});
  }

  selected.value = -1;
  delete_box.value = false;
}



const fields_thead=ref([
  {key:"no",label:"No",isai:true},
  {key:"id",label:"ID",filter_on:1,type:"number"},
  {key:"code",label:"Code",freeze:1, filter_on:1,type:'string',sort:{priority:1,type:"asc"}},
  {key:"name",label:"Name",filter_on:1,type:'string'},
  {key:"phone_number", label: "Phone Number", freeze: 0, filter_on: 1, type: 'string'},
  {key:"whatsapp_number",label:"Whatsapp Number", freeze: 0,filter_on:1,type:'string'},
  {key:"address",label:"Address",filter_on:1,type:'string'},
  // {key:"note",label:"Note",filter_on:1,type:'string'},
  {key:"is_active",label:"Status Aktif",filter_on:1,type:'string'},
  {key:"created_utc_at",label:"Created At",type:'datetime',dateformat:"dd-MM-y HH:mm:ss",filter_on:1},
  {key:"updated_utc_at",label:"Updated At",type:'datetime',dateformat:"dd-MM-y HH:mm:ss",filter_on:1},
  // {key:"deleted_by_username",label:"Deleted By",tbl_show:1},
  // {key:"deleted_at",label:"Deleted At",type:'datetime',dateformat:"DD-MM-Y HH:mm:ss",filter_on:1, tbl_show:1},
  // {key:"deleted_reason",label:"Deleted Reason", tbl_show:1,type:'string',filter_on:1},
]);

const enabled_copy = computed(()=>{  
  let result = selected.value > -1 
  && [undefined,0].indexOf(dt_selected.value.deleted) > -1
  && useUtils().checkPermission('clinic.create');
  return result;
})

const enabled_add = computed(()=>{  
  let result = ['active','nonactive','all'].indexOf(filter_status.value) > -1  
  && useUtils().checkPermission('clinic.create');
  return result;
})

const enabled_edit = computed(()=>{  
  let result = selected.value > -1 
  && [undefined,0].indexOf(dt_selected.value.deleted) > -1
  && useUtils().checkPermissions(['clinic.modify']);
  return result;
})


const enabled_remove = computed(()=>{  
  let result = selected.value > -1
  && useUtils().checkPermission('clinic.remove') 
  && [undefined,0].indexOf(dt_selected.value.deleted) > -1;
  return result;
})


watch(() => props.showpop, async(newVal, oldVal) => {
  if (newVal == true) {
    searching();
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
} */
</style>
