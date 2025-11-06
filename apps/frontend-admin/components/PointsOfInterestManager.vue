<template>
  <div class="card">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-semibold text-gray-900">
        {{ $t('admin.pointsOfInterest') }}
      </h2>
      <button
        @click="showCreateModal = true"
        class="btn btn-primary"
      >
        <Icon name="mdi:plus" class="mr-1" />
        {{ $t('admin.addPOI') }}
      </button>
    </div>

    <!-- POI list -->
    <div v-if="pois.length === 0" class="text-center py-8 text-gray-500">
      <Icon name="mdi:map-marker-off" class="text-4xl mx-auto mb-2" />
      <p>{{ $t('admin.noPOIs') }}</p>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="poi in pois"
        :key="poi.id"
        class="border border-gray-200 rounded-lg p-4 hover:border-admin-300 transition-colors"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              {{ poi.name }}
            </h3>
            <p class="text-sm text-gray-600 mb-3">
              {{ poi.description }}
            </p>

            <!-- Photos count -->
            <div v-if="poi.photos && poi.photos.length > 0" class="flex items-center text-sm text-gray-500 mb-2">
              <Icon name="mdi:image-multiple" class="mr-1" />
              {{ poi.photos.length }} {{ $t('admin.photos') }}
            </div>

            <!-- Audio guide indicator -->
            <div v-if="poi.audioGuide" class="flex items-center text-sm text-green-600 mb-2">
              <Icon name="mdi:microphone" class="mr-1" />
              {{ $t('admin.hasAudioGuide') }}
            </div>

            <!-- Metadata -->
            <p class="text-xs text-gray-400">
              {{ $t('admin.created') }}: {{ formatDate(poi.createdAt) }}
            </p>
          </div>

          <!-- Actions -->
          <div class="flex items-center space-x-2 ml-4">
            <button
              @click="editPOI(poi)"
              class="p-2 text-admin-600 hover:bg-admin-50 rounded"
              :title="$t('common.edit')"
            >
              <Icon name="mdi:pencil" class="text-xl" />
            </button>
            <button
              @click="confirmDeletePOI(poi)"
              class="p-2 text-red-600 hover:bg-red-50 rounded"
              :title="$t('common.delete')"
            >
              <Icon name="mdi:delete" class="text-xl" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <Modal
      v-if="showCreateModal || showEditModal"
      @close="closeModals"
    >
      <div class="p-6">
        <h3 class="text-2xl font-semibold text-gray-900 mb-6">
          {{ showEditModal ? $t('admin.editPOI') : $t('admin.addPOI') }}
        </h3>

        <form @submit.prevent="handleSubmitPOI" class="space-y-6">
          <!-- Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ $t('admin.poiName') }}
            </label>
            <input
              v-model="poiForm.name"
              type="text"
              class="input"
              required
            />
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ $t('admin.description') }}
            </label>
            <textarea
              v-model="poiForm.description"
              rows="4"
              class="textarea"
              required
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

          <!-- Audio Guide -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ $t('admin.audioGuideURL') }}
            </label>
            <input
              v-model="poiForm.audioGuide"
              type="url"
              class="input"
              :placeholder="$t('admin.audioGuidePlaceholder')"
            />
          </div>

          <!-- Error message -->
          <div v-if="poiError" class="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {{ poiError }}
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-4">
            <button
              type="button"
              @click="closeModals"
              class="btn btn-secondary"
              :disabled="poiSaving"
            >
              {{ $t('common.cancel') }}
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="poiSaving"
            >
              <Icon
                v-if="poiSaving"
                name="mdi:loading"
                class="animate-spin mr-2"
              />
              {{ poiSaving ? $t('common.saving') : $t('common.save') }}
            </button>
          </div>
        </form>
      </div>
    </Modal>

    <!-- Delete Confirmation Modal -->
    <Modal
      v-if="showDeleteModal"
      @close="showDeleteModal = false"
    >
      <div class="p-6">
        <div class="flex items-center mb-4">
          <Icon name="mdi:alert-circle" class="text-4xl text-red-600 mr-3" />
          <h3 class="text-2xl font-semibold text-gray-900">
            {{ $t('admin.deletePOI') }}
          </h3>
        </div>

        <p class="text-gray-600 mb-6">
          {{ $t('admin.deletePOIConfirm', { name: poiToDelete?.name }) }}
        </p>

        <div class="flex justify-end space-x-4">
          <button
            @click="showDeleteModal = false"
            class="btn btn-secondary"
            :disabled="poiDeleting"
          >
            {{ $t('common.cancel') }}
          </button>
          <button
            @click="handleDeletePOI"
            class="btn btn-danger"
            :disabled="poiDeleting"
          >
            <Icon
              v-if="poiDeleting"
              name="mdi:loading"
              class="animate-spin mr-2"
            />
            {{ poiDeleting ? $t('common.deleting') : $t('common.delete') }}
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { usePlacesStore } from '~/stores/places'

interface POI {
  id: number
  name: string
  description: string
  photos: string[]
  audioGuide: string | null
  placeId: number
  createdAt: string
  updatedAt: string
}

const props = defineProps<{
  placeId: number
  pois: POI[]
}>()

const placesStore = usePlacesStore()

const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const poiSaving = ref(false)
const poiDeleting = ref(false)
const poiError = ref('')

const poiForm = ref({
  name: '',
  description: '',
  photos: [] as string[],
  audioGuide: ''
})

const photosText = ref('')
const editingPOI = ref(null as POI | null)
const poiToDelete = ref(null as POI | null)

const editPOI = (poi: POI) => {
  editingPOI.value = poi
  poiForm.value = {
    name: poi.name,
    description: poi.description,
    photos: poi.photos || [],
    audioGuide: poi.audioGuide || ''
  }
  photosText.value = poi.photos?.join('\n') || ''
  showEditModal.value = true
}

const confirmDeletePOI = (poi: POI) => {
  poiToDelete.value = poi
  showDeleteModal.value = true
}

const closeModals = () => {
  showCreateModal.value = false
  showEditModal.value = false
  poiError.value = ''
  poiForm.value = {
    name: '',
    description: '',
    photos: [],
    audioGuide: ''
  }
  photosText.value = ''
  editingPOI.value = null
}

const handleSubmitPOI = async () => {
  poiSaving.value = true
  poiError.value = ''

  try {
    // Parse photos
    const photos = photosText.value
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)

    const data = {
      name: poiForm.value.name,
      description: poiForm.value.description,
      photos,
      audioGuide: poiForm.value.audioGuide || undefined
    }

    if (showEditModal.value && editingPOI.value) {
      // Update existing POI
      await placesStore.updatePOI(props.placeId, editingPOI.value.id, {
        ...data,
        audioGuide: data.audioGuide || null
      })
    } else {
      // Create new POI
      await placesStore.createPOI(props.placeId, data)
    }

    closeModals()
  } catch (err: any) {
    poiError.value = err.message || 'Failed to save POI'
  } finally {
    poiSaving.value = false
  }
}

const handleDeletePOI = async () => {
  if (!poiToDelete.value) return

  poiDeleting.value = true

  try {
    await placesStore.deletePOI(props.placeId, poiToDelete.value.id)
    showDeleteModal.value = false
    poiToDelete.value = null
  } catch (err: any) {
    console.error('Delete POI error:', err)
  } finally {
    poiDeleting.value = false
  }
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString()
}
</script>
