import { defineStore } from 'pinia'
import type { Tour, Interest } from '~/types'

export const useToursStore = defineStore('tours', {
  state: () => ({
    tours: [] as Tour[],
    currentTour: null as Tour | null,
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchTours() {
      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const userStore = useUserStore()

        this.tours = await $fetch<Tour[]>(`${config.public.apiBase}/tours`, {
          headers: userStore.token ? {
            Authorization: `Bearer ${userStore.token}`
          } : undefined
        })
      } catch (error) {
        console.error('Fetch tours error:', error)
        this.error = 'Failed to fetch tours'
        throw error
      } finally {
        this.loading = false
      }
    },

    async generateTour(
      duration: number,
      interests: Interest[],
      location?: { lat: number; lng: number }
    ) {
      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const userStore = useUserStore()

        const tour = await $fetch<Tour>(`${config.public.apiBase}/tours/generate`, {
          method: 'POST',
          headers: userStore.token ? {
            Authorization: `Bearer ${userStore.token}`
          } : undefined,
          body: { duration, interests, location }
        })

        this.currentTour = tour
        this.tours.push(tour)

        return tour
      } catch (error) {
        console.error('Generate tour error:', error)
        this.error = 'Failed to generate tour'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchTourById(id: number) {
      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        this.currentTour = await $fetch<Tour>(`${config.public.apiBase}/tours/${id}`)
        return this.currentTour
      } catch (error) {
        console.error('Fetch tour error:', error)
        this.error = 'Failed to fetch tour'
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})
