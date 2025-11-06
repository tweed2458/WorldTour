<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav v-if="authStore.isAuthenticated" class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <NuxtLink to="/" class="flex items-center space-x-2">
              <Icon name="mdi:castle" class="text-3xl text-admin-600" />
              <span class="text-xl font-bold text-gray-900">World Tour Admin</span>
            </NuxtLink>
          </div>

          <div class="flex items-center space-x-4">
            <!-- User info -->
            <div class="flex items-center space-x-2">
              <Icon name="mdi:account-circle" class="text-2xl text-gray-600" />
              <span class="text-sm text-gray-700">{{ authStore.user?.name }}</span>
            </div>

            <!-- Language selector -->
            <select
              v-model="locale"
              @change="changeLocale"
              class="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option v-for="loc in availableLocales" :key="loc.code" :value="loc.code">
                {{ loc.name }}
              </option>
            </select>

            <!-- Logout button -->
            <button
              @click="handleLogout"
              class="btn btn-secondary text-sm"
            >
              <Icon name="mdi:logout" class="mr-1" />
              {{ $t('auth.logout') }}
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main content -->
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const { locale, locales } = useI18n()

const availableLocales = computed(() => locales.value)

const changeLocale = () => {
  // Locale change is handled by v-model
}

const handleLogout = async () => {
  await authStore.logout()
}
</script>
