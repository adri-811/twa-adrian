<script setup>
import { ref, computed } from 'vue'
import { search, byCategory, categories } from './catalog.js'

const status = ref('loading')
const error = ref(null)
const items = ref([])
const query = ref('')
const category = ref('')
const sortDir = ref('desc')
const selectedId = ref(null)

async function load() {
  try {
    const res = await fetch('/items.json')
    if (!res.ok) throw new Error(`Server error: ${res.status}`)
    items.value = await res.json()
    status.value = 'ready'
  } catch (err) {
    status.value = 'error'
    error.value = err.message
  }
}

const cats = computed(() => categories(items.value))

const visible = computed(() => {
  let list = [...items.value]
  if (category.value) list = byCategory(list, category.value)
  if (query.value) list = search(list, query.value)
  
  if (sortDir.value === 'desc') {
    return list.toSorted((a, b) => b.price - a.price)
  }
  return list.toSorted((a, b) => a.price - b.price)
})

const selected = computed(() => items.value.find(i => i.id === selectedId.value))

load()
</script>

<template>
  <header>
    <h1>Flight radar</h1>
    <input type="text" v-model="query" placeholder="Buscar...">
    
    <select v-model="category">
      <option value="">All categories</option>
      <option v-for="c in cats" :key="c" :value="c">{{ c }}</option>
    </select>
    
    <button @click="sortDir = sortDir === 'desc' ? 'asc' : 'desc'">
      Sort: {{ sortDir }}
    </button>
  </header>

  <p v-if="status === 'loading'">Loading...</p>
  <p v-else-if="status === 'error'">Error: {{ error }}</p>
  
  <div v-else>
    <p>{{ visible.length }} items</p>
    
    <ul>
      <li 
        v-for="item in visible" 
        :key="item.id"
        :class="{ selected: item.id === selectedId }"
        @click="selectedId = item.id"
      >
        {{ item.name }} - {{ item.price.toFixed(2) }} €
      </li>
    </ul>

    <section v-if="selected" class="detail-box">
      <h2>{{ selected.name }}</h2>
      <p>Price: {{ selected.price.toFixed(2) }} €</p>
      <p>Category: {{ selected.category }}</p>
      <p>Tags: {{ selected.tags.join(', ') }}</p>
      <p>Airline: {{ selected.airline.name }}</p>
    </section>
  </div>
</template>

<style scoped>
.selected {
  font-weight: bold;
  background-color: #f0f0f0;
}
li {
  cursor: pointer;
  margin-bottom: 5px;
}
.detail-box {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #ccc;
}
</style>