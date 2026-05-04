import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './cartSlice'

const CART_KEY = 'aquamarket_cart'

const loadCart = () => {
  try {
    const saved = localStorage.getItem(CART_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

const saveCart = (items) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  } catch {}
}

const store = configureStore({
  reducer: {
    cart: cartReducer
  },
  preloadedState: {
    cart: { items: loadCart() }
  }
})

store.subscribe(() => {
  saveCart(store.getState().cart.items)
})

export default store
