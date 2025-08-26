import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

const useTokenStore= create(
  devtools(
    persist(
      (set) => ({
        token: "",
        setToken: (data) => set(() => ({ token: data})),
      }),
      {
        name:"token-store"
      }
    )
  )
)

export default useTokenStore