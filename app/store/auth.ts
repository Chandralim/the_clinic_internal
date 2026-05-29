import { defineStore } from 'pinia';
import { useErrorStore } from '~/store/error';
import { useCommonStore } from '~/store/common';


interface UserPayloadInterface {
  email: string;
  password: string;
}

export const useAuthStore = defineStore('auth', {
  
  state: () => ({
    authenticated: !!useCookie('token').value,
    loading: false,
    done_get_user_info: false,

    // loading_full: false,
  }),
  actions: {
    
    async authenticateUser({ email, password }: UserPayloadInterface) {
      const { apiAM } = useMyApis();
      try{
        this.loading = true;
        const data: any = await apiAM('/login', {
          method: 'post',
          headers: {
            // 'Content-Type': 'application/json'
          },
          body: {
            email,
            password,
          },
          // timeout: 1000,
        });

        if(data?.token){
          const token = useCookie('token'); // useCookie new hook in nuxt 3
          token.value = data?.token; // set token to cookie
          this.authenticated = true; // set authenticated  state value to true
        }
        return data;

      }catch (error: any) {
        
        const errorDetail = {
          statusCode: error.status,
          data:error.data
        };
        // Lempar kembali atau resolve dengan format khusus agar ditangkap komponen
        throw errorDetail;
      } finally {
        this.loading = false;
      }
    },
    // async checkUser() {
    //   const token = useCookie('token'); // useCookie new hook in nuxt 3
    //       console.log("start call",this.done_get_user_info);

    //   const { data, error, status, pending }: any = useMyLazyFetch('/check_user', {
    //     method: 'get',
    //     headers: {
    //       'Authorization': `Bearer ${token.value}`,
    //       // 'Content-Type': 'application/json',
    //       'Accept': 'application/json'
    //     },
    //     // body: {
    //     //   email,
    //     //   password,
    //     // },
    //     timeout: 1000,
    //   });

    //   useCommonStore().loading_full = pending.value;
    //   while (pending.value) {
    //     await new Promise(resolve => setTimeout(resolve, 1000));
    //   }
    //   useCommonStore().loading_full = pending.value;

    //   return await new Promise<any>((resolve, reject) => {
    //     if (status.value == "error") {
    //       const { trigger } = useErrorStore();

    //       trigger(error);
    //       reject(error);
    //     } else {

    //       if (data.value) {
    //         const email = useCookie('email'); // useCookie new hook in nuxt 3
    //         email.value = data?.value?.user?.email; // set token to cookie

    //         const fullname = useCookie('fullname'); // useCookie new hook in nuxt 3
    //         fullname.value = data?.value?.user?.fullname; // set token to cookie

    //         const role = useCookie('role'); // useCookie new hook in nuxt 3
    //         role.value = data?.value?.user?.role; // set token to cookie

    //         localStorage.setItem("permissions", JSON.stringify(data?.value?.user?.permissions));

    //         const scopes = useCookie('scopes'); // useCookie new hook in nuxt 3
    //         scopes.value = data?.value?.user?.scopes; // set token to cookie

    //         this.done_get_user_info = true;
    //       console.log("done_get_user_info call",this.done_get_user_info);

    //       }
    //       console.log("just done call",this.done_get_user_info);

    //       resolve(data);
    //     }

    //   })
    // },
    async checkUser() {
      const token = useCookie('token'); // useCookie new hook in nuxt 3
      const { apiAM } = useMyApis();

      useCommonStore().loading_full = true;
      try{
          // console.log("start call",this.done_get_user_info);

        const {data}: any = apiAM('/check_user', {
          method: 'get',
          headers: {
            'Authorization': `Bearer ${token.value}`,
            // 'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          // body: {
          //   email,
          //   password,
          // },
          // timeout: 1000,
        });
        if (data.value) {
          const email = useCookie('email'); // useCookie new hook in nuxt 3
          email.value = data?.value?.user?.email; // set token to cookie

          const fullname = useCookie('fullname'); // useCookie new hook in nuxt 3
          fullname.value = data?.value?.user?.fullname; // set token to cookie

          const role = useCookie('role'); // useCookie new hook in nuxt 3
          role.value = data?.value?.user?.role; // set token to cookie

          const scopes = useCookie('scopes'); // useCookie new hook in nuxt 3
          scopes.value = data?.value?.user?.scopes; // set token to cookie
          
          this.done_get_user_info = true;
          if (import.meta.client){
            localStorage.setItem("permissions", JSON.stringify(data?.value?.user?.permissions));
          }
          // console.log("done_get_user_info call",this.done_get_user_info);

        }
          // console.log("just done call",this.done_get_user_info);

        return data;
      }catch (error: any) {
        console.log(error);
         const errorDetail = {
          statusCode: error.status,
          data:error.data
        };

        const { trigger } = useErrorStore();
        trigger(errorDetail,{},true);
        throw errorDetail; 
      } finally {
        useCommonStore().loading_full = false;
      }
    },
    logUserOut() {
      this.clearAuth();
    },

    checkScopes(scopes: Array<string> = []) {
      const allowed_scopes = useCookie('scopes'); // useCookie new hook in nuxt 3
      const setA: Set<string> = new Set(allowed_scopes.value);
      const setB: Set<string> = new Set(scopes);
      const intersection = new Set([...setA].filter((x: string) => setB.has(x)));
      return Array.from(intersection).length > 0;
    },


    checkRole(roles: Array<string> = []) {
      const role = useCookie('role'); // useCookie new hook in nuxt 3
      return roles.includes(role.value as string);
    },

    checkPermission(permission: string = "") {
      if (import.meta.client){
        let permissions = localStorage.getItem('permissions');
        if (permissions) {
          permissions = JSON.parse(permissions)
          return permissions ? permissions.includes(permission) : false;
        }; // useCookie new hook in nuxt 3
      }
      return false;
    },

    checkPermissions(list: any) {
      if (import.meta.client){
        let permissions = localStorage.getItem('permissions');
        if (permissions) {
          permissions = JSON.parse(permissions);
          if (permissions && Array.isArray(permissions)) {
            return permissions.filter((x: any) => list.includes(x)).length > 0;
          }
        } // useCookie new hook in nuxt 3
      }
      return 0;
    },

    clearAuth() {
      this.authenticated = false; // set authenticated  state value to false
      this.done_get_user_info = false;

      const token = useCookie('token'); // useCookie new hook in nuxt 3
      token.value = null; // clear the token cookie

      const email = useCookie('email'); // useCookie new hook in nuxt 3
      email.value = null; // set token to cookie

      const fullname = useCookie('fullname'); // useCookie new hook in nuxt 3
      fullname.value = null; // set token to cookie

      const role = useCookie('role'); // useCookie new hook in nuxt 3
      role.value = null;

      if (import.meta.client){
        localStorage.clear();
      }

      const scopes = useCookie('scopes'); // useCookie new hook in nuxt 3
      scopes.value = null;

      const locs = useCookie('locs'); // useCookie new hook in nuxt 3
      locs.value = null;

      const router = useRouter();
      router.push('/login');
      return;
    }

  },
});