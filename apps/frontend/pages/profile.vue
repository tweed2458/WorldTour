<template>
  <div class="pb-20 md:pb-8">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <div v-if="userStore.isAuthenticated && user">
        <!-- Profile Header -->
        <div class="card p-6 mb-8">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center">
              <div class="w-16 h-16 rounded-full bg-primary-600 text-white flex items-center justify-center text-2xl font-bold mr-4">
                {{ user.name.charAt(0).toUpperCase() }}
              </div>
              <div>
                <h1 class="text-2xl font-bold">{{ user.name }}</h1>
                <p class="text-gray-600">{{ user.email }}</p>
              </div>
            </div>
            <button @click="userStore.logout" class="btn-outline text-sm">
              {{ $t('profile.logout') }}
            </button>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-2 gap-4">
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <div class="text-3xl font-bold text-primary-600">
                {{ userStore.visitedPlacesCount }}
              </div>
              <div class="text-sm text-gray-600 mt-1">
                {{ $t('profile.visitedPlaces') }}
              </div>
            </div>
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <div class="text-3xl font-bold text-yellow-600">
                {{ userStore.badgesCount }}
              </div>
              <div class="text-sm text-gray-600 mt-1">
                {{ $t('profile.badges') }}
              </div>
            </div>
          </div>
        </div>

        <!-- Interests -->
        <section class="card p-6 mb-8">
          <h2 class="text-xl font-semibold mb-4">{{ $t('profile.myInterests') }}</h2>
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
                @change="updateInterests"
                class="mr-2"
              />
              <span>{{ $t(`tour.interests.${interest}`) }}</span>
            </label>
          </div>
        </section>

        <!-- Badges -->
        <section class="mb-8">
          <h2 class="text-2xl font-bold mb-6">{{ $t('profile.badges') }}</h2>
          <div v-if="user.badges.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <BadgeDisplay
              v-for="badge in user.badges"
              :key="badge.id"
              :badge="badge"
              :earned="true"
            />
          </div>
          <div v-else class="text-center py-8 text-gray-500">
            <Icon name="mdi:medal-outline" class="text-5xl mb-3 text-gray-300" />
            <p>Aucun badge pour le moment</p>
            <p class="text-sm mt-2">Visitez des lieux pour gagner des badges !</p>
          </div>
        </section>

        <!-- Visited Places -->
        <section v-if="visitedPlaces.length > 0">
          <h2 class="text-2xl font-bold mb-6">{{ $t('profile.visitedPlaces') }}</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <PlaceCard
              v-for="place in visitedPlaces"
              :key="place.id"
              :place="place"
            />
          </div>
        </section>
      </div>

      <!-- Not Logged In -->
      <div v-else class="text-center py-12">
        <Icon name="mdi:account-circle-outline" class="text-6xl text-gray-300 mb-4" />
        <h2 class="text-2xl font-bold mb-4">Connectez-vous pour accéder à votre profil</h2>
        <button @click="router.push('/login')" class="btn-primary">
          {{ $t('auth.login') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user'
import { usePlacesStore } from '~/stores/places'
import type { Interest } from '~/types'

const router = useRouter()
const userStore = useUserStore()
const placesStore = usePlacesStore()

const user = computed(() => userStore.user)
const selectedInterests = ref<Interest[]>([])

const availableInterests: Interest[] = ['art', 'history', 'architecture', 'science', 'nature', 'culture']

const visitedPlaces = computed(() => {
  if (!user.value) return []
  return placesStore.places.filter(place =>
    user.value?.visitedPlaces.includes(place.id)
  )
})

const updateInterests = async () => {
  try {
    await userStore.updateInterests(selectedInterests.value)
  } catch (error) {
    console.error('Failed to update interests:', error)
  }
}

watch(user, (newUser) => {
  if (newUser) {
    selectedInterests.value = [...newUser.interests]
  }
}, { immediate: true })
</script>
