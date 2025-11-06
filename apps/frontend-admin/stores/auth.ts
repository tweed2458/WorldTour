import { defineStore } from 'pinia'

interface User {
  id: number
  email: string
  name: string
  role: 'user' | 'admin'
}

interface LoginCredentials {
  email: string
  password: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
    loading: false,
    error: null as string | null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    isAdmin: (state) => state.user?.role === 'admin'
  },

  actions: {
    async login(credentials: LoginCredentials) {
      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ token: string; user: User }>(
          `${config.public.apiBase}/auth/login`,
          {
            method: 'POST',
            body: credentials
          }
        )

        // Check if user is admin
        if (response.user.role !== 'admin') {
          throw new Error('Access denied. Admin role required.')
        }

        this.token = response.token
        this.user = response.user

        // Store token in localStorage
        if (process.client) {
          localStorage.setItem('admin_token', response.token)
          localStorage.setItem('admin_user', JSON.stringify(response.user))
        }

        return true
      } catch (err: any) {
        this.error = err.message || 'Login failed'
        return false
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.user = null
      this.token = null

      if (process.client) {
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_user')
      }

      // Redirect to login
      navigateTo('/login')
    },

    async loadFromStorage() {
      if (!process.client) return

      const token = localStorage.getItem('admin_token')
      const userStr = localStorage.getItem('admin_user')

      if (token && userStr) {
        try {
          const user = JSON.parse(userStr)

          // Verify user is still admin
          if (user.role !== 'admin') {
            this.logout()
            return
          }

          this.token = token
          this.user = user
        } catch (err) {
          console.error('Failed to load user from storage:', err)
          this.logout()
        }
      }
    },

    clearError() {
      this.error = null
    }
  }
})
