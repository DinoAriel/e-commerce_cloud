import { type NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { successResponse, errorResponse, optionsResponse } from '@/lib/helpers/response'
import type { UpdateProductInput } from '@/types/product'

/**
 * GET /api/products/[id]
 * Mengambil detail satu produk berdasarkan ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*, categories(id, name, slug)')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return errorResponse('Produk tidak ditemukan', 404)
      }
      return errorResponse(error.message, 500)
    }

    return successResponse(data)
  } catch (err) {
    return errorResponse('Internal server error', 500)
  }
}

/**
 * PUT /api/products/[id]
 * Update satu produk berdasarkan ID
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body: UpdateProductInput = await request.json()

    // Buat object update hanya untuk field yang dikirim
    const updateData: Record<string, unknown> = {}
    if (body.name !== undefined) updateData.name = body.name
    if (body.species !== undefined) updateData.species = body.species
    if (body.price !== undefined) updateData.price = body.price
    if (body.description !== undefined) updateData.description = body.description
    if (body.image_url !== undefined) updateData.image_url = body.image_url
    if (body.badge !== undefined) updateData.badge = body.badge
    if (body.category_id !== undefined) updateData.category_id = body.category_id
    if (body.stock !== undefined) updateData.stock = body.stock
    if (body.is_active !== undefined) updateData.is_active = body.is_active

    if (Object.keys(updateData).length === 0) {
      return errorResponse('Tidak ada field yang di-update')
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return errorResponse('Produk tidak ditemukan', 404)
      }
      return errorResponse(error.message, 500)
    }

    return successResponse(data)
  } catch (err) {
    return errorResponse('Internal server error', 500)
  }
}

/**
 * DELETE /api/products/[id]
 * Hapus satu produk berdasarkan ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      return errorResponse(error.message, 500)
    }

    return successResponse({ message: 'Produk berhasil dihapus' })
  } catch (err) {
    return errorResponse('Internal server error', 500)
  }
}

/**
 * OPTIONS /api/products/[id] — CORS preflight
 */
export async function OPTIONS() {
  return optionsResponse()
}
