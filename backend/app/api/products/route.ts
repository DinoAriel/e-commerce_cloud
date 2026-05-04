import { type NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { successResponse, errorResponse, optionsResponse } from '@/lib/helpers/response'
import type { CreateProductInput } from '@/types/product'

/**
 * GET /api/products
 * Mengambil semua produk. Support query params:
 * - ?category=<slug>    → filter by category slug
 * - ?search=<keyword>   → search by name/species
 * - ?badge=<badge>      → filter by badge (Hot, Rare, dll)
 * - ?is_active=true     → filter produk aktif saja
 * - ?limit=<n>          → limit jumlah hasil
 * - ?offset=<n>         → offset untuk pagination
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const badge = searchParams.get('badge')
    const isActive = searchParams.get('is_active')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabaseAdmin
      .from('products')
      .select('*, categories(id, name, slug)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Filter: hanya produk aktif (default)
    if (isActive !== 'false') {
      query = query.eq('is_active', true)
    }

    // Filter: by category slug (join)
    if (category) {
      query = query.eq('categories.slug', category)
    }

    // Filter: by badge
    if (badge) {
      query = query.eq('badge', badge)
    }

    // Search: by name or species
    if (search) {
      query = query.or(`name.ilike.%${search}%,species.ilike.%${search}%`)
    }

    const { data, error, count } = await query

    if (error) {
      return errorResponse(error.message, 500)
    }

    return successResponse({
      products: data,
      total: count,
      limit,
      offset,
    })
  } catch (err) {
    return errorResponse('Internal server error', 500)
  }
}

/**
 * POST /api/products
 * Membuat produk baru
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateProductInput = await request.json()

    // Validasi input wajib
    if (!body.name || !body.species || !body.price || !body.description || !body.image_url) {
      return errorResponse('Fields name, species, price, description, dan image_url wajib diisi')
    }

    if (body.price <= 0) {
      return errorResponse('Price harus lebih dari 0')
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .insert({
        name: body.name,
        species: body.species,
        price: body.price,
        description: body.description,
        image_url: body.image_url,
        badge: body.badge || null,
        category_id: body.category_id || null,
        stock: body.stock ?? 0,
        is_active: body.is_active ?? true,
      })
      .select()
      .single()

    if (error) {
      return errorResponse(error.message, 500)
    }

    return successResponse(data, 201)
  } catch (err) {
    return errorResponse('Internal server error', 500)
  }
}

/**
 * OPTIONS /api/products — CORS preflight
 */
export async function OPTIONS() {
  return optionsResponse()
}
