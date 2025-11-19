import { ref } from 'vue'

export function useLoadingState() {
  const timeoutID = ref<number | null>(null)
  const isLoading = ref<boolean>(false)

  function setLoading() {
    timeoutID.value = window.setTimeout(() => {
      isLoading.value = true
    }, 300)
  }

  function clearLoading() {
    clearTimeout(timeoutID.value!)
    isLoading.value = false
  }

  return { isLoading, setLoading, clearLoading }
}
