<script setup>
const props = defineProps({
  recipe: { type: Object, required: true },
  isSelected: { type: Boolean, default: false },
  showActions: { type: Boolean, default: false }
})

const emit = defineEmits(['click', 'image-click', 'edit', 'delete'])

const handleClick = () => {
  emit('click', props.recipe)
}

const handleImageClick = (e) => {
  e.stopPropagation()
  const imageUrl = props.recipe.image.startsWith('http')
    ? props.recipe.image
    : `http://localhost:3000${props.recipe.image}`
  emit('image-click', imageUrl)
}

const handleEdit = (e) => {
  e.stopPropagation()
  emit('edit', props.recipe)
}

const handleDelete = (e) => {
  e.stopPropagation()
  emit('delete', props.recipe.id)
}
</script>

<template>
  <div
    @click="handleClick"
    :class="[
      'p-3 cursor-pointer transition-all duration-200 bg-white rounded-xl shadow-sm border',
      isSelected
        ? 'ring-2 ring-blue-500 ring-offset-2 border-blue-500'
        : 'border-gray-100 hover:border-blue-200 hover:shadow-md'
    ]"
  >
    <div class="flex gap-3 items-center">
      <!-- Image -->
      <div class="w-12 h-12 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
        <img
          v-if="recipe.image"
          :src="recipe.image.startsWith('http') ? recipe.image : `http://localhost:3000${recipe.image}`"
          class="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
          alt=""
          @click="handleImageClick"
        >
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <h3 class="text-sm font-bold text-gray-800 mb-1">{{ recipe.title }}</h3>

        <!-- Tags - 现在支持换行显示 -->
        <div v-if="recipe.tags && recipe.tags.length > 0" class="flex flex-wrap gap-1">
          <span
            v-for="tag in recipe.tags"
            :key="tag"
            class="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded"
          >
            {{ tag }}
          </span>
        </div>
        <p v-else class="text-xs text-gray-400">暂无标签</p>
      </div>

      <!-- Actions (for admin) -->
      <div v-if="showActions" class="flex gap-2 items-center">
        <button
          @click="handleEdit"
          class="text-blue-500 text-sm hover:text-blue-700"
        >
          编辑
        </button>
        <span class="text-gray-300">|</span>
        <button
          @click="handleDelete"
          class="text-red-500 text-sm hover:text-red-700"
        >
          删除
        </button>
      </div>
    </div>
  </div>
</template>
