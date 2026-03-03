export function useLazyImage(
    el: Ref<HTMLElement | null>,
    load: () => Promise<void>,
    unload: () => void,
    options?: IntersectionObserverInit
  ) {
    let observer: IntersectionObserver
    let loaded = false
    onMounted(() => {
      observer = new IntersectionObserver(
        async ([entry]) => {
          if (entry.isIntersecting && !loaded) {
            loaded = true
            await load()
          } 
        //   else {
        //     unload()
        //   }
        },
        {
            threshold: 0,
            rootMargin: '300px',
            ...options,
          }
        // { threshold: 0.1 }
      )
  
      if (el.value) observer.observe(el.value)
    })
  
    onUnmounted(() => {
        observer?.disconnect()
        unload?.()  
        //   if (observer && el.value) observer.unobserve(el.value)
    })
  }
  