import { useDispatch } from 'react-redux'
import { addToCart as reduxAddToCart } from '../store/cartSlice'
import { useAuth } from './auth'
import { addToCart as apiAddToCart } from '../lib/api'

export function useAddToCart() {
  const dispatch = useDispatch()
  const { user } = useAuth()

  return async (product) => {
    dispatch(reduxAddToCart({ ...product, image: product.image_url }))
    if (user) {
      try {
        await apiAddToCart({ user_id: user.id, product_id: product.id, quantity: 1 })
      } catch (err) {
        console.warn('API cart sync failed, item saved locally:', err.message)
      }
    }
  }
}
