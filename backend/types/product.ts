export interface Product {
  id: string
  name: string
  species: string
  price: number
  description: string
  image_url: string
  badge: string | null
  category_id: string | null
  stock: number
  is_active: boolean
  created_at: string
}

export interface CreateProductInput {
  name: string
  species: string
  price: number
  description: string
  image_url: string
  badge?: string | null
  category_id?: string | null
  stock?: number
  is_active?: boolean
}

export interface UpdateProductInput {
  name?: string
  species?: string
  price?: number
  description?: string
  image_url?: string
  badge?: string | null
  category_id?: string | null
  stock?: number
  is_active?: boolean
}
