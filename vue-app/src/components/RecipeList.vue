<script setup>
import RecipeCard from './RecipeCard.vue'

const props = defineProps({
  recipes: { type: Array, default: () => [] },
  selectedId: { type: String, default: null }
})

const emit = defineEmits(['select', 'image-click'])
</script>

<template>
  <div class="h-full">
    <div v-if="recipes.length === 0" class="p-4 text-center text-gray-500 text-sm">
      没有找到食谱
    </div>
    <ul v-else class="flex flex-col gap-3 p-1 pb-4 max-h-[600px] overflow-y-auto">
      <li v-for="recipe in recipes" :key="recipe.id">
        <RecipeCard
          :recipe="recipe"
          :is-selected="selectedId === recipe.id"
          @click="emit('select', $event)"
          @image-click="emit('image-click', $event)"
        />
      </li>
    </ul>
  </div>
</template>
