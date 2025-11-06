<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Back button -->
    <NuxtLink to="/" class="inline-flex items-center text-admin-600 hover:text-admin-700 mb-6">
      <Icon name="mdi:arrow-left" class="mr-1" />
      {{ $t('common.back') }}
    </NuxtLink>

    <!-- Loading state -->
    <div v-if="loading" class="text-center py-12">
      <Icon name="mdi:loading" class="text-4xl text-admin-600 animate-spin mx-auto" />
      <p class="text-gray-600 mt-4">{{ $t('common.loading') }}</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="card bg-red-50 border border-red-200">
      <p class="text-red-700">{{ error }}</p>
    </div>

    <!-- Place edit form -->
    <div v-else-if="place" class="space-y-8">
      <!-- Header -->
      <div>
        <h1 class="text-3xl font-bold text-gray-900">{{ place.name }}</h1>
        <p class="text-gray-600 mt-2">{{ $t('admin.editPlace') }}</p>
      </div>

      <!-- Success message -->
      <div
        v-if="successMessage"
        class="p-4 bg-green-100 border border-green-400 text-green-700 rounded"
      >
        {{ successMessage }}
      </div>

      <!-- Place details form -->
      <div class="card">
        <h2 class="text-2xl font-semibold text-gray-900 mb-6">
          {{ $t('admin.placeDetails') }}
        </h2>

        <form @submit.prevent="handleUpdatePlace" class="space-y-6">
          <!-- Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ $t('admin.placeName') }}
            </label>
            <input
              v-model="placeForm.name"
              type="text"
              class="input"
              required
            />
          </div>

          <!-- Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ $t('admin.placeType') }}
            </label>
            <select v-model="placeForm.type" class="input" required>
              <option value="museum">{{ $t('places.museum') }}</option>
              <option value="monument">{{ $t('places.monument') }}</option>
              <option value="park">{{ $t('places.park') }}</option>
              <option value="historical">{{ $t('places.historical') }}</option>
              <option value="cultural">{{ $t('places.cultural') }}</option>
              <option value="religious">{{ $t('places.religious') }}</option>
              <option value="other">{{ $t('places.other') }}</option>
            </select>
          </div>

          <!-- Location -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ $t('admin.latitude') }}
              </label>
              <input
                v-model.number="placeForm.latitude"
                type="number"
                step="any"
                class="input"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ $t('admin.longitude') }}
              </label>
              <input
                v-model.number="placeForm.longitude"
                type="number"
                step="any"
                class="input"
                required
              />
            </div>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ $t('admin.description') }}
            </label>
            <textarea
              v-model="placeForm.description"
              rows="6"
              class="textarea"
              required
            />
          </div>

          <!-- Must See -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ $t('admin.mustSee') }}
            </label>
            <textarea
              v-model="mustSeeText"
              rows="4"
              class="textarea"
              :placeholder="$t('admin.mustSeePlaceholder')"
            />
            <p class="text-sm text-gray-500 mt-1">
              {{ $t('admin.mustSeeHelp') }}
            </p>
          </div>

          <!-- Visit Times -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ $t('admin.visitTimes') }}
            </label>
            <input
              v-model="placeForm.visitTimes"
              type="text"
              class="input"
              :placeholder="$t('admin.visitTimesPlaceholder')"
              required
            />
          </div>

          <!-- Best Time -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ $t('admin.bestTime') }}
            </label>
            <input
              v-model="placeForm.bestTime"
              type="text"
              class="input"
              :placeholder="$t('admin.bestTimePlaceholder')"
            />
          </div>

          <!-- Photos -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ $t('admin.photos') }}
            </label>
            <textarea
              v-model="photosText"
              rows="3"
              class="textarea"
              :placeholder="$t('admin.photosPlaceholder')"
            />
            <p class="text-sm text-gray-500 mt-1">
              {{ $t('admin.photosHelp') }}
            </p>
          </div>

          <!-- Submit button -->
          <div class="flex justify-end space-x-4">
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="saving"
            >
              <Icon
                v-if="saving"
                name="mdi:loading"
                class="animate-spin mr-2"
              />
              {{ saving ? $t('common.saving') : $t('common.save') }}
            </button>
          </div>
        </form>
      </div>

      <!-- Points of Interest section -->
      <PointsOfInterestManager
        :place-id="place.id"
        :pois="place.pointsOfInterest || []"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { usePlacesStore } from '~/stores/places'

const route = useRoute()
const authStore = useAuthStore()
const placesStore = usePlacesStore()

const placeId = computed(() => parseInt(route.params.id as string))

const place = ref(null as any)
const loading = ref(true)
const error = ref(null as string | null)
const saving = ref(false)
const successMessage = ref('')

const placeForm = ref({
  name: '',
  type: 'museum',
  latitude: 0,
  longitude: 0,
  description: '',
  mustSee: [] as string[],
  visitTimes: '',
  bestTime: '',
  photos: [] as string[]
})

const mustSeeText = ref('')
const photosText = ref('')

// Load place data
onMounted(async () => {
  await authStore.loadFromStorage()

  if (!authStore.isAuthenticated) {
    navigateTo('/login')
    return
  }

  try {
    place.value = await placesStore.fetchPlace(placeId.value)

    if (place.value) {
      // Populate form
      placeForm.value = {
        name: place.value.name,
        type: place.value.type,
        latitude: place.value.location.lat,
        longitude: place.value.location.lng,
        description: place.value.description,
        mustSee: place.value.mustSee || [],
        visitTimes: place.value.visitTimes,
        bestTime: place.value.bestTime || '',
        photos: place.value.photos || []
      }

      mustSeeText.value = place.value.mustSee?.join('\n') || ''
      photosText.value = place.value.photos?.join('\n') || ''
    } else {
      error.value = 'Place not found or access denied'
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to load place'
  } finally {
    loading.value = false
  }
})

const handleUpdatePlace = async () => {
  saving.value = true
  successMessage.value = ''

  try {
    // Parse mustSee and photos
    const mustSee = mustSeeText.value
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)

    const photos = photosText.value
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)

    // Prepare update data
    const updateData = {
      name: placeForm.value.name,
      type: placeForm.value.type,
      latitude: placeForm.value.latitude,
      longitude: placeForm.value.longitude,
      description: placeForm.value.description,
      mustSee,
      visitTimes: placeForm.value.visitTimes,
      bestTime: placeForm.value.bestTime || null,
      photos
    }

    const updatedPlace = await placesStore.updatePlace(placeId.value, updateData)

    if (updatedPlace) {
      place.value = updatedPlace
      successMessage.value = 'Place updated successfully!'

      // Clear success message after 3 seconds
      setTimeout(() => {
        successMessage.value = ''
      }, 3000)
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to update place'
  } finally {
    saving.value = false
  }
}
</script>
