import { defineStore } from 'pinia'
import { ref } from 'vue'

// 搜索模块
export const useSearchStore = defineStore(
  'clothes3d-search',
  () => {
    const search = ref('')
    const removeSearch = async () => {
      search.value = ''
    }
    const setSearch = (newSearch) => {
      search.value = newSearch
    }

    return {
      search,
      removeSearch,
      setSearch
    }
  },
  {
    persist: false
  }
)
