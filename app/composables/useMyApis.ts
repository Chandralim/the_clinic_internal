// app/composables/useMyApis.ts
export const useMyApis = () => {
  const config = useRuntimeConfig()

  // 1. Untuk Inisialisasi Data (Panggil langsung di setup)
  const apiLazyBM = (request: string, opts?: any) => {
    return useLazyFetch(request, { 
      baseURL: config.public.baseURL, 
      server: false, 
      ...opts 
    })
  }

  const apiBM = (request: string, opts?: any) => {
    return useFetch(request, { 
      baseURL: config.public.baseURL, 
      server: false, 
      ...opts 
    })
  }

  // 2. Untuk Action/Klik/Submit (Gunakan $fetch.create)
  // Kita buat instance-nya sekali saja
  const apiAM = $fetch.create({
    baseURL: config.public.baseURL,
    onRequest({ options }) {
      // Tambahkan logic token auth kamu di sini nanti
      // options.headers = { ... }
    }
  })

  return {
    apiLazyBM,
    apiBM,
    apiAM // Ini sekarang adalah function $fetch yang sudah terkonfigurasi
  }
}