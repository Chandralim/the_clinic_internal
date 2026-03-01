<template>
    <section v-show="show" class="p-1 grow">
        <div class="bg-white h-full flex flex-col">
            <div>
                <button v-if="['pv_not_done','all'].indexOf(filter_status) > -1 && selected > -1 && dt_selected.deleted == 0 && dt_selected.pvr_id == ''" type="button" name="button" class="m-1 text-2xl "
                    @click="form_edit()">
                    <IconsEdit/>
                </button>
                <button v-if="selected > -1" type="button" name="button" class="m-1 text-2xl "
                    @click="form_view()">
                    <IconsEyes/>
                </button>
                <button v-if="filter_status=='pv_not_done' && selected >-1 && dt_selected.val == 0 " type="button" name="button" class="m-1 text-2xl "
                    @click="validasi()">
                    <IconsSignature />
                </button>
            </div>
            <form action="#" class="w-full flex flex-wrap text-xs">
                <div class="w-6/12 p-1 sm:w-4/12 md:w-4/12 lg:w-2/12 flex flex-col">
                <div class="font-bold"> Tgl Dari </div>
                <ClientOnly>
                    <vue-date-picker  v-model="date.from" 
                    type="datetime" 
                    format="dd-MM-yyyy" 
                    :enable-time-picker = "false" 
                    text-input
                    teleport-center
                    class="flex-grow"></vue-date-picker>
                </ClientOnly>
                <p class="text-red-500">{{ field_errors.date_from }}</p>
                </div>
                <div class="w-6/12 p-1 sm:w-4/12 md:w-4/12 lg:w-2/12 flex flex-col">
                <div class="font-bold"> Tgl Sampai </div>
                <ClientOnly>
                    <vue-date-picker  v-model="date.to" 
                    type="datetime" 
                    format="dd-MM-yyyy" 
                    :enable-time-picker = "false" 
                    text-input
                    teleport-center
                    class="flex-grow"></vue-date-picker>
                </ClientOnly>
                <p class="text-red-500">{{ field_errors.date_to }}</p>
                </div>
                <div class="w-6/12 p-1 sm:w-4/12 md:w-4/12 lg:w-3/12 flex flex-col">
                <div class="font-bold"> Keyword </div>
                <input class="flex-grow" type="text" v-model="search" name="search"
                    placeholder="Keyword">
                </div>
                <div class="w-6/12 p-1 sm:w-4/12 md:w-4/12 lg:w-2/12 flex flex-col">
                <div class="font-bold"> Status </div>
                <select class="" v-model="filter_status" >
                    <option value="ritase_done">Done</option>
                    <option value="deleted">Trash</option>
                    <option value="all">All</option>
                    <option value="req_deleted">Req Delete</option>
                    </select>
                </div>
                <div class="w-6/12 p-1 sm:w-4/12 md:w-4/12 lg:w-1/12 flex flex-col">
                <div class="font-bold"> Sort By </div>
                <select class="flex-grow" v-model="sort.field">
                    <option value=""></option>
                    <option value="id">ID</option>
                    <option value="xto">To</option>
                    <option value="jenis">Jenis</option>
                    <option value="tipe">Tipe</option>
                </select>
                </div>
                <div class="w-4/12 p-1 sm:w-3/12 md:w-3/12 lg:w-1/12 flex flex-col">
                <div class="font-bold"> Sort Order </div>
                <select class="flex-grow" v-model="sort.by">
                    <option value="asc">Asc</option>
                    <option value="desc">Desc</option>
                </select>
                </div>
                <div class="w-2/12 sm:w-1/12 md:w-1/12 lg:w-1/12 p-1 flex items-end">
                <button class="" type="submit" name="button" @click.prevent="searching()">
                    <IconsSearch class="text-xl" />
                </button>
                </div>
            </form>
            <TableView :thead="fields_thead" :selected="selected" @setSelected="selected = $event" :tbody="trx_trps" :fnCallData="callData" :scrolling="scrolling" @setScrollingPage="scrolling.page=$event">
                <template #[`absen`]="{item,index}">
                <IconsImage v-if="item.trx_absens && item.trx_absens.length > 0" class="cursor-pointer" @click="form_absen(index)"/>
                </template>
                <template #[`app1`]="{item}">
                <IconsLine v-if="!item.val"/>
                <IconsCheck v-else/>
                </template>
                <template #[`app2`]="{item}">
                <IconsLine v-if="!item.val1"/>
                <IconsCheck v-else/>
                </template>
                <template #[`app3`]="{item}">
                <IconsLine v-if="!item.val2"/>
                <IconsCheck v-else/>
                </template>
                <template #[`pvr_completed`]="{item}">
                <IconsLine v-if="!item.pvr_had_detail"/><IconsCheck v-else/>
                </template>
                <template #[`deleted_by_username`]="{item}">
                {{ item.deleted_by?.username }}
                </template>
        
                <template #[`req_deleted_by_username`]="{item}">
                {{ item.req_deleted_by?.username }}
                </template>
            </TableView>
        </div>
    </section>

    <FormsTrxTrp :show="forms_trx_trp_show" :fnClose="()=>{forms_trx_trp_show=false}" :id="forms_trx_trp_id" :p_data="trx_trps" :list_pv="list_pv" :list_cost_center="list_cost_center" :online_status="online_status"/>
    <FormsTrxTrpValidasi :show="forms_trx_trp_valid_show" :fnClose="()=>{forms_trx_trp_valid_show=false}" :id="forms_trx_trp_valid_id" :p_data="trx_trps" :is_view="forms_trx_trp_is_view"/>
    <FormsTrxAbsen :show="forms_trx_absen_show" :fnClose="()=>{forms_trx_absen_show=false}" :index="forms_trx_absen_index" :p_data="trx_trps"/>

