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
      class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center"
      @click="handleBackdropClick"
    >
      <div class="relative max-w-[95vw] max-h-[95vh]">
        <button
          class="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors p-2"
          @click="handleClose"
          title="关闭 (按 ESC)"
        >
          <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <img
          :src="imageUrl"
          class="max-w-[95vw] max-h-[95vh] object-contain rounded-lg shadow-2xl"
          alt="放大图片"
        >
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
