<template>
  <div class="pb-20 md:pb-8">
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-12 px-4">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-4xl md:text-5xl font-bold mb-4 text-center">
          {{ $t('home.title') }}
        </h1>
        <p class="text-xl text-center mb-8 text-primary-100">
          {{ $t('home.subtitle') }}
        </p>

        <!-- Search Bar -->
        <div class="max-w-2xl mx-auto">
          <SearchBar @search="handleSearch" ref="searchBarRef" />
          <button
            @click="searchBarRef?.toggleFilters()"
            class="mt-3 text-sm text-white/90 hover:text-white flex items-center mx-auto"
          >
            <Icon name="mdi:filter-variant" class="mr-1" />
            Filtres
          </button>
        </div>

        <!-- Geolocation Button -->
        <div class="flex flex-col items-center mt-6 gap-2">
          <button
            @click="getNearbyPlaces"
            class="btn bg-white text-primary-600 hover:bg-primary-50 flex items-center gap-2 transition-all"
            :disabled="loadingLocation"
            :class="{ 'opacity-70 cursor-not-allowed': loadingLocation }"
          >
            <Icon
              :name="loadingLocation ? 'mdi:loading' : 'mdi:crosshairs-gps'"
              class="text-xl"
              :class="{ 'animate-spin': loadingLocation }"
            />
            {{ loadingLocation ? 'Localisation...' : $t('home.nearMe') }}
          </button>
          <p v-if="locationError" class="text-red-100 text-sm">
            {{ locationError }}
          </p>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Loading State -->
      <div v-if="placesStore.loading" class="text-center py-12">
        <Icon name="mdi:loading" class="text-4xl text-primary-600 animate-spin" />
        <p class="text-gray-600 mt-4">{{ $t('common.loading') }}</p>
      </div>

      <!-- Nearby Places -->
      <section v-else-if="nearbyPlaces.length > 0" class="mb-12">
        <h2 class="text-2xl font-bold mb-6">{{ $t('home.nearMe') }}</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <PlaceCard
            v-for="place in nearbyPlaces"
            :key="place.id"
            :place="place"
          />
        </div>
      </section>

      <!-- Popular Places -->
      <section v-if="popularPlaces.length > 0" class="mb-12">
        <h2 class="text-2xl font-bold mb-6">{{ $t('home.popular') }}</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <PlaceCard
            v-for="place in popularPlaces"
            :key="place.id"
            :place="place"
          />
        </div>
      </section>

      <!-- Recommended Places (if user is logged in) -->
      <section v-if="userStore.isAuthenticated && recommendedPlaces.length > 0" class="mb-12">
        <h2 class="text-2xl font-bold mb-6">{{ $t('home.recommended') }}</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <PlaceCard
            v-for="place in recommendedPlaces"
            :key="place.id"
            :place="place"
          />
        </div>
      </section>

      <!-- Empty State -->
      <div v-if="!placesStore.loading && placesStore.places.length === 0" class="text-center py-12">
        <Icon name="mdi:map-marker-question" class="text-6xl text-gray-300 mb-4" />
        <p class="text-gray-600">{{ $t('common.error') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePlacesStore } from '~/stores/places'
import { useUserStore } from '~/stores/user'

const placesStore = usePlacesStore()
const userStore = useUserStore()
const searchBarRef = ref()
const loadingLocation = ref(false)
const locationError = ref('')

const nearbyPlaces = computed(() => placesStore.nearbyPlaces)
const popularPlaces = computed(() => placesStore.popularPlaces)
const recommendedPlaces = computed(() => {
  if (!userStore.isAuthenticated) return []

  // Filter places based on user interests
  return placesStore.places.filter(place => {
    // This would be more sophisticated in production
    return !userStore.hasVisited(place.id)
  }).slice(0, 6)
})

const handleSearch = async (query: string, filters: any) => {
  await placesStore.fetchPlaces({
    query,
    ...filters
  })
}

const getNearbyPlaces = async () => {
  // Check if geolocation is supported
  if (!navigator.geolocation) {
    locationError.value = 'La géolocalisation n\'est pas supportée par votre navigateur'
    setTimeout(() => locationError.value = '', 5000)
    return
  }

  // Reset error and start loading
  locationError.value = ''
  loadingLocation.value = true

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        await placesStore.fetchNearbyPlaces(
          position.coords.latitude,
          position.coords.longitude
        )
        loadingLocation.value = false

        // Scroll to results
        if (nearbyPlaces.value.length > 0) {
          setTimeout(() => {
            document.querySelector('section')?.scrollIntoView({ behavior: 'smooth' })
          }, 100)
        }
      } catch (error) {
        console.error('Fetch nearby error:', error)
        locationError.value = 'Erreur lors de la récupération des lieux'
        loadingLocation.value = false
      }
    },
    (error) => {
      console.error('Geolocation error:', error)
      loadingLocation.value = false

      // More specific error messages
      switch (error.code) {
        case error.PERMISSION_DENIED:
          locationError.value = 'Vous devez autoriser l\'accès à votre position'
          break
        case error.POSITION_UNAVAILABLE:
          locationError.value = 'Position non disponible'
          break
        case error.TIMEOUT:
          locationError.value = 'La demande de localisation a expiré'
          break
        default:
          locationError.value = 'Impossible d\'obtenir votre position'
      }

      // Clear error after 5 seconds
      setTimeout(() => locationError.value = '', 5000)
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  )
}

// Load initial data
onMounted(async () => {
  if (placesStore.places.length === 0) {
    await placesStore.fetchPlaces()
  }
})
</script>
