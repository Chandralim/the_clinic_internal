export const useDynamicPathCookie = <T = string | null>(
  name: string,
  value?: T,
  options?: any,
  // pathSegment?: string, // Parameter opsional untuk path
  // routePath?: string // Parameter tambahan untuk middleware
) => {
  // const cookiePath = computed(() => {
  //   if (pathSegment) return `/${pathSegment.replace(/^\/|\/$/g, '')}`
    
  //   // Gunakan routePath jika tersedia (untuk middleware)
  //   if (routePath) {
  //     const firstPathSegment = routePath.split('/')[1] || '/'
  //     return `/${firstPathSegment}`
  //   }

  //   const url = useRequestURL();
  //   const firstPathSegment = url.pathname.split('/')[1] || '/';
  //   return `/${firstPathSegment}`;
  // })

  // const cookie = useCookie<T>(name, {
  //   ...options,
  //   path: cookiePath.value,
  // })

  // if (value !== undefined) {
  //   cookie.value = value
  // }

  // return cookie

  const getCurrentPort = (): string => {
    if (process.client) {
      return window.location.port || '80' // default ke 80 jika tidak ada port
    }
    
    // Untuk server-side (SSR)
    const url = useRequestURL()
    return url.port || '80'
  }

  // Generate unique cookie name berdasarkan port
  const cookieName = computed(() => {
    const port = getCurrentPort()
    return `app_port_${port}_${name}`
  })

  const cookieOptions = computed(() => ({
    ...options,
    path: '/', // ✅ Root path agar work di semua route
    sameSite: 'lax' as const,
    secure: false, // ✅ Set true jika pakai HTTPS
  }))

  const cookie = useCookie<T>(cookieName.value, cookieOptions.value)

  // const cookie = useCookie<T>(name, {
  //   ...options,
  //   path: cookiePath.value,
  // })

  if (value !== undefined) {
    cookie.value = value
  }

  // return {
  //   cookie,
  //   cookieName: cookieName.value,
  //   currentPort: getCurrentPort()
  // }

  return cookie
}