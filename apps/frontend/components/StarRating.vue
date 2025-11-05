<template>
  <div class="flex items-center">
    <button
      v-for="star in 5"
      :key="star"
      type="button"
      :disabled="readonly"
      @click="!readonly && updateRating(star)"
      class="focus:outline-none transition-transform hover:scale-110"
      :class="{ 'cursor-pointer': !readonly, 'cursor-default': readonly }"
    >
      <Icon
        :name="star <= currentRating ? 'mdi:star' : 'mdi:star-outline'"
        :class="star <= currentRating ? 'star' : 'star-empty'"
        class="text-xl"
      />
    </button>
    <span v-if="showValue" class="ml-2 text-sm font-medium">
      {{ currentRating.toFixed(1) }}
    </span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  rating: number
  readonly?: boolean
  showValue?: boolean
}>()

const emit = defineEmits<{
  'update:rating': [value: number]
}>()

const currentRating = ref(props.rating)

watch(() => props.rating, (newRating) => {
  currentRating.value = newRating
})

const updateRating = (value: number) => {
  currentRating.value = value
  emit('update:rating', value)
}
</script>
