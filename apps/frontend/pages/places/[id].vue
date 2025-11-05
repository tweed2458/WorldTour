<template>
  <div v-if="place" class="pb-20 md:pb-8">
    <!-- Image Gallery -->
    <div class="relative h-64 md:h-96 overflow-hidden">
      <img
        :src="currentPhoto"
        :alt="place.name"
        class="w-full h-full object-cover"
      />

      <!-- Photo Navigation -->
      <div v-if="place.photos.length > 1" class="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        <button
          v-for="(photo, index) in place.photos"
          :key="index"
          @click="currentPhotoIndex = index"
          class="w-2 h-2 rounded-full transition-all"
          :class="currentPhotoIndex === index ? 'bg-white w-4' : 'bg-white/50'"
        />
      </div>

      <!-- Back Button -->
      <button
        @click="router.back()"
        class="absolute top-4 left-4 p-2 rounded-full bg-white/90 backdrop-blur hover:bg-white"
      >
        <Icon name="mdi:arrow-left" class="text-2xl" />
      </button>

      <!-- Badge Indicator -->
      <div v-if="userStore.hasBadge(place.badge.id)" class="absolute top-4 right-4">
        <div class="p-3 rounded-full bg-yellow-400 text-2xl">
          {{ place.badge.icon }}
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-4xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-6">
        <div class="flex items-start justify-between mb-3">
          <div>
            <h1 class="text-3xl font-bold mb-2">{{ place.name }}</h1>
            <span class="badge bg-primary-100 text-primary-700">
              {{ $t(`place.type.${place.type}`) }}
            </span>
          </div>
        </div>

        <!-- Rating -->
        <div class="flex items-center mb-4">
          <StarRating
            :rating="place.rating"
            :readonly="!userStore.isAuthenticated"
            :show-value="true"
            @update:rating="handleRating"
          />
          <span class="ml-2 text-sm text-gray-600">
            ({{ place.ratingsCount }} {{ $t('place.rating') }}s)
          </span>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3 flex-wrap">
          <button
            v-if="!userStore.hasBadge(place.badge.id) && userStore.isAuthenticated"
            @click="earnBadge"
            class="btn-primary flex items-center gap-2"
          >
            <Icon name="mdi:medal" />
            {{ $t('place.getBadge') }}
          </button>
          <button class="btn-outline flex items-center gap-2">
            <Icon name="mdi:directions" />
            {{ $t('place.directions') }}
          </button>
          <button class="btn-outline flex items-center gap-2">
            <Icon name="mdi:share-variant" />
            {{ $t('place.share') }}
          </button>
        </div>
      </div>

      <!-- Description -->
      <section class="mb-8">
        <h2 class="text-2xl font-bold mb-4">{{ $t('place.description') }}</h2>
        <p class="text-gray-700 leading-relaxed whitespace-pre-line">
          {{ place.description }}
        </p>
      </section>

      <!-- Visit Times -->
      <section class="mb-8 p-4 bg-blue-50 rounded-lg">
        <h3 class="font-semibold mb-2 flex items-center">
          <Icon name="mdi:clock-outline" class="mr-2 text-primary-600" />
          {{ $t('place.visitTimes') }}
        </h3>
        <p class="text-gray-700">{{ place.visitTimes }}</p>
        <p v-if="place.bestTime" class="text-sm text-gray-600 mt-2">
          {{ $t('place.bestTime') }}: {{ place.bestTime }}
        </p>
      </section>

      <!-- Must See -->
      <section v-if="place.mustSee.length > 0" class="mb-8">
        <h2 class="text-2xl font-bold mb-4">{{ $t('place.mustSee') }}</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            v-for="item in place.mustSee"
            :key="item"
            class="flex items-center p-3 bg-green-50 rounded-lg"
          >
            <Icon name="mdi:check-circle" class="text-green-600 mr-3 text-xl" />
            <span class="font-medium">{{ item }}</span>
          </div>
        </div>
      </section>

      <!-- Points of Interest -->
      <section v-if="place.pointsOfInterest.length > 0" class="mb-8">
        <h2 class="text-2xl font-bold mb-6">{{ $t('place.pointsOfInterest') }}</h2>
        <div class="space-y-8">
          <div
            v-for="poi in place.pointsOfInterest"
            :key="poi.id"
            class="border-b border-gray-200 pb-8 last:border-0"
          >
            <h3 class="text-xl font-semibold mb-3">{{ poi.name }}</h3>

            <!-- POI Photos -->
            <div v-if="poi.photos.length > 0" class="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
              <img
                v-for="(photo, index) in poi.photos"
                :key="index"
                :src="photo"
                :alt="poi.name"
                class="w-full h-32 object-cover rounded-lg"
              />
            </div>

            <p class="text-gray-700 mb-4 leading-relaxed">
              {{ poi.description }}
            </p>

            <!-- Audio Guide -->
            <AudioPlayer v-if="poi.audioGuide" :src="poi.audioGuide" />
          </div>
        </div>
      </section>
    </div>
  </div>

  <!-- Loading State -->
  <div v-else class="flex items-center justify-center min-h-screen">
    <Icon name="mdi:loading" class="text-4xl text-primary-600 animate-spin" />
  </div>
</template>

<script setup lang="ts">
import { usePlacesStore } from '~/stores/places'
import { useUserStore } from '~/stores/user'

const route = useRoute()
const router = useRouter()
const placesStore = usePlacesStore()
const userStore = useUserStore()

const placeId = computed(() => parseInt(route.params.id as string))
const place = computed(() => placesStore.currentPlace)
const currentPhotoIndex = ref(0)

const currentPhoto = computed(() => {
  if (!place.value) return ''
  return place.value.photos[currentPhotoIndex.value] || place.value.photos[0]
})

const handleRating = async (rating: number) => {
  if (!userStore.isAuthenticated) {
    router.push('/login')
    return
  }

  try {
    await placesStore.ratePlace(placeId.value, rating)
  } catch (error) {
    alert('Failed to submit rating')
  }
}

const earnBadge = async () => {
  if (!place.value) return

  await userStore.earnBadge(place.value.badge)
  await userStore.addVisitedPlace(placeId.value)

  alert($t('place.badgeEarned'))
}

// Load place data
onMounted(async () => {
  await placesStore.fetchPlaceById(placeId.value)
})
</script>
