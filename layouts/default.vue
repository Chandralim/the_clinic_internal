<template>
  <div class="w-full h-full flex">

    <nav id="side_menu" ref="side_menu"
      class="bg-slate-900 h-full min-w-[150px] max-w-[150px] fixed sm:relative sm:left-0  text-white"
      style="width:320px;">
      <div class="relative h-full">
        <button class="absolute left-full h-8 text-2xl text-white bg-slate-500 sm:hidden bg-opacity-0 ring-0 focus:ring-0 flex justify-center items-center"
          @click="triggerSidebar(!is_sidebar_open)">
          <IconsTimes v-if="is_sidebar_open" />
          <IconsBurger v-else />
        </button>
        <header class="h-full flex flex-col overflow-hidden">
          <div class="p-2 relative">
            <input ref="searchInput" type="text" v-model="search" placeholder="search">
            <div class="absolute z-10 top-3 right-3 bg-white cursor-pointer" @click="clearAndFocus()">
              <IconsTimes class="text-red-900 text-3xl"/>
            </div>
          </div>
          <ul class="grow overflow-auto">
            <template v-for="v in menuListFiltered">
              <li :class="activeMenu == v.activeMenu?'active':''" >
                <nuxt-link :to="v.activeMenu" class="cursor-pointer" @click="goTo(v.activeMenu)">
                  <component
                    v-if="v.icon"
                    :is="resolveComponent(v.icon)" class="mr-1"/>
                  {{v.title}}
                </nuxt-link>
              </li>
            </template>
            
          </ul>
          <div id="panel" class="min-h-7 p-2 text-xs relative">
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
              {{ fullname }}
            </div>
          </div>
        </header>
      </div>
    </nav>

    <div class="grow flex flex-col overflow-hidden">
      <slot />
      <div class="w-full text-xs bg-slate-700 text-white p-1 flex justify-evenly">
        <!-- <div>
          Copyright &copy; {{ new Date().getFullYear() }}
        </div> -->
        <div>
          {{ company_name }}
        </div>
        <!-- <div>
          Email : {{company_email}}
        </div> -->
      </div>
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
import { computed } from 'vue';

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

import { menuList } from '~/config/menu'
import { preloadByMenu } from '~/utils/preloadByMenu'

const menuListComputed = computed(() =>
  menuList.map(m => ({
    ...m,
    showing: m.permission
      ? useUtils().checkPermission(m.permission)
      : true,
  }))
)



const search = ref('');
const searchInput = ref(null)

const clearAndFocus = async () => {
  search.value = ''
  await nextTick()
  searchInput.value?.focus()
}
const menuListFiltered = computed(() => {
  // 1️⃣ permission filter
  let result = menuList.filter(menu =>
    (menu.permission=='dashboard') ? true :(!menu.permission || useUtils().checkPermission(menu.permission))    
  )

  // 2️⃣ search filter
  if (search.value.trim() !== '') {
    const keyword = search.value.toLowerCase()
    result = result.filter(menu =>
      menu.title.toLowerCase().includes(keyword)
    )
  }

  return result
})

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

const company_name  = useCookie('company_name'); // useCookie new hook in nuxt 3
const company_email = useCookie('company_email'); // useCookie new hook in nuxt 3

// const username = useCookie('username');
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
        sm.style.zIndex = '10';
      }else{
        if(!is_sidebar_open.value){
          sm.style.left="-150px";
          sm.style.zIndex = '20';
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
        sm.style.zIndex = '10';
      }else{
        if(!is_sidebar_open.value){
          sm.style.left="-150px";
          sm.style.zIndex = '20';
        }
      }
    }

      // tunggu UI stabil dulu
  setTimeout(() => {
    preloadByMenu(menuListFiltered.value)
  }, 300)
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
<style scoped>
  ul li{
    padding:8px;
    /* color:rgb(182, 182, 182); */
    color:white;
    position: relative;
  }

  ul li.active{
    /* background-color: #2e5289; */
    background-color: #035bad;
    color:white;
  }

  ul li.active::after{
    content: "";
    position: absolute;
    width: 3.5px;
    height: 100%;
    top:0px;
    left:0px;
    background-color: rgba(255, 255, 255, 1);
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }

  ul li a{
    display: flex;
    width:100%;
    align-items: center;
  }
</style>