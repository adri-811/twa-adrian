// Función para filtrar por categoría 

export const byCategory = (list, cat) => list.filter(item => item.category === cat);
// Función para que la búsqueda sea insensible a mayúsculas y minúsculas y busque en el nombre y en las etiquetas
export const search = (list, text) => {
  const lowerText = text.toLowerCase();
  
  return list.filter(item => 
    item.name.toLowerCase().includes(lowerText) || 
    item.tags.some(tag => tag.toLowerCase().includes(lowerText))
  );
};

// funcion para filtrar por precio máximo
export const total = (list) => list.reduce((sum, { price }) => sum + price, 0);

// funcion para devolver los elementos más caros de la lista

export const top = (list, n) => list.toSorted((a, b) => b.price - a.price).slice(0, n);


// devuelve una lista con los nombres de las categorías 
export const categories = (list) => [...new Set(list.map(item => item.category))].sort();

// nuevos elementos con descuento pero sin modificar los originakes 

export const withDiscount = (list, pct) => list.map(item => ({
  ...item,
  price: Number((item.price * (1 - pct / 100)).toFixed(2))
}));