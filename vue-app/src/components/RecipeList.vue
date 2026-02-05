<script setup>
const props = defineProps({
  recipes: { type: Array, default: () => [] },
  selectedId: { type: String, default: null }
})

const emit = defineEmits(['select'])
</script>

<template>
  <div class="h-full">
    <div v-if="recipes.length === 0" class="p-4 text-center text-gray-500 text-sm">
      没有找到食谱
    </div>
    <ul v-else class="flex flex-col gap-3 p-1 pb-4">
      <li 
        v-for="recipe in recipes" 
        :key="recipe.id"
        @click="emit('select', recipe)"
        :class="['p-3 cursor-pointer transition-all duration-200 flex items-center gap-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md', 
          selectedId === recipe.id ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:border-blue-200']"
      >
        <div class="w-12 h-12 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
          <img 
            v-if="recipe.image" 
            :src="recipe.image.startsWith('http') ? recipe.image : `http://localhost:3000${recipe.image}`" 
            class="w-full h-full object-cover"
            alt=""
          >
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="text-sm font-bold text-gray-800 truncate mb-0.5">{{ recipe.title }}</h3>
          <p class="text-xs text-gray-500 truncate">{{ recipe.tags.join(', ') }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>
