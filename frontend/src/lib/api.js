import { supabase } from './supabase'

const BASE = '/api'

let cachedToken = null
let tokenExpiry = 0

async function getAuthHeaders() {
  const headers = { 'Content-Type': 'application/json' }

  const now = Date.now()
  if (cachedToken && now < tokenExpiry) {
    if (cachedToken) headers['Authorization'] = `Bearer ${cachedToken}`
    return headers
  }

  const { data: { session } } = await supabase.auth.getSession()
  if (session?.access_token) {
    cachedToken = session.access_token
    tokenExpiry = (session.expires_at || 0) * 1000 - 60000
    headers['Authorization'] = `Bearer ${session.access_token}`
  } else {
    cachedToken = null
    tokenExpiry = 0
  }
  return headers
}

supabase.auth.onAuthStateChange((_event, session) => {
  if (session?.access_token) {
    cachedToken = session.access_token
    tokenExpiry = (session.expires_at || 0) * 1000 - 60000
  } else {
    cachedToken = null
    tokenExpiry = 0
  }
})

async function request(url, options = {}) {
  const headers = await getAuthHeaders()
  const res = await fetch(`${BASE}${url}`, {
    ...options,
    headers: { ...headers, ...options.headers },
  })
  const json = await res.json()
  if (!json.success) throw new Error(json.error || 'Terjadi kesalahan')
  return json.data
}

export const getProducts = (params = {}) => {
  const query = new URLSearchParams()
  if (params.category) query.set('category', params.category)
  if (params.search) query.set('search', params.search)
  if (params.badge) query.set('badge', params.badge)
  if (params.limit) query.set('limit', params.limit)
  if (params.offset) query.set('offset', params.offset)
  const qs = query.toString()
  return request(`/products${qs ? '?' + qs : ''}`)
}

export const getProduct = (id) => request(`/products/${id}`)

export const createProduct = (data) => request('/products', {
  method: 'POST',
  body: JSON.stringify(data),
})

export const updateProduct = (id, data) => request(`/products/${id}`, {
  method: 'PUT',
  body: JSON.stringify(data),
})

export const deleteProduct = (id) => request(`/products/${id}`, {
  method: 'DELETE',
})

export const getCategories = () => request('/categories')

export const createCategory = (data) => request('/categories', {
  method: 'POST',
  body: JSON.stringify(data),
})

export const getProfile = (id) => request(`/profiles/${id}`)

export const updateProfile = (id, data) => request(`/profiles/${id}`, {
  method: 'PUT',
  body: JSON.stringify(data),
})

export const getCart = (userId) => request(`/cart/${userId}`)

export const addToCart = (data) => request('/cart', {
  method: 'POST',
  body: JSON.stringify(data),
})

export const updateCartItem = (id, quantity) => request(`/cart/${id}`, {
  method: 'PUT',
  body: JSON.stringify({ quantity }),
})

export const removeCartItem = (id) => request(`/cart/${id}`, {
  method: 'DELETE',
})

export const createOrder = (data) => request('/orders', {
  method: 'POST',
  body: JSON.stringify(data),
})

export const getUserOrders = (userId) => request(`/orders/user/${userId}`)

export const getOrderDetail = (id) => request(`/orders/${id}`)

export const updateOrderStatus = (id, status) => request(`/orders/${id}/status`, {
  method: 'PUT',
  body: JSON.stringify({ status }),
})

export const getAuctions = (status) => {
  const qs = status ? `?status=${status}` : ''
  return request(`/auctions${qs}`)
}

export const getAuctionDetail = (id) => request(`/auctions/${id}`)

export const placeBid = (auctionId, data) => request(`/auctions/${auctionId}/bids`, {
  method: 'POST',
  body: JSON.stringify(data),
})

export const getAuctionBids = (auctionId) => request(`/auctions/${auctionId}/bids`)