</template>

<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
})

const { $moment } = useNuxtApp()

import { storeToRefs } from 'pinia';

import { useAuthStore } from '~/store/auth';
import { useErrorStore } from '~/store/error';
import { useCommonStore } from '~/store/common';
import { useAlertStore } from '~/store/alert';


const filter_status = ref("ritase_done")

const checkStatus=(data)=>{
  if(data.deleted==1) return "!bg-red-400";
  if(data.req_deleted == 1) return "!bg-yellow-300"; 
  if(data.ritase_val == 1) return "!bg-blue-300"; 
  return "";
}

const addClassToTbody=(data)=>{
  data.map(e => {    
    e.class_h = checkStatus(e);
  });
  return data;
}

const params = {};
params._TimeZoneOffset = new Date().getTimezoneOffset();
params.sort ="tanggal:desc";

const field_errors = ref({})

const date = ref({ from: "", to: "" });

const token = useCookie('token');
const role = useCookie('role'); // useCookie new hook in nuxt 3
const checkRole=(list)=>{
  return (list).includes(role.value);
};
// const { data: dt_async } = await useAsyncData(async () => {
//   useCommonStore().loading_full = true;
//   let trx_trps = [];
//   // let list_pv = [];

//   const [data1, data2] = await Promise.all([
//     useMyFetch("/trx_trps", {
//       method: 'get',
//       headers: {
//         'Authorization': `Bearer ${token.value}`,
//         'Accept': 'application/json'
//       },
//       params:{filter_status},
//       retry: 0,
//     }),
//     // useMyFetch("/trx_load_for_trp", {
//     //   method: 'get',
//     //   headers: {
//     //     'Authorization': `Bearer ${token.value}`,
//     //     'Accept': 'application/json'
//     //   },
//     //   retry: 0,
//     // }),
//   ]);

  

//   if (data1.status.value !== 'error') {
//     trx_trps = addClassToTbody(data1.data.value.data);
//   }

//   if (data1.status.value === 'error') {
//     useErrorStore().trigger(data1.error);
//     // return { trx_trps, list_pv };
//     return { trx_trps };
//   }

//   // if (data2.status.value !== 'error') {
//   //   list_pv = data2.data.value.list_pv;
//   // }
//   useCommonStore().loading_full = false;

//   // return { trx_trps,  list_pv };
//   return { trx_trps };
// });

// const trx_trps = ref(dt_async.value.trx_trps || []);
const trx_trps = ref([]);
// const list_pv = ref(dt_async.value.list_pv);
const list_cost_center = ref([]);
const list_pv = ref([]);
const online_status=ref(false);

const search = ref("");
const sort = ref({
  field: "tanggal",
  by: "desc"
});
const selected = ref(-1);
const dt_selected = computed(()=>{  
  return trx_trps.value[selected.value];
})

const scrolling = ref({
  page: 1,
  is_last_record: false,
  scrollLeft: 0,
  may_get_data: true
});

const inject_params = () => {
  params.like = "";
  if (search.value != "") {
    params.like = `id:%${search.value}%,xto:%${search.value}%,jenis:%${search.value}%,pv_no:%${search.value}%,ticket_a_no:%${search.value}%,ticket_b_no:%${search.value}%,no_pol:%${search.value}%,supir:%${search.value}%,kernet:%${search.value}%,cost_center_code:%${search.value}%,cost_center_desc:%${search.value}%,pvr_id:%${search.value}%,pvr_no:%${search.value}%,tanggal:%${search.value}%,transition_target:%${search.value}%`;
  }
  params.sort = "";
  if (sort.value.field) {
    params.sort = sort.value.field + ":" + sort.value.by;
  }

  params.date_from = date.value.from ? $moment(date.value.from).format("YYYY-MM-DD") : "";
  params.date_to = date.value.to ? $moment(date.value.to).format("YYYY-MM-DD") : "";

};

