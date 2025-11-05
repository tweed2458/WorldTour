<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <Icon name="mdi:earth" class="text-6xl text-primary-600 mb-4" />
        <h1 class="text-3xl font-bold">World Tour</h1>
      </div>

      <div class="card p-8">
        <div class="flex border-b border-gray-200 mb-6">
          <button
            @click="mode = 'login'"
            class="flex-1 pb-3 font-medium transition-colors"
            :class="mode === 'login'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700'"
          >
            {{ $t('auth.login') }}
          </button>
          <button
            @click="mode = 'register'"
            class="flex-1 pb-3 font-medium transition-colors"
            :class="mode === 'register'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700'"
          >
            {{ $t('auth.register') }}
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Name (register only) -->
          <div v-if="mode === 'register'">
            <label class="block text-sm font-medium mb-2">
              {{ $t('auth.name') }}
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              class="input"
              :placeholder="$t('auth.name')"
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium mb-2">
              {{ $t('auth.email') }}
            </label>
            <input
              v-model="form.email"
              type="email"
              required
              class="input"
              :placeholder="$t('auth.email')"
            />
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium mb-2">
              {{ $t('auth.password') }}
            </label>
            <input
              v-model="form.password"
              type="password"
              required
              class="input"
              :placeholder="$t('auth.password')"
            />
          </div>

          <!-- Error Message -->
          <div v-if="error" class="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {{ error }}
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="btn-primary w-full"
            :disabled="loading"
          >
            <Icon v-if="loading" name="mdi:loading" class="animate-spin mr-2" />
            {{ mode === 'login' ? $t('auth.login') : $t('auth.register') }}
          </button>
        </form>

        <!-- Forgot Password (login only) -->
        <div v-if="mode === 'login'" class="mt-4 text-center">
          <button class="text-sm text-primary-600 hover:text-primary-700">
            {{ $t('auth.forgotPassword') }}
          </button>
        </div>

        <!-- Toggle Mode -->
        <div class="mt-6 text-center text-sm text-gray-600">
          <span v-if="mode === 'login'">
            {{ $t('auth.noAccount') }}
            <button @click="mode = 'register'" class="text-primary-600 hover:text-primary-700 font-medium">
              {{ $t('auth.register') }}
            </button>
          </span>
          <span v-else>
            {{ $t('auth.hasAccount') }}
            <button @click="mode = 'login'" class="text-primary-600 hover:text-primary-700 font-medium">
              {{ $t('auth.login') }}
            </button>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user'

definePageMeta({
  layout: false
})

const router = useRouter()
const userStore = useUserStore()

const mode = ref<'login' | 'register'>('login')
const loading = ref(false)
const error = ref('')

const form = ref({
  name: '',
  email: '',
  password: ''
})

const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  try {
    if (mode.value === 'login') {
      await userStore.login(form.value.email, form.value.password)
    } else {
      await userStore.register(form.value.name, form.value.email, form.value.password)
    }

    router.push('/')
  } catch (err: any) {
    error.value = err.message || 'An error occurred'
  } finally {
    loading.value = false
  }
}
</script>
