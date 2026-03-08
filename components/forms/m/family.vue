<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Form Family ('+id+')'" :fn="fnClose" class="w-100 flex align-items-center"
        style="color:white;" />

        <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white">
          <div class="w-full flex flex-col items-center grow overflow-auto">
            <div class="w-full flex">
              <button type="button" name="button" class="m-1 text-2xl "
                @click="form_add()">
                <IconsPlus />
              </button>
              <button type="button" name="button" class="m-1 text-2xl "
                @click="form_edit()">
                <IconsEdit/>
              </button>
              <button type="button" name="button" class="m-1 text-2xl "
                @click="remove()">
                <IconsDelete />
              </button>
            </div>
            <div class="w-full overflow-auto grow">

              <div v-for="(member,index) in m_family.members" class="w-full p-1" @click="selected = index">
                <div class="ring-1 ring-gray-600 w-full flex ring-rounded cursor-pointer" :class="index == selected ? 'bg-green-200' :'bg-white'">
                  <div class="p-1">
                    <label class="bold text-xs"> Status</label>
                    <div > {{ member.dtype=='GUARDIAN' ? "Parent("+member.guardian_type+")" : "Child("+member.child_order+")" }} </div>
                  </div>
                  <div class="p-1">
                    <label class="bold text-xs"> Fullname</label>
                    <div > {{ member.m_user.full_name }} </div>
                  </div>
                  <div class="p-1">
                    <label class="bold text-xs"> Birth Date</label>
                    <div > {{ $parseDate(member.m_user.birth_date).toFormat("dd-MM-y") }} </div>
                  </div>
                  <div class="p-1">
                    <label class="bold text-xs"> Birth Place</label>
                    <div > {{ member.m_user.birth_place }} </div>
                  </div>
                  <div class="p-1">
                    <label class="bold text-xs"> Created_at</label>
                    <div > {{ $DateTime.fromMillis(Number(member.created_utc_at)).toFormat("dd-MM-y HH:mm:ss") }} </div>
                  </div>
                  <div class="p-1">
                    <label class="bold text-xs"> Updated_at</label>
                    <div > {{ $DateTime.fromMillis(Number(member.updated_utc_at)).toFormat("dd-MM-y HH:mm:ss") }} </div>
                  </div>
                </div>
              </div>

            </div>            
          </div>
          
          <div class="w-full flex items-center justify-end">
            <button type="button" name="button" class="w-36 m-1" @click="fnClose()">
              Cancel
            </button>
          </div>
        </form>
    </div>
  </section>

  <!-- <PopupMini :type="'delete'" :show="delete_box" :data="delete_data" :fnClose="toggleDeleteBox" :fnConfirm="confirmed_delete" :enabledOk="enabledOk">
    <template #footer>
      Masukkan Alasan Penghapusan:
      <div class="grow mb-5" >
        <textarea  v-model="deleted_reason"></textarea>
      </div>
    </template>
  </PopupMini> -->

  <PopupMini :type="'delete'" :show="delete_box" :data="delete_data" :fnClose="toggleDeleteBox" :fnConfirm="confirmed_delete">
    
  </PopupMini>

  <FormsMFamilyMember :show="forms_member_show" :fnClose="()=>{forms_member_show = false}" :id="forms_family_member_id" :parent_id="id" :p_data="m_family.members" :p_parent_data="p_data" @setParentID="emit('setParentID',$event)"/>

  <!-- <SearchSelectMUser :show="show_item" :fnClose="closeSNSItem" :fnSelect="selectSNSItem"/> -->


</template>

<script setup>

const { $DateTime,$parseDate } = useNuxtApp()
import { storeToRefs } from 'pinia';

import { useAuthStore } from '~/store/auth';
import { useErrorStore } from '~/store/error';
import { useCommonStore } from '~/store/common';
import { useAlertStore } from '~/store/alert';
const emit = defineEmits(['setParentID']);

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

const m_family_temp = {
  id: -1,
  members:[],
};

const m_family = ref(JSON.parse(JSON.stringify(m_family_temp)));
const selected = ref(-1);

const token = useCookie('token');

const field_errors = ref({})


const callData = async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/m_family", {
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

  m_family.value = data.value.data;
}

watch(() => props.show, (newVal, oldVal) => {
  if (newVal == true){
    m_family.value = JSON.parse(JSON.stringify(m_family_temp));

    if(props.id!=0)
    callData();
  }
}, {
  immediate: true
});


const family_type = ref("");


const forms_member_show =  ref(false);
const forms_family_member_id = ref(0);
const form_add = () => {
  forms_family_member_id.value = 0;
  forms_member_show.value = true;
}

const form_edit = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    forms_family_member_id.value = m_family.value.members[selected.value].id;
    forms_member_show.value = true;
  }
};


const enabledOk = ref(false);
const delete_data = ref({});
const delete_box = ref(false);
const deleted_reason = ref("");
const toggleDeleteBox = async()=>{  
  if (delete_box.value) {
    delete_box.value = false;
  }
};

const remove = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    deleted_reason.value = '';
    delete_data.value = {id : m_family.value.members[selected.value].id};
    delete_box.value = true;
  }
};

watch(()=>deleted_reason.value,(newval)=>{
  if( newval.trim().length > 0 ) enabledOk.value = true;
  else enabledOk.value = false;
}, {
  immediate: false
})

const confirmed_delete = async() => {
  useCommonStore().loading_full = true;

  const data_in = new FormData();
  data_in.append("id", m_family.value.members[selected.value].id);
  data_in.append("deleted_reason", deleted_reason.value);  
  data_in.append("_method", "DELETE");

  const { data, error, status } = await useMyFetch("/m_family/member", {
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
  m_family.value.members.splice(selected.value,1);
  selected.value = -1;
  delete_box.value = false;
}
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
