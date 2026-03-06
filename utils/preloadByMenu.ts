import { preloadMap } from './preloadMap'

export const preloadByMenu = (menus: any[]) => {
    let delay = 0
  
    menus.forEach(menu => {
      const loader = preloadMap[menu.activeMenu]
      if (!loader) return
  
      setTimeout(() => {
        loader()
      }, delay)
  
      delay += 80
    })
  }