<template>
  <div class="h-screen flex flex-col">
    <!-- Header with controls -->
    <div class="bg-white shadow-sm z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <!-- Title and back button -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <NuxtLink to="/" class="text-primary-600 hover:text-primary-700">
              <Icon name="mdi:arrow-left" class="text-2xl" />
            </NuxtLink>
            <h1 class="text-2xl font-bold text-gray-900">
              {{ $t('map.title') }}
            </h1>
          </div>

          <!-- Results count -->
          <div v-if="nearbyPlaces.length > 0" class="text-sm text-gray-600">
            {{ nearbyPlaces.length }} {{ $t('map.placesFound') }}
          </div>
        </div>

        <!-- Controls -->
        <div class="flex flex-col sm:flex-row gap-4">
          <!-- Radius slider -->
          <div class="flex-1">
            <RadiusSlider
              :model-value="searchRadius"
              @update:model-value="updateRadius"
            />
          </div>

          <!-- Near me button -->
          <div class="flex items-center">
            <button
              @click="getNearbyPlaces"
              :disabled="loading"
              class="btn-primary px-6 py-3 rounded-lg font-medium text-white transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon
                v-if="loading"
                name="mdi:loading"
                class="text-xl animate-spin"
              />
              <Icon
                v-else
                name="mdi:crosshairs-gps"
                class="text-xl"
              />
              <span>{{ $t('home.nearMe') }}</span>
            </button>
          </div>
        </div>

        <!-- Error message -->
        <div
          v-if="locationError"
          class="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-start"
        >
          <Icon name="mdi:alert-circle" class="text-xl mr-2 mt-0.5" />
          <div>
            <p class="font-medium">{{ $t('home.locationError') }}</p>
            <p class="text-sm mt-1">{{ locationError }}</p>
          </div>
        </div>

        <!-- Info message when no search done -->
        <div
          v-if="!loading && !locationError && nearbyPlaces.length === 0 && !userLocation"
          class="mt-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg flex items-start"
        >
          <Icon name="mdi:information" class="text-xl mr-2 mt-0.5" />
          <div>
            <p class="font-medium">{{ $t('map.searchPrompt') }}</p>
            <p class="text-sm mt-1">{{ $t('map.searchPromptDetails') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Map -->
    <div class="flex-1 relative">
      <ClientOnly>
        <Map
          v-if="nearbyPlaces.length > 0 || userLocation"
          :places="nearbyPlaces"
          :user-location="userLocation"
          :radius="searchRadius"
          @place-click="handlePlaceClick"
        />
        <div v-else class="h-full flex items-center justify-center bg-gray-50">
          <div class="text-center">
            <Icon name="mdi:map-search" class="text-6xl text-gray-300 mx-auto mb-4" />
            <p class="text-gray-500 text-lg">{{ $t('map.noResults') }}</p>
            <p class="text-gray-400 text-sm mt-2">{{ $t('map.noResultsHint') }}</p>
          </div>
        </div>
        <template #fallback>
          <div class="h-full flex items-center justify-center bg-gray-50">
            <Icon name="mdi:loading" class="text-4xl text-primary-600 animate-spin" />
          </div>
        </template>
      </ClientOnly>
    </div>

    <!-- Place details modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="selectedPlace"
          class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          @click.self="selectedPlace = null"
        >
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-black bg-opacity-50" @click="selectedPlace = null" />

          <!-- Modal content -->
          <div
            class="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto"
            @click.stop
          >
            <!-- Close button -->
            <button
              @click="selectedPlace = null"
              class="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 z-10"
            >
              <Icon name="mdi:close" class="text-2xl" />
            </button>

            <!-- Image -->
            <div
              v-if="selectedPlace.photos && selectedPlace.photos.length > 0"
              class="w-full h-48 sm:h-64 bg-gray-200 overflow-hidden"
            >
              <img
                :src="selectedPlace.photos[0]"
                :alt="selectedPlace.name"
                class="w-full h-full object-cover"
              />
            </div>
            <div
              v-else
              class="w-full h-48 sm:h-64 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center"
            >
              <Icon name="mdi:image-off" class="text-6xl text-primary-400" />
            </div>

            <!-- Content -->
            <div class="p-6">
              <h2 class="text-2xl font-bold text-gray-900 mb-2">
                {{ selectedPlace.name }}
              </h2>

              <div class="flex items-center space-x-4 mb-4">
                <div class="flex items-center text-yellow-500">
                  <Icon name="mdi:star" class="mr-1" />
                  <span class="font-semibold">{{ selectedPlace.rating.toFixed(1) }}</span>
                </div>
                <span class="text-gray-400">•</span>
                <span class="text-gray-600">{{ selectedPlace.type }}</span>
                <span v-if="selectedPlace.distance" class="text-gray-400">•</span>
                <span v-if="selectedPlace.distance" class="text-primary-600 font-medium">
                  {{ (selectedPlace.distance / 1000).toFixed(1) }} km
                </span>
              </div>

              <p class="text-gray-700 mb-6">
                {{ selectedPlace.description }}
              </p>

              <!-- Action buttons -->
              <div class="flex gap-3">
                <NuxtLink
                  :to="`/places/${selectedPlace.id}`"
                  class="flex-1 btn-primary py-3 rounded-lg font-medium text-center"
                >
                  {{ $t('map.viewDetails') }}
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { usePlacesStore } from '~/stores/places'

const placesStore = usePlacesStore()
const { t } = useI18n()

const searchRadius = ref(5000) // Default 5km
const loading = ref(false)
const locationError = ref('')
const userLocation = ref<{ lat: number; lng: number } | null>(null)
const selectedPlace = ref<any>(null)

const nearbyPlaces = computed(() => placesStore.nearbyPlaces)

const updateRadius = (newRadius: number) => {
  searchRadius.value = newRadius
}

const getNearbyPlaces = async () => {
  if (!process.client) return

  loading.value = true
  locationError.value = ''

  if (!navigator.geolocation) {
    locationError.value = t('home.geolocationNotSupported')
    loading.value = false
    return
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        userLocation.value = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }

        await placesStore.fetchNearbyPlaces(
          position.coords.latitude,
          position.coords.longitude,
          searchRadius.value
        )

        loading.value = false
      } catch (error: any) {
        console.error('Error fetching places:', error)
        locationError.value = error.message || t('home.errorFetchingPlaces')
        loading.value = false
      }
    },
    (error) => {
      loading.value = false

      switch (error.code) {
        case error.PERMISSION_DENIED:
          locationError.value = t('home.permissionDenied')
          break
        case error.POSITION_UNAVAILABLE:
          locationError.value = t('home.positionUnavailable')
          break
        case error.TIMEOUT:
          locationError.value = t('home.timeout')
          break
        default:
          locationError.value = t('home.unknownError')
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  )
}

const handlePlaceClick = (place: any) => {
  selectedPlace.value = place
}

// Set page metadata
useHead({
  title: t('map.title'),
  meta: [
    { name: 'description', content: t('map.description') }
  ]
})
</script>

<style scoped>
.btn-primary {
  @apply bg-primary-600 hover:bg-primary-700 active:bg-primary-800;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div:last-child,
.modal-leave-active > div:last-child {
  transition: transform 0.3s ease;
}

.modal-enter-from > div:last-child {
  transform: translateY(100%);
}

.modal-leave-to > div:last-child {
  transform: translateY(100%);
}

@media (min-width: 640px) {
  .modal-enter-from > div:last-child,
  .modal-leave-to > div:last-child {
    transform: translateY(0) scale(0.9);
  }
}
</style>
