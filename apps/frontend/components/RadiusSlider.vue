<template>
  <div class="radius-slider w-full max-w-md">
    <label class="block text-sm font-medium mb-3 text-center">
      {{ $t('home.radius') }}
    </label>

    <!-- Slider -->
    <div class="relative px-2">
      <input
        type="range"
        v-model.number="selectedIndex"
        :min="0"
        :max="radiusOptions.length - 1"
        :step="1"
        class="w-full h-2 bg-white/30 rounded-lg appearance-none cursor-pointer slider"
        @input="updateRadius"
      />

      <!-- Value indicators -->
      <div class="flex justify-between mt-2 px-1">
        <button
          v-for="(option, index) in radiusOptions"
          :key="option.value"
          @click="selectRadius(index)"
          class="flex flex-col items-center transition-all duration-200 cursor-pointer group"
          :class="{
            'scale-110': selectedIndex === index
          }"
        >
          <div
            class="w-2 h-2 rounded-full mb-1 transition-all duration-200"
            :class="selectedIndex === index
              ? 'bg-white scale-150 shadow-lg'
              : 'bg-white/40 group-hover:bg-white/60'"
          />
          <span
            class="text-xs transition-all duration-200 whitespace-nowrap"
            :class="selectedIndex === index
              ? 'text-white font-bold'
              : 'text-white/70 group-hover:text-white/90'"
          >
            {{ option.label }}
          </span>
        </button>
      </div>
    </div>

    <!-- Current selection display -->
    <div class="text-center mt-4">
      <p class="text-white/90 text-sm">
        {{ $t('home.withinRadius', { radius: currentRadiusLabel }) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

// Radius options in meters
const radiusOptions = [
  { value: 1000, label: '1km' },
  { value: 5000, label: '5km' },
  { value: 10000, label: '10km' },
  { value: 50000, label: '50km' },
  { value: 100000, label: '100km' },
  { value: 200000, label: '200km' }
]

// Find initial index
const getIndexFromValue = (value: number): number => {
  const index = radiusOptions.findIndex(opt => opt.value === value)
  return index >= 0 ? index : 1 // Default to 5km (index 1)
}

const selectedIndex = ref(getIndexFromValue(props.modelValue))

const currentRadiusLabel = computed(() => {
  return radiusOptions[selectedIndex.value].label
})

const updateRadius = () => {
  const newValue = radiusOptions[selectedIndex.value].value
  emit('update:modelValue', newValue)
}

const selectRadius = (index: number) => {
  selectedIndex.value = index
  updateRadius()
}

// Update if parent changes the value
watch(() => props.modelValue, (newValue) => {
  const newIndex = getIndexFromValue(newValue)
  if (newIndex !== selectedIndex.value) {
    selectedIndex.value = newIndex
  }
})
</script>

<style scoped>
.slider::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.2s;
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.2s;
}

.slider::-moz-range-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.slider::-webkit-slider-runnable-track {
  height: 8px;
  border-radius: 4px;
}

.slider::-moz-range-track {
  height: 8px;
  border-radius: 4px;
}
</style>
