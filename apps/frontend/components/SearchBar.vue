<template>
  <div class="relative">
    <div class="relative">
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="$t('home.searchPlaceholder')"
        class="input pl-10 pr-4"
        @input="handleSearch"
      />
      <Icon
        name="mdi:magnify"
        class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl"
      />
      <button
        v-if="searchQuery"
        @click="clearSearch"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        <Icon name="mdi:close" class="text-xl" />
      </button>
    </div>

    <div v-if="showFilters" class="mt-3 flex flex-wrap gap-2">
      <select v-model="selectedType" class="input text-sm">
        <option value="">{{ $t('common.filter') }} - Type</option>
        <option value="museum">{{ $t('place.type.museum') }}</option>
        <option value="monument">{{ $t('place.type.monument') }}</option>
        <option value="church">{{ $t('place.type.church') }}</option>
        <option value="castle">{{ $t('place.type.castle') }}</option>
        <option value="park">{{ $t('place.type.park') }}</option>
      </select>

      <select v-model="minRating" class="input text-sm">
        <option value="0">{{ $t('common.filter') }} - Note</option>
        <option value="3">3+ ⭐</option>
        <option value="4">4+ ⭐</option>
        <option value="4.5">4.5+ ⭐</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  search: [query: string, filters: any]
}>()

const searchQuery = ref('')
const selectedType = ref('')
const minRating = ref('0')
const showFilters = ref(false)

let searchTimeout: NodeJS.Timeout

const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    emitSearch()
  }, 300)
}

const emitSearch = () => {
  emit('search', searchQuery.value, {
    type: selectedType.value || undefined,
    minRating: parseFloat(minRating.value) || undefined
  })
}

const clearSearch = () => {
  searchQuery.value = ''
  emitSearch()
}

watch([selectedType, minRating], () => {
  emitSearch()
})

defineExpose({
  toggleFilters: () => {
    showFilters.value = !showFilters.value
  }
})
</script>
