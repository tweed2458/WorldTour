<template>
  <div class="pb-20 md:pb-8">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">{{ $t('tour.title') }}</h1>

      <!-- Create Tour Section -->
      <section class="card p-6 mb-8">
        <h2 class="text-xl font-semibold mb-4">{{ $t('tour.createNew') }}</h2>

        <form @submit.prevent="generateTour" class="space-y-4">
          <!-- Duration -->
          <div>
            <label class="block text-sm font-medium mb-2">
              {{ $t('tour.duration') }}
            </label>
            <select v-model="tourDuration" class="input">
              <option :value="60">1 heure</option>
              <option :value="120">2 heures</option>
              <option :value="180">3 heures</option>
              <option :value="240">4 heures</option>
              <option :value="480">Journée complète</option>
            </select>
          </div>

          <!-- Interests -->
          <div>
            <label class="block text-sm font-medium mb-2">
              {{ $t('tour.preferences') }}
            </label>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <label
                v-for="interest in availableInterests"
                :key="interest"
                class="flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors"
                :class="selectedInterests.includes(interest)
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'"
              >
                <input
                  type="checkbox"
                  :value="interest"
                  v-model="selectedInterests"
                  class="mr-2"
                />
                <span>{{ $t(`tour.interests.${interest}`) }}</span>
              </label>
            </div>
          </div>

          <!-- Use Current Location -->
          <div class="flex items-center">
            <input
              type="checkbox"
              id="useLocation"
              v-model="useCurrentLocation"
              class="mr-2"
            />
            <label for="useLocation" class="text-sm">
              Utiliser ma position actuelle
            </label>
          </div>

          <button
            type="submit"
            class="btn-primary w-full"
            :disabled="toursStore.loading || selectedInterests.length === 0"
          >
            <Icon v-if="toursStore.loading" name="mdi:loading" class="animate-spin mr-2" />
            {{ $t('tour.createNew') }}
          </button>
        </form>
      </section>

      <!-- Existing Tours -->
      <section v-if="tours.length > 0">
        <h2 class="text-2xl font-bold mb-6">Parcours disponibles</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="tour in tours"
            :key="tour.id"
            class="card p-6 cursor-pointer hover:shadow-xl transition-shadow"
            @click="viewTour(tour.id)"
          >
            <h3 class="text-xl font-semibold mb-3">{{ tour.name }}</h3>
            <p v-if="tour.description" class="text-gray-600 mb-4 line-clamp-2">
              {{ tour.description }}
            </p>

            <div class="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <div class="flex items-center">
                <Icon name="mdi:clock-outline" class="mr-1" />
                {{ tour.duration }} min
              </div>
              <div class="flex items-center">
                <Icon name="mdi:map-marker" class="mr-1" />
                {{ tour.places.length }} lieux
              </div>
              <div v-if="tour.distance" class="flex items-center">
                <Icon name="mdi:walk" class="mr-1" />
                {{ (tour.distance / 1000).toFixed(1) }} km
              </div>
            </div>

            <div class="flex flex-wrap gap-2">
              <span
                v-for="interest in tour.userPreferences"
                :key="interest"
                class="badge bg-primary-100 text-primary-700 text-xs"
              >
                {{ $t(`tour.interests.${interest}`) }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Empty State -->
      <div v-else-if="!toursStore.loading" class="text-center py-12">
        <Icon name="mdi:map-marker-path" class="text-6xl text-gray-300 mb-4" />
        <p class="text-gray-600">Aucun parcours disponible</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToursStore } from '~/stores/tours'
import type { Interest } from '~/types'

const router = useRouter()
const toursStore = useToursStore()

const tourDuration = ref(120)
const selectedInterests = ref<Interest[]>([])
const useCurrentLocation = ref(false)

const availableInterests: Interest[] = ['art', 'history', 'architecture', 'science', 'nature', 'culture']

const tours = computed(() => toursStore.tours)

const generateTour = async () => {
  if (selectedInterests.value.length === 0) return

  try {
    let location: { lat: number; lng: number } | undefined

    if (useCurrentLocation.value && navigator.geolocation) {
      location = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }),
          reject
        )
      })
    }

    const tour = await toursStore.generateTour(
      tourDuration.value,
      selectedInterests.value,
      location
    )

    router.push(`/tours/${tour.id}`)
  } catch (error) {
    console.error('Failed to generate tour:', error)
    alert('Failed to generate tour')
  }
}

const viewTour = (id: number) => {
  router.push(`/tours/${id}`)
}

onMounted(async () => {
  if (tours.value.length === 0) {
    await toursStore.fetchTours()
  }
})
</script>
