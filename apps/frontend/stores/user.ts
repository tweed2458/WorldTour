import { defineStore } from 'pinia'
import type { User, Badge, Interest } from '~/types'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
    isAuthenticated: false,
    token: null as string | null
  }),

  getters: {
    hasVisited: (state) => (placeId: number) => {
      return state.user?.visitedPlaces.includes(placeId) || false
    },

    hasBadge: (state) => (badgeId: string) => {
      return state.user?.badges.some(b => b.id === badgeId) || false
    },

    userInterests: (state): Interest[] => {
      return state.user?.interests || []
    },

    visitedPlacesCount: (state): number => {
      return state.user?.visitedPlaces.length || 0
    },

    badgesCount: (state): number => {
      return state.user?.badges.length || 0
    }
  },

  actions: {
    async login(email: string, password: string) {
      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ user: User; token: string }>(`${config.public.apiBase}/auth/login`, {
          method: 'POST',
          body: { email, password }
        })

        this.user = response.user
        this.token = response.token
        this.isAuthenticated = true

        // Store token in localStorage
        if (process.client) {
          localStorage.setItem('auth_token', response.token)
        }

        return response
      } catch (error) {
        console.error('Login error:', error)
        throw error
      }
    },

    async register(name: string, email: string, password: string) {
      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ user: User; token: string }>(`${config.public.apiBase}/auth/register`, {
          method: 'POST',
          body: { name, email, password }
        })

        this.user = response.user
        this.token = response.token
        this.isAuthenticated = true

        if (process.client) {
          localStorage.setItem('auth_token', response.token)
        }

        return response
      } catch (error) {
        console.error('Register error:', error)
        throw error
      }
    },

    async logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false

      if (process.client) {
        localStorage.removeItem('auth_token')
      }
    },

    async fetchUser() {
      if (!this.token) return

      try {
        const config = useRuntimeConfig()
        const user = await $fetch<User>(`${config.public.apiBase}/users/me`, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })

        this.user = user
        this.isAuthenticated = true
      } catch (error) {
        console.error('Fetch user error:', error)
        this.logout()
      }
    },

    async updateInterests(interests: Interest[]) {
      if (!this.user) return

      try {
        const config = useRuntimeConfig()
        const updated = await $fetch<User>(`${config.public.apiBase}/users/me/interests`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${this.token}`
          },
          body: { interests }
        })

        this.user = updated
      } catch (error) {
        console.error('Update interests error:', error)
        throw error
      }
    },

    async addVisitedPlace(placeId: number) {
      if (!this.user) return

      try {
        const config = useRuntimeConfig()
        const updated = await $fetch<User>(`${config.public.apiBase}/users/me/visited`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.token}`
          },
          body: { placeId }
        })

        this.user = updated
      } catch (error) {
        console.error('Add visited place error:', error)
        throw error
      }
    },

    async earnBadge(badge: Badge) {
      if (!this.user) return

      this.user.badges.push({
        ...badge,
        earnedAt: new Date()
      })

      try {
        const config = useRuntimeConfig()
        await $fetch(`${config.public.apiBase}/users/me/badges`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.token}`
          },
          body: { badgeId: badge.id }
        })
      } catch (error) {
        console.error('Earn badge error:', error)
      }
    },

    initializeFromStorage() {
      if (process.client) {
        const token = localStorage.getItem('auth_token')
        if (token) {
          this.token = token
          this.fetchUser()
        }
      }
    }
  }
})
