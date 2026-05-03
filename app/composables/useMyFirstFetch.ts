export const useMyFirstFetch: typeof useFetch = (request, opts?) => {
  const config = useRuntimeConfig()

  return useFetch(request, { baseURL: config.public.baseURL, server: false, cache: 'no-cache', ...opts })
}