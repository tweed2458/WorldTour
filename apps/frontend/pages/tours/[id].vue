<template>
  <div v-if="tour" class="pb-20 md:pb-8">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <button @click="router.back()" class="text-primary-600 mb-4 flex items-center">
          <Icon name="mdi:arrow-left" class="mr-1" />
          Retour
        </button>

        <h1 class="text-3xl font-bold mb-4">{{ tour.name }}</h1>

        <div class="flex items-center gap-6 text-gray-600 mb-4">
          <div class="flex items-center">
            <Icon name="mdi:clock-outline" class="mr-2 text-xl" />
            <span>{{ tour.duration }} minutes</span>
          </div>
          <div class="flex items-center">
            <Icon name="mdi:map-marker" class="mr-2 text-xl" />
            <span>{{ tour.places.length }} lieux</span>
          </div>
          <div v-if="tour.distance" class="flex items-center">
            <Icon name="mdi:walk" class="mr-2 text-xl" />
            <span>{{ (tour.distance / 1000).toFixed(1) }} km</span>
          </div>
        </div>

        <div class="flex flex-wrap gap-2 mb-6">
          <span
            v-for="interest in tour.userPreferences"
            :key="interest"
            class="badge bg-primary-100 text-primary-700"
          >
            {{ $t(`tour.interests.${interest}`) }}
          </span>
        </div>

        <p v-if="tour.description" class="text-gray-700 leading-relaxed">
          {{ tour.description }}
        </p>
      </div>

      <!-- Places List -->
      <section>
        <h2 class="text-2xl font-bold mb-6">Lieux du parcours</h2>
        <div class="space-y-6">
          <div
            v-for="(place, index) in tour.places"
            :key="place.id"
            class="flex gap-4 items-start"
          >
            <!-- Step Number -->
            <div class="flex-shrink-0">
              <div class="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold">
                {{ index + 1 }}
              </div>
              <div
                v-if="index < tour.places.length - 1"
                class="w-0.5 h-full bg-primary-200 mx-auto mt-2"
                style="min-height: 80px"
              />
            </div>

            <!-- Place Card -->
            <div class="flex-1">
              <PlaceCard :place="place" />
            </div>
          </div>
        </div>
      </section>

      <!-- Start Tour Button -->
      <div class="fixed bottom-20 md:bottom-8 left-0 right-0 px-4 safe-bottom">
        <button class="btn-primary w-full max-w-md mx-auto block shadow-lg">
          <Icon name="mdi:navigation" class="mr-2" />
          {{ $t('tour.startTour') }}
        </button>
      </div>
    </div>
  </div>

  <div v-else class="flex items-center justify-center min-h-screen">
    <Icon name="mdi:loading" class="text-4xl text-primary-600 animate-spin" />
  </div>
</template>

<script setup lang="ts">
import { useToursStore } from '~/stores/tours'

const route = useRoute()
const router = useRouter()
const toursStore = useToursStore()

const tourId = computed(() => parseInt(route.params.id as string))
const tour = computed(() => toursStore.currentTour)

onMounted(async () => {
  await toursStore.fetchTourById(tourId.value)
})
</script>
