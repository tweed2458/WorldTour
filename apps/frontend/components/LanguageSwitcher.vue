<template>
  <div class="relative">
    <button
      @click="showMenu = !showMenu"
      class="p-2 rounded-full hover:bg-gray-100 flex items-center gap-1"
    >
      <Icon name="mdi:web" class="text-xl text-gray-600" />
      <span class="text-sm font-medium uppercase">{{ locale }}</span>
    </button>

    <div
      v-if="showMenu"
      class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
    >
      <button
        v-for="loc in availableLocales"
        :key="loc.code"
        @click="changeLocale(loc.code)"
        class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
        :class="{ 'bg-primary-50 text-primary-600': locale === loc.code }"
      >
        <span>{{ loc.name }}</span>
        <Icon
          v-if="locale === loc.code"
          name="mdi:check"
          class="text-primary-600"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()
const showMenu = ref(false)

const availableLocales = computed(() => locales.value)

const changeLocale = async (code: string) => {
  await setLocale(code)
  showMenu.value = false
}

// Close menu when clicking outside
onMounted(() => {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.relative')) {
      showMenu.value = false
    }
  })
})
</script>
