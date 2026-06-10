const BASE = import.meta.env.VITE_API_BASE_URL || '/api'

async function getAuthHeaders() {
  const headers = { 'Content-Type': 'application/json' }
  const token = localStorage.getItem('access_token')
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

async function request(url, options = {}) {
  const headers = await getAuthHeaders()
  
  console.log(`[Cek Request ${url}] Headers yang dikirim:`, headers) 
  
  const res = await fetch(`${BASE}${url}`, {
    ...options,
    headers: { ...headers, ...options.headers },
  })
  
  const json = await res.json()
  
  if (!res.ok) {
    console.error(`[Error API ${url}] Status:`, res.status, 'Response:', json);
  }

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

export const getOrders = () => request('/orders')

export const getOrdersWithRatings = () => request('/orders')


export const getUserOrders = (userId) => request(`/orders/user/${userId}`)
export const getOrderDetail = (id) => request(`/orders/${id}`)
export const updateOrderStatus = (id, status) => request(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) })
export const cancelOrder = (id) => request(`/orders/${id}/cancel`, { method: 'PUT' })
export const rateOrder = (id, rating, review) => request(`/orders/${id}/rate`, { method: 'PUT', body: JSON.stringify({ rating, review }) })

// Chat API
export const getChats = () => request('/chats')
export const getChatMessages = (id) => request(`/chats/${id}/messages`)
export const initChat = () => request('/chats/init', { method: 'POST' })
export const getSessionToken = () => {
  return localStorage.getItem('access_token')
}


export const getAuctions = (status) => {
  const qs = status ? `?status=${status}` : ''
  return request(`/auctions${qs}`)
}

export const createAuction = (data) => request('/auctions', {
  method: 'POST',
  body: JSON.stringify(data),
})

export const getAuctionDetail = (id) => request(`/auctions/${id}`)

export const placeBid = (auctionId, data) => request(`/auctions/${auctionId}/bids`, {
  method: 'POST',
  body: JSON.stringify(data),
})

export const getAuctionBids = (auctionId) => request(`/auctions/${auctionId}/bids`)

export const uploadImage = async (file) => {
  const formData = new FormData()
  formData.append('image', file)

  const headers = await getAuthHeaders()
  // Remove Content-Type so browser sets it automatically with boundary for multipart/form-data
  delete headers['Content-Type']

  const res = await fetch(`${BASE}/upload`, {
    method: 'POST',
    headers,
    body: formData,
  })

  const json = await res.json()
  if (!res.ok || !json.success) throw new Error(json.error || 'Gagal mengunggah gambar')
  return json.data
}

export const loginUser = (data) => request('/auth/login', {
  method: 'POST',
  body: JSON.stringify(data),
})

export const registerUser = (data) => request('/auth/register', {
  method: 'POST',
  body: JSON.stringify(data),
})

// Addresses
export const getUserAddresses = (userId) => request(`/addresses/user/${userId}`)

export const createAddress = (data) => request('/addresses', {
  method: 'POST',
  body: JSON.stringify(data),
})

export const updateAddress = (id, data) => request(`/addresses/${id}`, {
  method: 'PUT',
  body: JSON.stringify(data),
})

export const deleteAddress = (id) => request(`/addresses/${id}`, {
  method: 'DELETE',
})
