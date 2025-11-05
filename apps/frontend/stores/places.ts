import { defineStore } from 'pinia'
import type { Place, SearchFilters } from '~/types'

export const usePlacesStore = defineStore('places', {
  state: () => ({
    places: [] as Place[],
    currentPlace: null as Place | null,
    nearbyPlaces: [] as Place[],
    loading: false,
    error: null as string | null
  }),

  getters: {
    getPlaceById: (state) => (id: number) => {
      return state.places.find(p => p.id === id)
    },

    popularPlaces: (state) => {
      return [...state.places]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 10)
    }
  },

  actions: {
    async fetchPlaces(filters?: SearchFilters) {
      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const query = new URLSearchParams()

        if (filters?.query) query.append('q', filters.query)
        if (filters?.type) query.append('type', filters.type)
        if (filters?.minRating) query.append('minRating', filters.minRating.toString())
        if (filters?.maxDistance) query.append('maxDistance', filters.maxDistance.toString())
        if (filters?.interests) query.append('interests', filters.interests.join(','))

        const url = `${config.public.apiBase}/places?${query}`
        this.places = await $fetch<Place[]>(url)
      } catch (error) {
        console.error('Fetch places error:', error)
        this.error = 'Failed to fetch places'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchPlaceById(id: number) {
      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        this.currentPlace = await $fetch<Place>(`${config.public.apiBase}/places/${id}`)
        return this.currentPlace
      } catch (error) {
        console.error('Fetch place error:', error)
        this.error = 'Failed to fetch place'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchNearbyPlaces(lat: number, lng: number, radius: number = 5000) {
      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        this.nearbyPlaces = await $fetch<Place[]>(
          `${config.public.apiBase}/places/nearby?lat=${lat}&lng=${lng}&radius=${radius}`
        )
      } catch (error) {
        console.error('Fetch nearby places error:', error)
        this.error = 'Failed to fetch nearby places'
        throw error
      } finally {
        this.loading = false
      }
    },

    async ratePlace(placeId: number, rating: number, comment?: string) {
      try {
        const config = useRuntimeConfig()
        const userStore = useUserStore()

        await $fetch(`${config.public.apiBase}/places/${placeId}/ratings`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${userStore.token}`
          },
          body: { rating, comment }
        })

        // Refresh the place to get updated rating
        await this.fetchPlaceById(placeId)
      } catch (error) {
        console.error('Rate place error:', error)
        throw error
      }
    }
  }
})
