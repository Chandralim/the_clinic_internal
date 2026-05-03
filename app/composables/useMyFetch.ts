import { ref } from 'vue'

type StatusType = 'idle' | 'pending' | 'success' | 'error'

export const useMyFetch = async <T = any>(
  url: string,
  opts: any = {}
) => {
  const config = useRuntimeConfig()

  const data = ref<T | null>(null)
  const error = ref<any>(null)
  const status = ref<StatusType>('pending')

  const retry = opts.retry ?? 0

  const execute = async () => {
    let attempt = 0

    status.value = 'pending'
    error.value = null

    while (attempt <= retry) {
      try {
        data.value = await $fetch<T>(url, {
          baseURL: config.public.baseURL,
          ...opts
        })

        status.value = 'success'
        return
      } catch (err) {
        attempt++

        if (attempt > retry) {
          error.value = err
          status.value = 'error'
        }
      }
    }
  }

  await execute()

  return {
    data,
    error,
    status,
    refresh: execute
  }
}