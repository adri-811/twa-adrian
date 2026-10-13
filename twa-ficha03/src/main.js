import { byCategory, search, top, categories } from './catalog.js';

const state = {
  status: 'loading',
  error: null,
  items: [],
  query: '',
  category: '',
  sortDir: 'desc',
  selectedId: null,
};

async function load() {
  try {
    const res = await fetch('/items.json');
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    
    state.items = await res.json();
    state.status = 'ready';
    
    populateCategories();

  } catch (err) {
    state.status = 'error';
    state.error = err.message;
  } finally {
    render();
  }
}

function populateCategories() {
  const select = document.getElementById('category');
  const uniqueCats = categories(state.items);
  
  uniqueCats.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });
}

function setupEvents() {
  const searchInput = document.getElementById('search');
  const catSelect = document.getElementById('category');
  const sortBtn = document.getElementById('sort');

  searchInput.addEventListener('input', (e) => {
    state.query = e.target.value; 
    render(); 
  });

  catSelect.addEventListener('change', (e) => {
    state.category = e.target.value;
    render();
  });

  sortBtn.addEventListener('click', () => {
    state.sortDir = state.sortDir === 'desc' ? 'asc' : 'desc';
    render();
  });
}

function render() {
  const listElement = document.getElementById('list');
  listElement.innerHTML = '';
  
  if (state.status === 'loading') {
    listElement.innerHTML = '<li>Loading flights...</li>';
    return;
  }
  
  if (state.status === 'error') {
    listElement.innerHTML = `<li>Error: ${state.error}</li>`;
    return;
  }

  let filteredItems = [...state.items];

  if (state.category !== '') {
    filteredItems = byCategory(filteredItems, state.category);
  }

  if (state.query !== '') {
    filteredItems = search(filteredItems, state.query);
  }
  if (state.sortDir === 'desc') {
    filteredItems = filteredItems.toSorted((a, b) => b.price - a.price);
  } else {
    filteredItems = filteredItems.toSorted((a, b) => a.price - b.price);
  }

  filteredItems.forEach(flight => {
    const li = document.createElement('li');
    li.textContent = `${flight.name} - ${flight.price} € (${flight.category})`;
    listElement.appendChild(li);
  });
}

setupEvents();
load();