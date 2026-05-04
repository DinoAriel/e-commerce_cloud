import { type NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { successResponse, errorResponse, optionsResponse } from '@/lib/helpers/response'
import type { CreateCategoryInput } from '@/types/category'

/**
 * GET /api/categories
 * Mengambil semua kategori
 */
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('categories')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      return errorResponse(error.message, 500)
    }

    return successResponse(data)
  } catch (err) {
    return errorResponse('Internal server error', 500)
  }
}

/**
 * POST /api/categories
 * Membuat kategori baru
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateCategoryInput = await request.json()

    if (!body.name || !body.slug) {
      return errorResponse('Fields name dan slug wajib diisi')
    }

    const { data, error } = await supabaseAdmin
      .from('categories')
      .insert({
        name: body.name,
        slug: body.slug,
        description: body.description || null,
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return errorResponse('Kategori dengan slug tersebut sudah ada', 409)
      }
      return errorResponse(error.message, 500)
    }

    return successResponse(data, 201)
  } catch (err) {
    return errorResponse('Internal server error', 500)
  }
}

/**
 * OPTIONS /api/categories — CORS preflight
 */
export async function OPTIONS() {
  return optionsResponse()
}
