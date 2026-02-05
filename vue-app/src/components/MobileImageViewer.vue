<script setup>
const props = defineProps({
  imageUrl: { type: String, default: null }
})

const emit = defineEmits(['close'])

const handleClose = () => {
  emit('close')
}

const handleBackdropClick = (e) => {
  if (e.target === e.currentTarget) {
    handleClose()
  }
}
</script>

<template>
  <Transition name="fade">
    <div
      v-if="imageUrl"
      class="fixed inset-0 z-50 bg-black flex items-center justify-center"
      @click="handleBackdropClick"
    >
      <div class="relative w-full h-full flex items-center justify-center overflow-hidden">
        <button
          class="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors p-2 z-10 bg-black/30 rounded-full"
          @click="handleClose"
          title="关闭 (按 ESC)"
        >
          <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <img
          :src="imageUrl"
          class="landscape-image cursor-pointer"
          alt="放大图片"
          @click="handleClose"
        >
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.landscape-image {
  position: absolute;
  width: 100vh;
  height: 100vw;
  max-width: 100vh;
  max-height: 100vw;
  object-fit: contain;
  transform: rotate(90deg);
  transform-origin: center center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
