<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import SearchBar from './components/SearchBar.vue'
import RecipeList from './components/RecipeList.vue'
import RecipeDetail from './components/RecipeDetail.vue'
import AdminForm from './components/AdminForm.vue'

const currentTab = ref('search') // 'search' or 'admin'
const recipes = ref([])
const selectedRecipe = ref(null)
const selectedTags = ref([])

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api'

const fetchRecipes = async () => {
  try {
    const res = await axios.get(`${API_BASE}/recipes`)
    recipes.value = res.data
  } catch (error) {
    console.error('Failed to fetch recipes:', error)
  }
}

const filteredRecipes = computed(() => {
  if (selectedTags.value.length === 0) return recipes.value
  return recipes.value.filter(recipe => {
    return selectedTags.value.every(tag => recipe.tags.includes(tag))
  })
})

const allTags = computed(() => {
  const tags = new Set()
  recipes.value.forEach(r => r.tags.forEach(t => tags.add(t)))
  return Array.from(tags)
})

const selectRecipe = (recipe) => {
  selectedRecipe.value = recipe
}

const addTagFilter = (tag) => {
  if (!selectedTags.value.includes(tag)) {
    selectedTags.value.push(tag)
  }
}

const removeTagFilter = (tag) => {
  selectedTags.value = selectedTags.value.filter(t => t !== tag)
}

onMounted(fetchRecipes)
</script>

<template>
  <div class="h-screen w-screen flex bg-gray-50 overflow-hidden">
    <!-- Left Sidebar: Navigation -->
    <nav class="w-20 bg-white shadow-md flex flex-col items-center py-6 z-20 gap-6 flex-shrink-0">
      <div class="mb-2">
        <!-- Logo or App Icon placeholder -->
        <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
          <span class="text-white font-bold text-xl">食</span>
        </div>
      </div>
      
      <button 
        @click="currentTab = 'search'"
        :class="['w-12 h-12 rounded-xl flex flex-col items-center justify-center transition-all duration-200', 
          currentTab === 'search' ? 'bg-blue-50 text-blue-600 shadow-sm ring-1 ring-blue-100' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600']"
        title="查询模式"
      >
        <svg class="w-6 h-6 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span class="text-[10px] font-medium">查询</span>
      </button>

      <button 
        @click="currentTab = 'admin'"
        :class="['w-12 h-12 rounded-xl flex flex-col items-center justify-center transition-all duration-200', 
          currentTab === 'admin' ? 'bg-blue-50 text-blue-600 shadow-sm ring-1 ring-blue-100' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600']"
        title="管理模式"
      >
        <svg class="w-6 h-6 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span class="text-[10px] font-medium">管理</span>
      </button>
    </nav>

    <!-- Main Content Area -->
    <main class="flex-1 overflow-hidden p-4">
      <div class="h-full w-full max-w-[1600px] mx-auto grid grid-cols-12 gap-4">
        
        <!-- Search Mode Layout -->
        <template v-if="currentTab === 'search'">
          <!-- Left Sidebar: Search & List (3 cols) -->
          <div class="col-span-12 md:col-span-4 lg:col-span-3 flex flex-col h-full overflow-hidden gap-3">
            <div class="flex-shrink-0 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
              <SearchBar 
                :all-tags="allTags" 
                :selected-tags="selectedTags"
                @add-tag="addTagFilter"
                @remove-tag="removeTagFilter"
              />
            </div>
            <div class="flex-1 overflow-y-auto min-h-0 pr-1 -mr-1">
              <RecipeList 
                :recipes="filteredRecipes" 
                :selected-id="selectedRecipe?.id"
                @select="selectRecipe" 
              />
            </div>
          </div>

          <!-- Right Content: Detail (9 cols) -->
          <div class="col-span-12 md:col-span-8 lg:col-span-9 bg-white rounded-xl shadow-sm border border-gray-100 h-full overflow-hidden">
            <RecipeDetail 
              :recipe="selectedRecipe" 
              @tag-click="addTagFilter"
            />
          </div>
        </template>

        <!-- Admin Mode Layout -->
        <template v-else>
          <div class="col-span-12 bg-white rounded-lg shadow h-full overflow-y-auto p-6">
            <AdminForm 
              :all-tags="allTags" 
              :recipes="recipes"
              @refresh="fetchRecipes" 
            />
          </div>
        </template>

      </div>
    </main>
  </div>
</template>
