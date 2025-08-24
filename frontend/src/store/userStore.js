import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

export const useUserStore =  create(
  devtools(
    persist(
      (set) => ({
        user: null,
        setUser: (user) => set({user}),
        clearUser: () => set({user:null})
      }),
      {
        name:'user-store'
      }
    )
  )
)