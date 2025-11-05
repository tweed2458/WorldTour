<template>
  <div class="card cursor-pointer" @click="navigateToPlace">
    <div class="relative h-48 overflow-hidden">
      <img
        :src="place.photos[0] || '/placeholder.jpg'"
        :alt="place.name"
        class="w-full h-full object-cover"
      />
      <div class="absolute top-2 right-2">
        <span class="badge bg-white/90 backdrop-blur text-gray-800">
          {{ $t(`place.type.${place.type}`) }}
        </span>
      </div>
    </div>

    <div class="p-4">
      <h3 class="text-lg font-semibold mb-2 line-clamp-2">{{ place.name }}</h3>

      <div class="flex items-center mb-2">
        <StarRating :rating="place.rating" :readonly="true" class="mr-2" />
        <span class="text-sm text-gray-600">
          ({{ place.ratingsCount }})
        </span>
      </div>

      <p class="text-sm text-gray-600 line-clamp-2 mb-3">
        {{ place.description }}
      </p>

      <div v-if="place.distance" class="flex items-center text-sm text-gray-500">
        <Icon name="mdi:map-marker-distance" class="mr-1" />
        <span>{{ formatDistance(place.distance) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Place } from '~/types'

const props = defineProps<{
  place: Place
}>()

const router = useRouter()

const navigateToPlace = () => {
  router.push(`/places/${props.place.id}`)
}

const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${Math.round(meters)}m`
  }
  return `${(meters / 1000).toFixed(1)}km`
}
</script>
