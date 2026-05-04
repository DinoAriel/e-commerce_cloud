import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/cartSlice'
import { products } from '../data/products'

export default function ProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const product = products.find(p => p.id === parseInt(id))

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold text-dark mb-4">Produk Tidak Ditemukan</h1>
        <button
          onClick={() => navigate('/')}
          className="text-primary hover:underline flex items-center gap-2"
        >
          <span>←</span> Kembali ke Beranda
        </button>
      </div>
    )
  }

  const formattedPrice = product.price >= 1000000
    ? (product.price / 1000000).toFixed(1) + 'jt'
    : product.price.toLocaleString('id-ID')

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-8 md:px-20">
      <button
        onClick={() => navigate(-1)}
        className="mb-8 text-gray-500 hover:text-primary transition-colors flex items-center gap-2 font-medium"
      >
        <span>←</span> Kembali
      </button>

      <div className="bg-white rounded-[2rem] shadow-sm border border-primary-border overflow-hidden flex flex-col md:flex-row">

        {/* Gambar Produk */}
        <div className="md:w-1/2 p-8 flex items-center justify-center bg-gradient-to-br from-primary-lighter to-white relative">
          <div className="absolute inset-0 bg-primary/5 pattern-dots pattern-primary/20 pattern-size-4 opacity-50"></div>
          {product.badge && (
            <span className="absolute top-8 left-8 bg-primary-dark text-white text-xs uppercase font-bold tracking-wider px-4 py-1.5 rounded-full shadow-lg z-10">
              {product.badge}
            </span>
          )}
          <img
            src={product.image || '/images/placeholder.avif'}
            alt={product.name}
            className="w-full max-w-md aspect-square object-cover rounded-3xl shadow-2xl relative z-10 border-4 border-white"
          />
        </div>

        {/* Info Produk */}
        <div className="md:w-1/2 p-10 md:p-14 flex flex-col justify-center">
          <div className="mb-2">
            <span className="text-primary text-sm font-bold tracking-wider uppercase bg-primary-lighter px-3 py-1 rounded-full">
              Kategori Terkait
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-dark mt-4 leading-tight">{product.name}</h1>
          <p className="text-gray-400 text-lg mt-2 italic font-serif">"{product.species}"</p>

          <div className="text-3xl font-bold text-dark mt-8 border-b border-gray-100 pb-8">
            Rp {formattedPrice}
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-dark mb-3">Deskripsi</h3>
            <p className="text-gray-600 leading-relaxed">
              {product.description || 'Tidak ada deskripsi tersedia untuk ikan ini. Namun dapat dipastikan ikan dalam kondisi sehat dan rawatan optimal.'}
            </p>
          </div>

          <div className="mt-8">
            <div className="flex items-center gap-4 text-sm text-gray-500 bg-gray-50 p-4 rounded-xl mb-8">
              <div className="flex items-center gap-2">
                <span className="text-primary text-lg">🛡️</span> Garansi DOA 100%
              </div>
              <div className="mx-2 w-1 h-1 bg-gray-300 rounded-full"></div>
              <div className="flex items-center gap-2">
                <span className="text-primary text-lg">📦</span> Pengiriman Aman
              </div>
            </div>
          </div>

          <button
            onClick={() => dispatch(addToCart(product))}
            className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] transition-all duration-200 text-lg flex items-center justify-center gap-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Tambah ke Keranjang
          </button>
        </div>
      </div>
    </div>
  )
}