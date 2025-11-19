import { api } from './client.js'

export async function fetchProducts({ name='', minPrice='', maxPrice='', page=1, limit=12 } = {}) {
  const params = new URLSearchParams()
  if (name) params.set('name', name)
  if (minPrice !== '') params.set('minPrice', minPrice)
  if (maxPrice !== '') params.set('maxPrice', maxPrice)
  params.set('page', page)
  params.set('limit', limit)
  return api.get(`/api/products?${params.toString()}`)
}

export async function createProduct(data) { return api.post('/products', data) }
export async function updateProduct(id, data) { return api.put(`/products/${id}`, data) }
export async function deleteProduct(id) { return api.delete(`/products/${id}`) }
export async function bulkCreate(products) { return api.post('/products/bulk', products) }
