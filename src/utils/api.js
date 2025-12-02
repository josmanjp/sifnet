const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3006';  

export async function sendOrderWhatsApp(cart, total){
    const items = cart.map(i=> `${i.title} (x${i.quantity||1})`).join(', ')
    const text = encodeURIComponent(`Hola! Quiero comprar: ${items}. Total: $${total}`)
    const url = `https://wa.me/5491123558308?text=${text}`
    window.open(url, '_blank')
    return { ok: true }
}


export async function fetchProducts() {
  const res = await fetch(`${API_URL}/products/list`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('sifnet_token') || ''}`,
    },
  });

  if (res.status === 401 || res.status === 403) {
      window.location.href = '/'; // Redirección al login
      return; // Detiene la ejecución
  }

  if (!res.ok) throw new Error("Error al cargar productos");
  const data = await res.json();
  
  return data.products ||  [];
}



//categories api

export async function fetchCategories() {
  const res = await fetch(`${API_URL}/categories/list`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('sifnet_token') || ''}`,
    },
  });
  
  if (res.status === 401 || res.status === 403) {
      window.location.href = '/'; // Redirección al login
      return; // Detiene la ejecución
  }
  if (!res.ok) throw new Error("Error al cargar categorías");
  const data = await res.json();
  
  return data.categories || [];
}

export async function updateCategory(categoryId, categoryData) {
  
  const res = await fetch(`${API_URL}/categories/update/${categoryId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('sifnet_token') || ''}`,
    },
    body: categoryData, // categoryData ya es FormData
  });
  
  if (!res.ok) {
    throw new Error("Error al actualizar categoría");
  }
  
  const data = await res.json();
  return data;
}   

export async function createCategory(categoryData) {
  const res = await fetch(`${API_URL}/categories/register`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('sifnet_token') || ''}`,
      // No agregar Content-Type para FormData, el browser lo establece automáticamente
    },
    body: categoryData, // categoryData ya es FormData
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error('Error response:', errorText);
    throw new Error(`Error al crear categoría: ${res.status} ${res.statusText}`);
  }
  
  const data = await res.json();
  return data;  


}

export async function deleteCategory(categoryId) {
  const res = await fetch(`${API_URL}/categories/delete/${categoryId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('sifnet_token') || ''}`,
    },
  });
  
  if (!res.ok) {
    throw new Error("Error al eliminar categoría");
  }
  
  const data = await res.json();
  return data;  
}

// Products API
export async function createProduct(productData) {
  
  const res = await fetch(`${API_URL}/products/register`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('sifnet_token') || ''}`,
    },
    body: productData, // productData es FormData
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error('Error response:', errorText);
    throw new Error(`Error al crear producto: ${res.status} ${res.statusText}`);
  }
  
  const data = await res.json();
  return data;  
}

export async function updateProduct(productId, productData) {
  
  const res = await fetch(`${API_URL}/products/update/${productId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('sifnet_token') || ''}`,
    },
    body: productData, // productData es FormData
  });
  
  if (!res.ok) {
    throw new Error("Error al actualizar producto");
  }
  
  const data = await res.json();
  return data;
}

export async function deleteProduct(productId) {
  const res = await fetch(`${API_URL}/products/delete/${productId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('sifnet_token') || ''}`,
    },
  });
  
  if (!res.ok) {
    throw new Error("Error al eliminar producto");
  }
  
  const data = await res.json();
  return data;  
}

export async function sendOrderToAPI(order){ return Promise.resolve({ok:true, id: Math.floor(Math.random()*100000)}) }