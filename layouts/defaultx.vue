<template>
  <div class="w-full h-full flex">

    <nav id="side_menu" ref="side_menu"
      class="bg-slate-800 h-full min-w-[150px] max-w-[150px] fixed sm:relative sm:left-0  text-white z-10"
      style="width:320px;">
      <div class="relative h-full">
        <button class="absolute left-full h-8 text-2xl text-white bg-slate-500 sm:hidden bg-opacity-0 ring-0 focus:ring-0 flex justify-center items-center"
          @click="triggerSidebar(!is_sidebar_open)">
          <IconsTimes v-if="is_sidebar_open" />
          <IconsBurger v-else />
        </button>
        <header class="h-full flex flex-col p-2 overflow-hidden">
          <ul class="grow overflow-auto">
            <li :class="activeMenu == '/'?'active':''" >
              <nuxt-link to="/" class="cursor-pointer" @click="goTo('/')">
                <IconsHome class="mr-1"/>
                Dashboard
              </nuxt-link>
            </li>
            <li v-if="useUtils().checkPermission('m_clinic.views')"  :class="activeMenu == '/m_clinic'?'active':''" >
              <nuxt-link to="/m_clinic"  class="cursor-pointer" @click="goTo('/m_clinic')">
                <IconsMoney class="mr-1"/>
                Clinic
              </nuxt-link>
            </li>
            <li v-if="useUtils().checkPermission('m_user.views')"  :class="activeMenu == '/m_clinic/user'?'active':''" >
              <nuxt-link to="/m_clinic/user"  class="cursor-pointer" @click="goTo('/m_clinic/user')">
                <IconsMoney class="mr-1"/>
                Clinic User
              </nuxt-link>
            </li>
            <li v-if="useUtils().checkPermission('m_family.views')"  :class="activeMenu == '/m_clinic/family'?'active':''" >
              <nuxt-link to="/m_clinic/family"  class="cursor-pointer" @click="goTo('/m_clinic/family')">
                <IconsMoney class="mr-1"/>
                Sekolah Family
              </nuxt-link>
            </li>
            <li v-if="useUtils().checkPermission('m_clinic_member.views')"  :class="activeMenu == '/m_clinic/member'?'active':''" >
              <nuxt-link to="/m_clinic/member"  class="cursor-pointer" @click="goTo('/m_clinic/member')">
                <IconsMoney class="mr-1"/>
                Sekolah Member
              </nuxt-link>
            </li>
            <li v-if="useUtils().checkPermission('trp_trx.views')" :class="activeMenu == '/data_trx_trp'?'active':''" >
              <nuxt-link to="/data_trx_trp"  class="cursor-pointer" @click="goTo('/data_trx_trp')">
                <IconsProduct class="mr-1"/>
                Trx Trp
              </nuxt-link>
            </li>

            <li v-if="useUtils().checkPermission('trp_trx.ticket.views')" :class="activeMenu == '/data_trx_trp/ticket'?'active':''" >
              <nuxt-link to="/data_trx_trp/ticket"  class="cursor-pointer" @click="goTo('/data_trx_trp/ticket')">
                <IconsProduct class="mr-1"/>
                Trx Ticket
              </nuxt-link>
            </li>

            <li v-if="useUtils().checkPermission('trp_trx.ritase.views')" :class="activeMenu == '/data_trx_trp/ritase'?'active':''" >
              <nuxt-link to="/data_trx_trp/ritase"  class="cursor-pointer" @click="goTo('/data_trx_trp/ritase')">
                <IconsProduct class="mr-1"/>
                Trx Ritase
              </nuxt-link>
            </li>

            <li v-if="useUtils().checkPermission('standby_mst.views')"  :class="activeMenu == '/data_standby'?'active':''" >
              <nuxt-link to="/data_standby"  class="cursor-pointer" @click="goTo('/data_standby')">
                <IconsMoney class="mr-1"/>
                StandBy
              </nuxt-link>
            </li>
            <li v-if="useUtils().checkPermission('standby_trx.views')"  :class="activeMenu == '/data_standby/trx'?'active':''" >
              <nuxt-link to="/data_standby/trx"  class="cursor-pointer" @click="goTo('/data_standby/trx')">
                <IconsMoney class="mr-1"/>
                StandBy Trx
              </nuxt-link>
            </li>
            
            <li v-if="useUtils().checkPermission('trp_trx.report.views')" :class="activeMenu == '/report_trx_trp'?'active':''" >
              <nuxt-link to="/report_trx_trp"  class="cursor-pointer" @click="goTo('/report_trx_trp')">
                <IconsFileCopy class="mr-1"/>
                Report Trp
              </nuxt-link>
            </li>
            <li v-if="useUtils().checkPermission('report.ramp.views')" :class="activeMenu == '/report/ramp'?'active':''" >
              <nuxt-link to="/report/ramp"  class="cursor-pointer" @click="goTo('/report/ramp')">
                <IconsFileCopy class="mr-1"/>
                Report Ramp
              </nuxt-link>
            </li>
            <li v-if="useUtils().checkPermission('report.ast_n_driver.views')" :class="activeMenu == '/report/ast_n_driver'?'active':''" >
              <nuxt-link to="/report/ast_n_driver"  class="cursor-pointer" @click="goTo('/report/ast_n_driver')">
                <IconsFileCopy class="mr-1"/>
                Report Ast &amp; Driver
              </nuxt-link>
            </li>
            <li v-if="useUtils().checkPermission('development')" :class="activeMenu == '/fin_payment_req'?'active':''" >
              <nuxt-link to="/fin_payment_req"  class="cursor-pointer" @click="goTo('/fin_payment_req')">
                <IconsFileCopy class="mr-1"/>
                Payment Request
              </nuxt-link>
            </li>
            <li v-if="useUtils().checkPermission('vehicle.views')" :class="activeMenu == '/vehicle'?'active':''" >
              <nuxt-link to="/vehicle"  class="cursor-pointer" @click="goTo('/vehicle')">
                <IconsPerson class="mr-1"/>
                Kendaraan
              </nuxt-link>
            </li>
            <li v-if="useUtils().checkPermission('employee.views')" :class="activeMenu == '/employee'?'active':''" >
              <nuxt-link to="/employee"  class="cursor-pointer" @click="goTo('/employee')">
                <IconsPerson class="mr-1"/>
                Pekerja
              </nuxt-link>
            </li>
            <li v-if="useUtils().checkPermission('_user.views')" :class="activeMenu == '/user'?'active':''" >
              <nuxt-link to="/user"  class="cursor-pointer" @click="goTo('/user')">
                <IconsPerson class="mr-1"/>
                User
              </nuxt-link>
            </li>

            <li v-if="useUtils().checkPermission('_role_permission.views')" :class="activeMenu == '/role_permission'?'active':''" >
              <nuxt-link to="/role_permission"  class="cursor-pointer" @click="goTo('/role_permission')">
                <IconsPerson class="mr-1"/>
                Permission Group
              </nuxt-link>
            </li>
          </ul>
          <div id="panel" class="h-7 text-xs relative">
            <div v-show="is_panel_open"
              class="w-full absolute bottom-full mb-2 bg-slate-700 bg-opacity-80 cursor-pointer">
              <!-- <nuxt-link to="/profile" class="block w-full text-left p-2 hover:bg-slate-900">
                Setting
              </nuxt-link> -->
              <nuxt-link to="/profile/change_password" class="block w-full text-left p-2 hover:bg-slate-900">
                Change Password
              </nuxt-link>
              <nuxt-link v-if="authenticated" class="block w-full text-left p-2 hover:bg-slate-900" @click="logout">
                Logout
              </nuxt-link>
            </div>
            <div class="bg-slate-700 bg-opacity-80 p-2 cursor-pointer" @click="is_panel_open = !is_panel_open">
              {{ username }}
            </div>
          </div>
        </header>
      </div>
    </nav>

    <div class="grow flex flex-col overflow-hidden">
      <slot />
    </div>
  </div>
  <Alert />
  <Loading />
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/store/auth';

