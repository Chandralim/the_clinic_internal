import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/store/auth';
import { useCommonStore } from '@core/store/common';

export default defineNuxtRouteMiddleware(async (to) => {
  // console.log("from global middleware", to);
  // 1. Ambil nuxtApp terlebih dahulu
  const nuxtApp = useNuxtApp(); 
  
  // 2. Panggil store dengan memasukkan $pinia bawaan Nuxt secara eksplisit
  const commonStore = useCommonStore(nuxtApp.$pinia);
  const authStore = useAuthStore(nuxtApp.$pinia);
  
  commonStore.reset_tv();
  // 3. Lakukan storeToRefs seperti biasa
  const { authenticated, done_get_user_info } = storeToRefs(authStore);
  const token = useCookie('token');
  
  // Sisa kode Anda ke bawah tetap sama...
  // console.log(token.value, "token when route");

  // console.log("the token",token.value);
  // console.log("to?.name",to?.name);

   
  if (token.value) {
    // check if value exists
    authenticated.value = true; // update the state to authenticated

  }



  // if token exists and url is /login redirect to homepage
  if (token.value && to?.name === 'login') {
    return navigateTo('/');
  }

  // if token doesn't exist redirect to log in
  if (!token.value && to?.name !== 'login') {
    // console.log("call outside",to?.name, !token.value);
    abortNavigation();
    return navigateTo('/login');
  }

  if (to?.name !== 'login') {
    useCommonStore().loading_full = true;
  }

  if (to?.name !== 'login' && done_get_user_info.value == false) {
    const { checkUser } = useAuthStore();
    // checkUser()
    //   .then((res) => {
    //   }).catch((error) => {
    //   })
    //   .finally(() => {
    //     // return;
    //   });    
    try {
      // console.log("call checkuser");
      // KUNCI UTAMA: Gunakan await di sini agar middleware "menunggu"
      await checkUser();
            // console.log("done call checkuser");

    } catch (error) {
      console.error("Gagal mengambil data user:", error);
      // Opsional: Jika gagal ambil user, lempar ke login
      // return navigateTo('/login');
    } finally {

    }
  }


});