const callData = async () => {
  useCommonStore().loading_full = true;
  field_errors.value = {};

  scrolling.value.may_get_data = false;
  params.page = scrolling.value.page;
  if (params.page == 1) trx_trps.value = [];
  if(params.first_row) delete params.first_row;
  if(params.page > 1){
    params.first_row = JSON.stringify(trx_trps.value[0]);
  }
  params.filter_status = filter_status.value;

  const { data, error, status } = await useMyFetch("/trx_trps", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json'
    },
    params: params,
    retry: 0,
  });
  useCommonStore().loading_full = false;
  scrolling.value.may_get_data = true;

  if (status.value === 'error') {
    useErrorStore().trigger(error, field_errors);
    return;
  }

  if (scrolling.value.page == 1) {
    trx_trps.value = addClassToTbody(data.value.data);
  } else if (scrolling.value.page > 1) {
    trx_trps.value = [...trx_trps.value, ...addClassToTbody(data.value.data)];
  }
  if (data.value.data.length == 0) {
    scrolling.value.is_last_record = true;
  }
}

const searching = () => {

    fields_thead.value.map((x)=>{
        let in_list=["deleted_by_username","deleted_at","deleted_reason","req_deleted_by_username","req_deleted_at","req_deleted_reason"].indexOf(x.key) > -1;
        if(["all","deleted","req_deleted"].indexOf(filter_status.value) > -1){
        if( in_list )
            x.tbl_show =  1; 
        }else{
        if( in_list )
            x.tbl_show =  0; 
        }
        return x;
    });

    selected.value = -1;
    scrolling.value.page = 1;
    scrolling.value.is_last_record = false;
    inject_params();
    callData();
}

const forms_trx_trp_show =  ref(false);
const forms_trx_trp_id = ref(0);

const { display } = useAlertStore();

const form_edit = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    forms_trx_trp_id.value = trx_trps.value[selected.value].id;
    forms_trx_trp_show.value = true;
    // router.push({ name: 'data_trx_trp-form', query: { id: trx_trps.value[selected.value].id } });
  }
};

const forms_trx_trp_valid_show =  ref(false);
const forms_trx_trp_valid_id = ref(0);
const forms_trx_trp_is_view = ref(false);
const validasi = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    forms_trx_trp_valid_id.value = trx_trps.value[selected.value].id;
    forms_trx_trp_valid_show.value = true;
    forms_trx_trp_is_view.value = false;
  }
};

const form_view = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    forms_trx_trp_valid_id.value = trx_trps.value[selected.value].id;
    forms_trx_trp_valid_show.value = true;
    forms_trx_trp_is_view.value = true;
  }
};

const forms_trx_absen_show =  ref(false);
const forms_trx_absen_index = ref(0);
const form_absen = (index) => {
  forms_trx_absen_index.value = index;
  forms_trx_absen_show.value = true;
};

const fields_thead=ref([
  {key:"no",label:"No",isai:true},
  {key:"app1",label:"A1"},
  {key:"app2",label:"A2"},
  {key:"app3",label:"A3"},
  {key:"id",label:"ID"},
  {key:"absen",label:"Absen"},
  {key:"tanggal",label:"U.Jalan Per",dateformat:"DD-MM-Y"},
  {key:"no_pol",label:"No Pol",freeze:1},
  {key:"xto",label:"Tujuan"},
  {key:"tipe",label:"Tipe"},
  {key:"jenis",label:"Jenis"},
  {key:"amount",label:"Amount",class:" justify-end"},
  {key:"supir",label:"Supir"},
  {key:"kernet",label:"Kernet"},
  {key:"created_at",label:"Created At",dateformat:"DD-MM-Y HH:mm:ss"},
  {key:"updated_at",label:"Updated At",dateformat:"DD-MM-Y HH:mm:ss"},
  {key:"deleted_by_username",label:"Deleted By",tbl_show:0},
  {key:"deleted_at",label:"Deleted At",dateformat:"DD-MM-Y HH:mm:ss", tbl_show:0},
  {key:"deleted_reason",label:"Deleted Reason", tbl_show:0},
  {key:"req_deleted_by_username",label:"Req Deleted By",tbl_show:0},
  {key:"req_deleted_at",label:"Req Delete At",dateformat:"DD-MM-Y HH:mm:ss", tbl_show:0},
  {key:"req_deleted_reason",label:"Req Delete Reason", tbl_show:0},
]);

watch(() => props.show, (newVal, oldVal) => {
  if (newVal == true){
    callData();
  }
}, {
  immediate: true
});
</script>