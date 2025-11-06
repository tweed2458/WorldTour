import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

interface Place {
  id: number
  name: string
  type: string
  location: {
    lat: number
    lng: number
  }
  rating: number
  ratingsCount: number
  description: string
  mustSee: string[]
  visitTimes: string
  bestTime: string | null
  photos: string[]
  pointsOfInterest?: PointOfInterest[]
  badge?: any
  pointsOfInterestCount?: number
  createdAt: string
  updatedAt: string
}

interface PointOfInterest {
  id: number
  name: string
  description: string
  photos: string[]
  audioGuide: string | null
  placeId: number
  createdAt: string
  updatedAt: string
}

interface UpdatePlaceData {
  name?: string
  type?: string
  latitude?: number
  longitude?: number
  description?: string
  mustSee?: string[]
  visitTimes?: string
  bestTime?: string | null
  photos?: string[]
}

interface CreatePOIData {
  name: string
  description: string
  photos?: string[]
  audioGuide?: string
}

interface UpdatePOIData {
  name?: string
  description?: string
  photos?: string[]
  audioGuide?: string | null
}

export const usePlacesStore = defineStore('places', {
  state: () => ({
    places: [] as Place[],
    currentPlace: null as Place | null,
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchMyPlaces() {
      this.loading = true
      this.error = null

      try {
        const authStore = useAuthStore()
        const config = useRuntimeConfig()

        const places = await $fetch<Place[]>(
          `${config.public.apiBase}/admin/my-places`,
          {
            headers: {
              Authorization: `Bearer ${authStore.token}`
            }
          }
        )

        this.places = places
      } catch (err: any) {
        this.error = err.message || 'Failed to fetch places'
        console.error('Fetch places error:', err)
      } finally {
        this.loading = false
      }
    },

    async fetchPlace(id: number) {
      this.loading = true
      this.error = null

      try {
        const authStore = useAuthStore()
        const config = useRuntimeConfig()

        const place = await $fetch<Place>(
          `${config.public.apiBase}/admin/places/${id}`,
          {
            headers: {
              Authorization: `Bearer ${authStore.token}`
            }
          }
        )

        this.currentPlace = place
        return place
      } catch (err: any) {
        this.error = err.message || 'Failed to fetch place'
        console.error('Fetch place error:', err)
        return null
      } finally {
        this.loading = false
      }
    },

    async updatePlace(id: number, data: UpdatePlaceData) {
      this.loading = true
      this.error = null

      try {
        const authStore = useAuthStore()
        const config = useRuntimeConfig()

        const updatedPlace = await $fetch<Place>(
          `${config.public.apiBase}/admin/places/${id}`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${authStore.token}`
            },
            body: data
          }
        )

        // Update in places list
        const index = this.places.findIndex(p => p.id === id)
        if (index !== -1) {
          this.places[index] = updatedPlace
        }

        // Update current place
        if (this.currentPlace?.id === id) {
          this.currentPlace = updatedPlace
        }

        return updatedPlace
      } catch (err: any) {
        this.error = err.message || 'Failed to update place'
        console.error('Update place error:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    async createPOI(placeId: number, data: CreatePOIData) {
      this.loading = true
      this.error = null

      try {
        const authStore = useAuthStore()
        const config = useRuntimeConfig()

        const poi = await $fetch<PointOfInterest>(
          `${config.public.apiBase}/admin/places/${placeId}/poi`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${authStore.token}`
            },
            body: data
          }
        )

        // Add to current place POIs
        if (this.currentPlace?.id === placeId && this.currentPlace.pointsOfInterest) {
          this.currentPlace.pointsOfInterest.push(poi)
        }

        return poi
      } catch (err: any) {
        this.error = err.message || 'Failed to create POI'
        console.error('Create POI error:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    async updatePOI(placeId: number, poiId: number, data: UpdatePOIData) {
      this.loading = true
      this.error = null

      try {
        const authStore = useAuthStore()
        const config = useRuntimeConfig()

        const updatedPOI = await $fetch<PointOfInterest>(
          `${config.public.apiBase}/admin/places/${placeId}/poi/${poiId}`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${authStore.token}`
            },
            body: data
          }
        )

        // Update in current place POIs
        if (this.currentPlace?.id === placeId && this.currentPlace.pointsOfInterest) {
          const index = this.currentPlace.pointsOfInterest.findIndex(p => p.id === poiId)
          if (index !== -1) {
            this.currentPlace.pointsOfInterest[index] = updatedPOI
          }
        }

        return updatedPOI
      } catch (err: any) {
        this.error = err.message || 'Failed to update POI'
        console.error('Update POI error:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    async deletePOI(placeId: number, poiId: number) {
      this.loading = true
      this.error = null

      try {
        const authStore = useAuthStore()
        const config = useRuntimeConfig()

        await $fetch(
          `${config.public.apiBase}/admin/places/${placeId}/poi/${poiId}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${authStore.token}`
            }
          }
        )

        // Remove from current place POIs
        if (this.currentPlace?.id === placeId && this.currentPlace.pointsOfInterest) {
          this.currentPlace.pointsOfInterest = this.currentPlace.pointsOfInterest.filter(
            p => p.id !== poiId
          )
        }
      } catch (err: any) {
        this.error = err.message || 'Failed to delete POI'
        console.error('Delete POI error:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    clearError() {
      this.error = null
    }
  }
})
