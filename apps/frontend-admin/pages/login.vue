<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-admin-600 to-admin-800 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <div class="bg-white rounded-lg shadow-xl p-8">
        <!-- Logo and title -->
        <div class="text-center mb-8">
          <Icon name="mdi:shield-account" class="text-6xl text-admin-600 mx-auto mb-4" />
          <h2 class="text-3xl font-bold text-gray-900">
            {{ $t('admin.title') }}
          </h2>
          <p class="mt-2 text-sm text-gray-600">
            {{ $t('admin.loginSubtitle') }}
          </p>
        </div>

        <!-- Error message -->
        <div
          v-if="authStore.error"
          class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded"
        >
          {{ authStore.error }}
        </div>

        <!-- Login form -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              {{ $t('auth.email') }}
            </label>
            <input
              id="email"
              v-model="credentials.email"
              type="email"
              required
              autocomplete="email"
              class="input"
              :placeholder="$t('auth.emailPlaceholder')"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
              {{ $t('auth.password') }}
            </label>
            <input
              id="password"
              v-model="credentials.password"
              type="password"
              required
              autocomplete="current-password"
              class="input"
              :placeholder="$t('auth.passwordPlaceholder')"
            />
          </div>

          <button
            type="submit"
            class="w-full btn btn-primary"
            :disabled="authStore.loading"
          >
            <Icon
              v-if="authStore.loading"
              name="mdi:loading"
              class="animate-spin mr-2"
            />
            {{ authStore.loading ? $t('auth.loggingIn') : $t('auth.login') }}
          </button>
        </form>

        <!-- Language selector -->
        <div class="mt-6 text-center">
          <select
            v-model="locale"
            class="text-sm border border-gray-300 rounded px-3 py-2"
          >
            <option v-for="loc in availableLocales" :key="loc.code" :value="loc.code">
              {{ loc.name }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: false
})

const authStore = useAuthStore()
const { locale, locales } = useI18n()

const availableLocales = computed(() => locales.value)

const credentials = ref({
  email: '',
  password: ''
})

const handleLogin = async () => {
  authStore.clearError()

  const success = await authStore.login(credentials.value)

  if (success) {
    navigateTo('/')
  }
}

// Check if already logged in
onMounted(async () => {
  await authStore.loadFromStorage()
  if (authStore.isAuthenticated) {
    navigateTo('/')
  }
})
</script>
