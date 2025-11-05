<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm safe-top sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <NuxtLink to="/" class="flex items-center">
            <Icon name="mdi:earth" class="text-3xl text-primary-600 mr-2" />
            <span class="font-bold text-xl hidden sm:inline">World Tour</span>
          </NuxtLink>

          <div class="flex items-center gap-2">
            <LanguageSwitcher />
            <button
              v-if="userStore.isAuthenticated"
              @click="navigateTo('/profile')"
              class="p-2 rounded-full hover:bg-gray-100"
            >
              <Icon name="mdi:account-circle" class="text-2xl text-gray-600" />
            </button>
            <button
              v-else
              @click="navigateTo('/login')"
              class="btn-primary text-sm"
            >
              {{ $t('auth.login') }}
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Bottom Navigation (Mobile) -->
    <nav class="bg-white border-t border-gray-200 safe-bottom md:hidden sticky bottom-0 z-50">
      <div class="flex justify-around items-center py-2">
        <NuxtLink
          to="/"
          class="flex flex-col items-center py-2 px-3 text-gray-600 hover:text-primary-600"
          active-class="text-primary-600"
        >
          <Icon name="mdi:home" class="text-2xl" />
          <span class="text-xs mt-1">{{ $t('nav.home') }}</span>
        </NuxtLink>

        <NuxtLink
          to="/explore"
          class="flex flex-col items-center py-2 px-3 text-gray-600 hover:text-primary-600"
          active-class="text-primary-600"
        >
          <Icon name="mdi:compass" class="text-2xl" />
          <span class="text-xs mt-1">{{ $t('nav.explore') }}</span>
        </NuxtLink>

        <NuxtLink
          to="/tours"
          class="flex flex-col items-center py-2 px-3 text-gray-600 hover:text-primary-600"
          active-class="text-primary-600"
        >
          <Icon name="mdi:map-marker-path" class="text-2xl" />
          <span class="text-xs mt-1">{{ $t('nav.tours') }}</span>
        </NuxtLink>

        <NuxtLink
          to="/profile"
          class="flex flex-col items-center py-2 px-3 text-gray-600 hover:text-primary-600"
          active-class="text-primary-600"
        >
          <Icon name="mdi:account" class="text-2xl" />
          <span class="text-xs mt-1">{{ $t('nav.profile') }}</span>
        </NuxtLink>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()

onMounted(() => {
  userStore.initializeFromStorage()
})
</script>