import { useErrorStore } from '~/store/error';
import { useCommonStore } from '~/store/common';

const router = useRouter();
const route = useRoute();

const activeMenu = ref('');
watch(() => route.path, (newVal, oldVal) => {
  let splitPath = newVal.split("/");

  splitPath = splitPath.filter((x)=>x!="");
  activeMenu.value = "/"+splitPath.join("/");
  // activeMenu.value = "/"+(splitPath.length > 1 ? splitPath[1] : '');
}, {
  immediate: true
});


const { logUserOut } = useAuthStore();
const { authenticated } = storeToRefs(useAuthStore()); // make authenticated state reactive
const { triggerSidebar } = useCommonStore(); // make authenticated state reactive
const { is_sidebar_open } = storeToRefs(useCommonStore()); // make authenticated state reactive
const token = useCookie('token');

const logout = async() => {
  useCommonStore().loading_full = true;
  const { data, error, status }: any = await useMyFetch("/logout", {
    method: "post",
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json',
    },    
    retry: 0,
  });
  useCommonStore().loading_full = false;
  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return;
  }else{
    logUserOut();
  }

};

const username = useCookie('username');
const fullname = useCookie('fullname');
const is_panel_open = ref(false);

if (process.client) {
  window.addEventListener('click', (e) => {
    const target = e.target;
    if (target instanceof Element) {
      // Now TypeScript knows that target is an Element
      if (document?.getElementById('panel')?.contains(target)) {
      } else {
        is_panel_open.value = false;
      }
    }
  });

  window.addEventListener('resize', (e)=>{
    let sm = document.getElementById('side_menu');
    if(sm){   
      if(window.innerWidth>=640){
        sm.style.left="0px";
      }else{
        if(!is_sidebar_open.value){
          sm.style.left="-150px";
        }
      }
    }
  })

}

onMounted(() => {
  let sm = document.getElementById('side_menu');
    if(sm){   
      if(window.innerWidth>=640){
        sm.style.left="0px";
      }else{
        if(!is_sidebar_open.value){
          sm.style.left="-150px";
        }
      }
    }
});

const goTo=(url:any)=>{
  if(activeMenu.value == url) return;
  activeMenu.value = url;
  if(window.innerWidth<640) is_sidebar_open.value=false;
  router.push(url);
}

const side_menu = ref<HTMLElement | null>(null);

watch(()=>is_sidebar_open.value,(newV,oldV)=>{

  let limit = 150;
  let cpro = 300 / 150;

  let play:null | ReturnType<typeof setInterval>  = null;
  let sm = side_menu.value;


  if(play){
    clearInterval(play);
    play=null;
  }

  if(sm){
      play = setInterval(()=>{
        let left = parseFloat(sm.style.left);
        if(newV){          
          if(left>=0 && play){
            sm.style.left = '0px';         
            clearInterval(play);
            play=null;
          }else{
            sm.style.left = (left + cpro) +'px'; 
          }
        }else{
          if(left<=limit * -1 && play){
            sm.style.left = '-150px';         
            clearInterval(play);
            play=null;
          }else{
            sm.style.left = (left - cpro) +'px'; 
          }
        }
      },1);
    }
})

</script>
<style>
  ul li{
    padding:5px;
  }

  ul li.active{
    background-color: #2e5289;
  }

  ul li a{
    display: flex;
    width:100%;
    align-items: center;
  }
</style>