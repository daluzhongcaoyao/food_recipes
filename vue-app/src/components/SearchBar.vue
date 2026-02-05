<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  allTags: { type: Array, default: () => [] },
  selectedTags: { type: Array, default: () => [] }
})

const emit = defineEmits(['add-tag', 'remove-tag'])

const searchInput = ref('')
const showSuggestions = ref(false)

const suggestions = computed(() => {
  if (!searchInput.value) return []
  return props.allTags.filter(tag => 
    tag.toLowerCase().includes(searchInput.value.toLowerCase()) && 
    !props.selectedTags.includes(tag)
  )
})

const addTag = (tag) => {
  emit('add-tag', tag)
  searchInput.value = ''
  showSuggestions.value = false
}

const handleEnter = () => {
  if (searchInput.value) {
    addTag(searchInput.value)
  }
}
</script>

<template>
  <div class="w-full">
    <!-- Input -->
    <div class="relative group">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg class="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        v-model="searchInput"
        type="text"
        class="w-full pl-9 pr-3 py-2 bg-gray-50 border border-transparent rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all placeholder-gray-400"
        placeholder="搜索标签..."
        @focus="showSuggestions = true"
        @blur="setTimeout(() => showSuggestions = false, 200)"
        @keydown.enter="handleEnter"
      />
      
      <!-- Suggestions -->
      <ul 
        v-if="showSuggestions && suggestions.length > 0"
        class="absolute z-20 w-full bg-white border border-gray-100 rounded-lg shadow-xl mt-2 max-h-48 overflow-y-auto overflow-hidden py-1"
      >
        <li
          v-for="tag in suggestions"
          :key="tag"
          class="px-4 py-2 text-sm hover:bg-blue-50 text-gray-700 hover:text-blue-700 cursor-pointer transition-colors"
          @mousedown.prevent="addTag(tag)"
        >
          {{ tag }}
        </li>
      </ul>
    </div>

    <!-- Selected Tags -->
    <div v-if="selectedTags.length > 0" class="flex flex-wrap gap-1.5 mt-3">
      <span 
        v-for="tag in selectedTags" 
        :key="tag"
        class="bg-blue-50 text-blue-600 border border-blue-100 text-xs px-2.5 py-1 rounded-md flex items-center cursor-pointer hover:bg-blue-100 hover:text-blue-700 hover:border-blue-200 transition-all group"
        @click="emit('remove-tag', tag)"
      >
        {{ tag }}
        <svg class="w-3 h-3 ml-1.5 text-blue-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </span>
    </div>
  </div>
</template>
