<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Finance Payment Request'" :fn="fnClose" class="w-100 flex align-items-center"
        style="color:white;" />

        <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white">
          <div class="w-full flex flex-col items-center grow overflow-auto">
            <div class="w-full">
              <button type="button" name="button" class="m-1 text-2xl "
                @click="downloadExcel()">
                <IconsTable2Column />
              </button>
            </div>
            <div class="w-full flex p-1 2xl:overflow-hidden justify-between flex-wrap">
              <div class="w-full" role="sticky">
                <table class="tacky w-full !table-auto" style="white-space:normal;">
                  <thead >
                  <tr class="sticky top-0 !z-[2]">
                    <td :colspan="13" class="!bg-slate-800 text-white font-bold">
                      List Transaksi
                    </td>
                  </tr>
                  <tr class="sticky top-7 !z-[2]">
                    <th class="min-w-[50px] !w-[50px] max-w-[50px] ">No</th>
                    <th>Tujuan</th>
                    <th>Produk</th>
                    <th>No Trx</th>
                    <th class="min-w-[75px] !w-[75px] max-w-[75px] ">No Pol</th>
                    <th>Jabatan</th>
                    <th>Nama</th>
                    <th>Jumlah <br> ({{ pointFormat(total_amount || 0) }})  </th>
                    <th>Potongan <br> ({{ pointFormat( 0) }})</th>
                    <th></th>
                    <th>No Rek</th>
                    <th>Nama Di Bank</th>
                    <th>Nominal Transfer <br> ({{ pointFormat(total_amount || 0) }})</th>
                  </tr>
                </thead>
                  <tbody ref="to_move">
                    <template v-for="(detail, index) in details" :key="index">
                      <!-- <tr v-if="detail.p_status!='Remove'"  :data-index="index" draggable="true" @dragstart="handleDragStart($event,index)" @dragover.prevent @drop="handleDrop($event,index)"> -->
                      <tr>
                        <td class="cell min-w-[50px] !w-[50px] max-w-[50px]">
                          <div class="w-full h-full flex items-center justify-center">
                            {{ detail.jabatan !='Kernet' ? detail.no :'' }}
                          </div>
                        </td>
                        <td class="cell min-w-[150px] !w-[150px] max-w-[150px]">
                          <div class="w-full h-full flex items-center justify-center">
                            {{ detail.jabatan !='Kernet' ? detail.tujuan :''  }}   
                          </div>
                        </td>
                        <td class="cell">
                          <div class="w-full h-full flex items-center justify-center">
                            {{ detail.jabatan !='Kernet' ? detail.produk :''  }}    
                          </div>
                        </td>
                        <td class="cell">
                          <div class="w-full h-full flex items-center justify-center">
                            {{ detail.jabatan !='Kernet' ? detail.id :''  }}   
                          </div>
                        </td>
                        <td class="cell">
                          <div class="w-full h-full flex items-center justify-center">
                            {{ detail.jabatan !='Kernet' ? detail.no_pol :''  }}   
                          </div>
                        </td>
                        <td class="cell">
                          <div class="w-full h-full flex items-center justify-center">
                            {{ detail.jabatan }}   
                          </div>
                        </td>
                        <td class="cell">
                          <div class="w-full h-full flex items-center justify-center">
                            {{ detail.nama }}   
                          </div>
                        </td>
                        <td class="cell">
                          <div class="w-full h-full flex items-center justify-end p-2">                       
                            {{ pointFormat(detail.jumlah || 0) }}   
                          </div>
                        </td>
                        <td class="cell">
                          <div class="w-full h-full flex items-center justify-end p-2">                       
                            {{ pointFormat(0) }}   
                          </div>
                        </td>
                        <td>
                          <div class="w-full h-full flex items-center justify-end p-2">                         
                          </div>
                        </td>
                        <td class="cell">
                          <div class="w-full h-full flex items-center justify-center">
                            {{ detail.rek_no }}   
                          </div>
                        </td>
                        <td class="cell">
                          <div class="w-full h-full flex items-center justify-center">
                            {{ detail.rek_name }}   
                          </div>
                        </td>
                        <td class="cell">
                          <div class="w-full h-full flex items-center justify-end p-1">
                            {{ pointFormat(detail.jumlah || 0) }}  
                          </div>
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </table>
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

</template>

<script setup>

const { $moment } = useNuxtApp()
import { useErrorStore } from '~/store/error';
import { useCommonStore } from '~/store/common';

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
  // p_data:{
  //   type:Array,
  //   required:true,
  //   default:[]
  // },
})

const fin_payment_req_temp = {
    id: -1,
    details: [],
};

const fin_payment_req = ref({...fin_payment_req_temp});

const token = useCookie('token');

const details = ref([]);

const total_amount = computed(()=>{
  let temp = 0;

  details.value.forEach(e => {
    temp += e.jumlah; 
  });
  
  return temp;
})

const callData = async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/fin_payment_req", {
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

  fin_payment_req.value = data.value.data;

  let p_status = "Edit";
  if(props.is_copy){
    p_status = "Add";
    fin_payment_req.value.val = 0;
    fin_payment_req.value.val1 = 0;
  }

  details.value = data.value.data.details; 
}
const { downloadFile, viewFile } = useDownload();

const downloadExcel = async()=>{  
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/fin_payment_req/download_view", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json'
    },
    params: {id:props.id},
    retry: 0,
  });
  useCommonStore().loading_full = false;

  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return;
  }
  downloadFile(data.value);
}


watch(() => props.show, (newVal, oldVal) => {
  if (newVal == true){
    fin_payment_req.value = {...fin_payment_req_temp};
    details.value = [];

    if(props.id!=0)
    callData();
  }
}, {
  immediate: true
});

</script>
