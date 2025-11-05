<template>
  <div
    class="flex flex-col items-center justify-center p-4 rounded-lg"
    :class="earned ? 'bg-gradient-to-br from-yellow-100 to-yellow-50' : 'bg-gray-50 opacity-60'"
  >
    <div
      class="w-20 h-20 mb-3 rounded-full flex items-center justify-center text-4xl"
      :class="earned ? 'bg-yellow-400' : 'bg-gray-300'"
    >
      {{ badge.icon }}
    </div>

    <h4 class="font-semibold text-center mb-1" :class="earned ? 'text-gray-900' : 'text-gray-500'">
      {{ badge.name }}
    </h4>

    <p class="text-xs text-center" :class="earned ? 'text-gray-600' : 'text-gray-400'">
      {{ badge.description }}
    </p>

    <div v-if="earned && badge.earnedAt" class="mt-2 text-xs text-gray-500">
      {{ formatDate(badge.earnedAt) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Badge } from '~/types'

const props = defineProps<{
  badge: Badge
  earned?: boolean
}>()

const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString()
}
</script>
