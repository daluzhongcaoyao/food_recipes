<script setup>
const props = defineProps({
  recipe: { type: Object, default: null }
})

const emit = defineEmits(['tag-click', 'image-click'])

const handleImageClick = () => {
  if (!props.recipe?.image) return
  const imageUrl = props.recipe.image.startsWith('http')
    ? props.recipe.image
    : `http://localhost:3000${props.recipe.image}`
  emit('image-click', imageUrl)
}
</script>

<template>
  <div v-if="recipe" class="h-full flex flex-col p-6">
    <!-- Header: Title -->
    <div class="flex-shrink-0 mb-4">
      <h1 class="text-3xl font-bold text-gray-900 tracking-tight">{{ recipe.title }}</h1>
    </div>

    <!-- Body: Image Container -->
    <!-- Added max-h-[70%] to ensure image doesn't take up too much vertical space -->
    <div class="flex-1 min-h-0 w-full bg-gray-100 rounded-xl overflow-hidden shadow-sm mb-4 relative flex items-center justify-center max-h-[70%]">
      <img
        :src="recipe.image.startsWith('http') ? recipe.image : `http://localhost:3000${recipe.image}`"
        class="max-w-full max-h-full object-contain cursor-pointer hover:opacity-95 transition-opacity"
        :alt="recipe.title"
        @click="handleImageClick"
      >
    </div>

    <!-- Footer: Tags -->
    <div class="flex-shrink-0">
      <div class="flex flex-wrap gap-2">
        <span 
          v-for="tag in recipe.tags" 
          :key="tag"
          class="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:bg-blue-50 hover:text-blue-600 transition-colors"
          @click="emit('tag-click', tag)"
        >
          #{{ tag }}
        </span>
      </div>
    </div>
  </div>
  
  <div v-else class="h-full flex flex-col items-center justify-center text-gray-400 p-8">
    <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-300">
      <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    </div>
    <div class="text-center">
      <p class="text-lg font-medium text-gray-500 mb-1">未选择食谱</p>
      <p class="text-sm">请从左侧列表选择一个食谱，或使用搜索功能筛选</p>
    </div>
  </div>
</template>
