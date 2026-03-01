// const route = useRoute();
// const router = useRouter();
const role = useCookie('role');
export const useUtils = () => {
    const sayHello = () => {
        // console.log(route)
        // console.log(router)
        // console.log(this.$router)

    };

    const pointFormat = (value: any) => {
        if (!value) return 0
        return new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(value);
    }

    let countClickList = 0;
    let keyClickList = -1;
    let timeoutClickList: null | ReturnType<typeof setTimeout> = null;
    const countClickListFn = (key: any, ...fn: any[]) => {
        if (keyClickList != key) {
            keyClickList = key;
            countClickList = 0;
            if (timeoutClickList) clearTimeout(timeoutClickList);
            timeoutClickList = null;
        }
        countClickList++;
        if (timeoutClickList == null) {
            timeoutClickList = setTimeout(() => {

                if (countClickList > fn.length) {
                    countClickList = fn.length;
                }
                if (countClickList !== 0) {
                    if (countClickList > 1) fn[0]();
                    countClickList = countClickList - 1;
                    fn[countClickList]();
                }

                countClickList = 0;
                if (timeoutClickList) clearTimeout(timeoutClickList);
                timeoutClickList = null;
            }, 200);
        }



    };

    const checkRole = (list: any) => {
        return (list).includes(role.value);
    };


    const checkPermission = (name: string) => {

        let permissions = localStorage.getItem('permissions');
        if (permissions) {
            permissions = JSON.parse(permissions)
            return permissions ? permissions.includes(name) : false;
        }; // useCookie new hook in nuxt 3

        return false;
    };

    const checkPermissions = (list: any) => {
        let permissions = localStorage.getItem('permissions');
        if (permissions) {
            permissions = JSON.parse(permissions);
            if (permissions && Array.isArray(permissions)) {
                return permissions.filter((x: any) => list.includes(x)).length > 0;
            }
        } // useCookie new hook in nuxt 3
        return 0;
    };

    const round = (num: any, precision: any) => Number(Math.round(Number(num + "e+" + precision)) + "e-" + precision);


    const jpstring = (arr: any) => JSON.parse(JSON.stringify(arr));

    const imgloc = (x: string) => (x) ? ((x.substring(0, 5) != "data:") ? useRuntimeConfig().public.baseURL + "/../" + x : x) : "";

    return {
        sayHello,
        pointFormat,
        countClickListFn,
        checkRole,
        checkPermission,
        checkPermissions,
        round,
        jpstring,
        imgloc
    }
}