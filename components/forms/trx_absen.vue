<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Form Check Absen'" :fn="fnClose" class="w-100 flex align-items-center"
        style="color:white;" />

        <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white">
          <div class="w-full flex flex-col items-center grow overflow-auto">
            <div class="w-full flex flex-row flex-wrap">

              <div class="w-full grid grid-cols-1 lg:grid-cols-2 p-1 gap-1 relative">
                <div v-for="absen in trx_trp.trx_absens" class="relative w-full" >
                  <div class="w-7 h-7 ring-1 ring-black absolute right-3 top-3 border-2 border-white flex items-center justify-center text-white" :class="absen.checked ? 'bg-red-600' : 'bg-transparent'"
                  @click="absen.checked = !absen.checked">
                    <IconsCheck v-if="absen.checked" class="text-xl"/>
                  </div>
                  <img :src="useUtils().imgloc(absen.gambar)" class="max-w-full max-h-full w-full"/>
                </div>
              </div>
            </div>
          </div>
          
          <div class="w-full flex items-center justify-end">
            <div class="w-full flex flex-wrap p-3 items-center text-xs">
              <div>
                <label for="">U.jalan Per</label>
                <div class="border-solid border-2 w-fit p-1 bg-slate-700 text-white">
                  {{ trx_trp.tanggal }}
                </div>               
              </div>
              <div>
                <label for="">Jenis</label>
                <div class="border-solid border-2 w-fit p-1 bg-slate-700 text-white">
                  {{ trx_trp.jenis }}
                </div>               
              </div>

              <div>
                <label for="">Supir</label>
                <div class="border-solid border-2 w-fit p-1 bg-slate-700 text-white">
                  {{ trx_trp.supir }}
                </div>               
              </div>

              <div v-if="trx_trp.kernet">
                <label for="">Kernet</label>
                <div class="border-solid border-2 w-fit p-1 bg-slate-700 text-white">
                  {{ trx_trp.kernet }}
                </div>               
              </div>
              <div>
                <label for="">No Pol</label>
                <div class="border-solid border-2 w-fit p-1 bg-slate-700 text-white">
                  {{ trx_trp.no_pol }}
                </div>               
              </div>

              <div>
                <label for="">Tujuan</label>
                <div class="border-solid border-2 w-fit p-1 bg-slate-700 text-white">
                  {{ trx_trp.xto }}
                </div>               
              </div>

              <div>
                <label for="">Tipe</label>
                <div class="border-solid border-2 w-fit p-1 bg-slate-700 text-white">
                  {{ trx_trp.tipe }}
                </div>               
              </div>

              <div>
                <label for="">Total Dari U.Jalan</label>
                <div class="border-solid border-2 w-fit p-1 bg-slate-700 text-white">
                  {{pointFormat(trx_trp.amount || 0) }}
                </div>               
              </div>

            </div>

            <button type="button" name="button" class="w-36 m-1 bg-red-600 text-white rounded-sm" @click.prevent="remove()">
              Delete
            </button>
            <button type="button" name="button" class="w-36 m-1" @click="fnClose()">
              Cancel
            </button>
          </div>
        </form>
    </div>
  </section>

  <PopupMini :type="'delete'" :show="delete_box" :data="delete_data" :fnClose="toggleDeleteBox" :fnConfirm="confirmed_delete" :info_type="'custome'" >
    <template #info>
      Ada {{trx_trp.trx_absens.filter(x=>x.checked).length}} Gambar yang akan di hapus.
    </template>
  </PopupMini>
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
  p_data:{
    type:Array,
    required:true,
    default:[]
  },
  index:{
    type:Number,
    required:false,
    default:0
  }
})

const trx_trp_temp = {
    id: -1,
    tanggal: new Date(),
    id_uj: -1,
    xto: "",
    tipe: "",
    jenis:"",
    amount: 0,

    trx_absens:[]
    
};
const trx_trp = ref({...trx_trp_temp});

const token = useCookie('token');

const callData = async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/trx_trp", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      // 'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    params: {id:props.p_data[props.index].id},
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

  trx_trp.value = data.value.data;

  trx_trp.value.trx_absens = trx_trp.value.trx_absens.map(x=>{
    x.checked = 0;
    return x;
  })
}

watch(() => props.show, (newVal, oldVal) => {
  if (newVal == true){
    callData();
  }
}, {
  immediate: true
});

const { display } = useAlertStore();

const delete_data = ref({});
const delete_box = ref(false);

const toggleDeleteBox = async()=>{  
  if (delete_box.value) {
    delete_box.value = false;
  }
};

const remove = () => {
  let len = trx_trp.value.trx_absens.filter(x=>x.checked==1).length;
  if (len <= 0) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Gambar Terlebih Dahulu" });
  } else {
    delete_data.value = {"jumlah gambar yang akan di hapus" : len};
    delete_box.value = true;
  }
};

const confirmed_delete = async() => {
  useCommonStore().loading_full = true;

  const data_in = new FormData();
  data_in.append("id", props.p_data[props.index].id);
  data_in.append("ids", JSON.stringify(trx_trp.value.trx_absens.filter(x=>x.checked)));
  data_in.append("_method", "DELETE");

  const { data, error, status } = await useMyFetch("/trx_trp_absen", {
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

  props.p_data[props.index].trx_absens = trx_trp.value.trx_absens.filter((x)=>x.checked==0);
  delete_box.value = false;
  props.fnClose();
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
