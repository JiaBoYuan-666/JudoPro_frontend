import { defineStore } from 'pinia'
import { ref } from 'vue'

// 用户模块
export const useUserStore = defineStore(
  'clothes3d-user',
  () => {
    const user = ref(null)
    const removeUser = async () => {
      user.value = null
    }
    const setUser = (newUser) => {
      user.value = newUser
    }

    return {
      user,
      removeUser,
      setUser
    }
  },
  {
    persist: true
  }
)
