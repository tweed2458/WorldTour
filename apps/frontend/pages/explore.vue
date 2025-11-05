<template>
  <div class="pb-20 md:pb-8">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-6">{{ $t('nav.explore') }}</h1>

      <!-- Search and Filters -->
      <div class="mb-8">
        <SearchBar @search="handleSearch" ref="searchBarRef" />
      </div>

      <!-- Results -->
      <div v-if="placesStore.loading" class="text-center py-12">
        <Icon name="mdi:loading" class="text-4xl text-primary-600 animate-spin" />
      </div>

      <div v-else-if="places.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <PlaceCard
          v-for="place in places"
          :key="place.id"
          :place="place"
        />
      </div>

      <div v-else class="text-center py-12">
        <Icon name="mdi:map-search-outline" class="text-6xl text-gray-300 mb-4" />
        <p class="text-gray-600">Aucun résultat trouvé</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePlacesStore } from '~/stores/places'

const placesStore = usePlacesStore()
const searchBarRef = ref()

const places = computed(() => placesStore.places)

const handleSearch = async (query: string, filters: any) => {
  await placesStore.fetchPlaces({
    query,
    ...filters
  })
}

onMounted(async () => {
  if (places.value.length === 0) {
    await placesStore.fetchPlaces()
  }
})
</script>
