/**
 * Standard API Response format.
 * Semua endpoint menggunakan format yang konsisten:
 * { success: boolean, data?: T, error?: string, message?: string }
 */

// CORS headers yang diizinkan untuk frontend React
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

/**
 * Mengirim response sukses
 */
export function successResponse<T>(data: T, status: number = 200) {
  return Response.json(
    { success: true, data },
    { status, headers: corsHeaders }
  )
}

/**
 * Mengirim response error
 */
export function errorResponse(message: string, status: number = 400) {
  return Response.json(
    { success: false, error: message },
    { status, headers: corsHeaders }
  )
}

/**
 * Mengirim response untuk preflight OPTIONS request (CORS)
 */
export function optionsResponse() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  })
}
