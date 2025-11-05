<template>
  <div class="bg-gray-50 rounded-lg p-4">
    <div class="flex items-center justify-between mb-3">
      <h4 class="font-semibold text-gray-900">{{ $t('place.audioGuide') }}</h4>
      <span class="text-sm text-gray-500">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>
    </div>

    <div class="mb-3">
      <input
        type="range"
        min="0"
        :max="duration"
        v-model="currentTime"
        @input="seek"
        class="w-full"
      />
    </div>

    <div class="flex items-center justify-center gap-4">
      <button
        @click="rewind"
        class="p-2 rounded-full hover:bg-gray-200 transition-colors"
      >
        <Icon name="mdi:rewind-10" class="text-2xl" />
      </button>

      <button
        @click="togglePlay"
        class="p-3 rounded-full bg-primary-600 text-white hover:bg-primary-700 transition-colors"
      >
        <Icon
          :name="isPlaying ? 'mdi:pause' : 'mdi:play'"
          class="text-3xl"
        />
      </button>

      <button
        @click="forward"
        class="p-2 rounded-full hover:bg-gray-200 transition-colors"
      >
        <Icon name="mdi:fast-forward-10" class="text-2xl" />
      </button>
    </div>

    <audio
      ref="audioElement"
      :src="src"
      @timeupdate="updateTime"
      @loadedmetadata="updateDuration"
      @ended="onEnded"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  src: string
}>()

const audioElement = ref<HTMLAudioElement>()
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)

const togglePlay = () => {
  if (!audioElement.value) return

  if (isPlaying.value) {
    audioElement.value.pause()
  } else {
    audioElement.value.play()
  }
  isPlaying.value = !isPlaying.value
}

const seek = (event: Event) => {
  if (!audioElement.value) return
  const target = event.target as HTMLInputElement
  audioElement.value.currentTime = parseFloat(target.value)
}

const rewind = () => {
  if (!audioElement.value) return
  audioElement.value.currentTime = Math.max(0, audioElement.value.currentTime - 10)
}

const forward = () => {
  if (!audioElement.value) return
  audioElement.value.currentTime = Math.min(duration.value, audioElement.value.currentTime + 10)
}

const updateTime = () => {
  if (!audioElement.value) return
  currentTime.value = audioElement.value.currentTime
}

const updateDuration = () => {
  if (!audioElement.value) return
  duration.value = audioElement.value.duration
}

const onEnded = () => {
  isPlaying.value = false
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

onUnmounted(() => {
  if (audioElement.value) {
    audioElement.value.pause()
  }
})
</script>
