<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import RecipeCard from './RecipeCard.vue'
import SearchBar from './SearchBar.vue'
import { API_BASE } from '../config/api'

const props = defineProps({
  allTags: { type: Array, default: () => [] },
  recipes: { type: Array, default: () => [] }
})

const selectedTags = ref([])

const emit = defineEmits(['refresh'])

const filteredRecipes = computed(() => {
  if (selectedTags.value.length === 0) return props.recipes
  return props.recipes.filter(recipe => {
    return selectedTags.value.every(tag => recipe.tags.includes(tag))
  })
})

const addTagFilter = (tag) => {
  if (!selectedTags.value.includes(tag)) {
    selectedTags.value.push(tag)
  }
}

const removeTagFilter = (tag) => {
  selectedTags.value = selectedTags.value.filter(t => t !== tag)
}

const title = ref('')
const newTag = ref('')
const tags = ref([])
const file = ref(null)
const previewUrl = ref(null)
const isSubmitting = ref(false)
const editingId = ref(null)

const suggestedTags = computed(() => {
  if (!newTag.value) return []
  return props.allTags.filter(t => 
    t.toLowerCase().includes(newTag.value.toLowerCase()) && 
    !tags.value.includes(t)
  )
})

const handleFileChange = (event) => {
  const selectedFile = event.target.files[0]
  if (selectedFile) {
    file.value = selectedFile
    previewUrl.value = URL.createObjectURL(selectedFile)
  }
}

const addTag = () => {
  if (newTag.value && !tags.value.includes(newTag.value)) {
    tags.value.push(newTag.value)
    newTag.value = ''
  }
}

const removeTag = (tag) => {
  tags.value = tags.value.filter(t => t !== tag)
}

const selectSuggestedTag = (tag) => {
  if (!tags.value.includes(tag)) {
    tags.value.push(tag)
    newTag.value = ''
  }
}

const editRecipe = (recipe) => {
  editingId.value = recipe.id
  title.value = recipe.title
  tags.value = [...recipe.tags]
  previewUrl.value = recipe.image
  file.value = null
}

const cancelEdit = () => {
  editingId.value = null
  title.value = ''
  tags.value = []
  file.value = null
  previewUrl.value = null
  newTag.value = ''
}

const handleSubmit = async () => {
  if (!title.value) {
    alert('请填写标题')
    return
  }
  if (!editingId.value && !file.value) {
    alert('请上传图片')
    return
  }

  const formData = new FormData()
  formData.append('title', title.value)
  formData.append('tags', JSON.stringify(tags.value))
  if (file.value) {
    formData.append('image', file.value)
  }

  isSubmitting.value = true
  try {
    if (editingId.value) {
      await axios.put(`${API_BASE}/recipes/${editingId.value}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    } else {
      await axios.post(`${API_BASE}/recipes`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    }

    cancelEdit()
    emit('refresh')
    alert(editingId.value ? '更新成功！' : '保存成功！')
  } catch (error) {
    console.error(error)
    alert('保存失败')
  } finally {
    isSubmitting.value = false
  }
}

const deleteRecipe = async (id) => {
  if (!confirm('确定要删除这个食谱吗？')) return

  try {
    await axios.delete(`${API_BASE}/recipes/${id}`)
    emit('refresh')
  } catch (error) {
    alert('删除失败')
  }
}
</script>

<template>
  <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 min-h-full">
    <!-- Form Section -->
    <div class="flex flex-col py-8">
      <h2 class="text-2xl font-bold mb-8 text-gray-800 text-center">
        {{ editingId ? '编辑食谱' : '添加新食谱' }}
      </h2>
      
      <div class="space-y-4">
        <!-- Image Upload -->
        <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition-colors"
             @click="$refs.fileInput.click()">
          <input 
            ref="fileInput"
            type="file" 
            accept="image/*" 
            class="hidden" 
            @change="handleFileChange"
          >
          <div v-if="previewUrl" class="relative pt-[56.25%] w-full bg-gray-100 rounded overflow-hidden">
            <img :src="previewUrl" class="absolute top-0 left-0 w-full h-full object-cover">
          </div>
          <div v-else class="py-8 text-gray-500">
            <p>点击上传图片</p>
          </div>
        </div>

        <!-- Title Input -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">食谱名称</label>
          <input 
            v-model="title"
            type="text" 
            class="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none"
          >
        </div>

        <!-- Tag Input -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">标签</label>
          <div class="flex flex-wrap gap-2 mb-2">
            <span 
              v-for="tag in tags" 
              :key="tag"
              class="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full flex items-center"
            >
              {{ tag }}
              <button @click="removeTag(tag)" class="ml-1 text-blue-600 font-bold">&times;</button>
            </span>
          </div>
          <div class="relative">
            <input 
              v-model="newTag"
              type="text" 
              class="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none"
              placeholder="输入标签按回车添加..."
              @keydown.enter.prevent="addTag"
            >
            <!-- Tag Suggestions -->
            <ul v-if="suggestedTags.length > 0" class="absolute z-10 w-full bg-white border rounded-md shadow-lg mt-1 max-h-32 overflow-y-auto">
              <li 
                v-for="tag in suggestedTags" 
                :key="tag"
                class="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                @mousedown.prevent="selectSuggestedTag(tag)"
              >
                {{ tag }}
              </li>
            </ul>
          </div>
        </div>

        <button
          @click="handleSubmit"
          :disabled="isSubmitting"
          class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          {{ isSubmitting ? '保存中...' : (editingId ? '更新食谱' : '保存食谱') }}
        </button>
        <button
          v-if="editingId"
          @click="cancelEdit"
          class="w-full bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition-colors"
        >
          取消编辑
        </button>
      </div>
    </div>

    <!-- Management List Section -->
    <div class="border-t md:border-t-0 md:border-l border-gray-200 pl-0 md:pl-16 py-8 flex flex-col">
      <h2 class="text-2xl font-bold mb-4 text-gray-800 text-center">已有食谱管理</h2>

      <!-- Search Bar -->
      <div class="mb-4">
        <SearchBar
          :all-tags="allTags"
          :selected-tags="selectedTags"
          @add-tag="addTagFilter"
          @remove-tag="removeTagFilter"
        />
      </div>

      <ul class="flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-2">
        <li v-for="recipe in filteredRecipes" :key="recipe.id">
          <RecipeCard
            :recipe="recipe"
            :show-actions="true"
            @edit="editRecipe"
            @delete="deleteRecipe"
          />
        </li>
      </ul>
    </div>
  </div>
</template>
