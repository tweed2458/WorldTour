<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">
        {{ $t('admin.dashboard') }}
      </h1>
      <p class="mt-2 text-gray-600">
        {{ $t('admin.dashboardSubtitle') }}
      </p>
    </div>

    <!-- Loading state -->
    <div v-if="placesStore.loading" class="text-center py-12">
      <Icon name="mdi:loading" class="text-4xl text-admin-600 animate-spin mx-auto" />
      <p class="text-gray-600 mt-4">{{ $t('common.loading') }}</p>
    </div>

    <!-- Error state -->
    <div v-else-if="placesStore.error" class="card bg-red-50 border border-red-200">
      <p class="text-red-700">{{ placesStore.error }}</p>
    </div>

    <!-- Empty state -->
    <div v-else-if="placesStore.places.length === 0" class="text-center py-12">
      <Icon name="mdi:map-marker-off" class="text-6xl text-gray-300 mx-auto mb-4" />
      <h3 class="text-xl font-semibold text-gray-700 mb-2">
        {{ $t('admin.noPlaces') }}
      </h3>
      <p class="text-gray-600">
        {{ $t('admin.noPlacesDescription') }}
      </p>
    </div>

    <!-- Places grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink
        v-for="place in placesStore.places"
        :key="place.id"
        :to="`/places/${place.id}`"
        class="card hover:shadow-lg transition-shadow duration-200 cursor-pointer"
      >
        <!-- Place image -->
        <div
          v-if="place.photos && place.photos.length > 0"
          class="w-full h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden"
        >
          <img
            :src="place.photos[0]"
            :alt="place.name"
            class="w-full h-full object-cover"
          />
        </div>
        <div
          v-else
          class="w-full h-48 bg-gradient-to-br from-admin-100 to-admin-200 rounded-lg mb-4 flex items-center justify-center"
        >
          <Icon name="mdi:image-off" class="text-4xl text-admin-400" />
        </div>

        <!-- Place info -->
        <h3 class="text-xl font-semibold text-gray-900 mb-2">
          {{ place.name }}
        </h3>

        <div class="flex items-center text-sm text-gray-600 mb-2">
          <Icon name="mdi:map-marker" class="mr-1" />
          {{ place.type }}
        </div>

        <div class="flex items-center text-sm text-gray-600 mb-2">
          <Icon name="mdi:star" class="mr-1 text-yellow-500" />
          {{ place.rating.toFixed(1) }} ({{ place.ratingsCount }} {{ $t('common.ratings') }})
        </div>

        <div class="flex items-center text-sm text-gray-600 mb-4">
          <Icon name="mdi:map-marker-radius" class="mr-1" />
          {{ place.pointsOfInterestCount || 0 }} {{ $t('admin.pointsOfInterest') }}
        </div>

        <!-- Description preview -->
        <p class="text-sm text-gray-600 mb-4 line-clamp-2">
          {{ place.description }}
        </p>

        <!-- Actions -->
        <div class="flex items-center justify-between pt-4 border-t border-gray-200">
          <span class="text-sm text-gray-500">
            {{ $t('admin.updated') }}: {{ formatDate(place.updatedAt) }}
          </span>
          <Icon name="mdi:chevron-right" class="text-xl text-admin-600" />
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { usePlacesStore } from '~/stores/places'

const authStore = useAuthStore()
const placesStore = usePlacesStore()

// Redirect to login if not authenticated
onMounted(async () => {
  await authStore.loadFromStorage()

  if (!authStore.isAuthenticated) {
    navigateTo('/login')
    return
  }

  // Fetch admin's places
  await placesStore.fetchMyPlaces()
})

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString()
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
