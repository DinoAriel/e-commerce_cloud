import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function CheckoutPage() {
  const items = useSelector(state => state.cart.items)
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.qty), 0)

  const formatPrice = (price) => {
    return price.toLocaleString('id-ID')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      alert("Pembayaran Berhasil! Pesanan Anda sedang diproses.")
      navigate('/')
    }, 1500)
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold text-dark mb-4">Keranjang Kosong</h1>
        <button onClick={() => navigate('/')} className="text-primary hover:underline">Belanja Sekarang</button>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 md:px-12 lg:px-24">
      <h1 className="text-3xl font-bold text-dark mb-8">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Form Pengiriman */}
        <div className="lg:w-2/3">
          <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] p-8 shadow-sm border border-primary-border">
            <h2 className="text-xl font-bold text-dark mb-6 border-b border-gray-100 pb-4">Informasi Pengiriman</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                <input required type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" placeholder="Budi Santoso" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Telepon</label>
                <input required type="tel" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" placeholder="081234567890" />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Lengkap</label>
              <textarea required rows="3" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" placeholder="Jl. Sudirman No. 123..."></textarea>
            </div>

            <h2 className="text-xl font-bold text-dark mb-6 mt-10 border-b border-gray-100 pb-4">Metode Pembayaran</h2>
            <div className="grid grid-cols-1 gap-4">
              <label className="flex items-center gap-4 p-4 border border-primary bg-primary/5 rounded-xl cursor-pointer">
                <input type="radio" name="payment" defaultChecked className="text-primary w-5 h-5" />
                <div>
                  <span className="block font-bold text-dark">Transfer Bank (BCA)</span>
                  <span className="text-sm text-gray-500">Dicek otomatis</span>
                </div>
              </label>
              <label className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-primary-border transition-colors">
                <input type="radio" name="payment" className="text-primary w-5 h-5" />
                <div>
                  <span className="block font-bold text-dark">Virtual Account Bank Lainnya</span>
                </div>
              </label>
            </div>
            
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`mt-10 w-full text-white font-bold py-4 rounded-xl transition-all duration-200 text-lg flex items-center justify-center gap-2 ${isSubmitting ? 'bg-gray-400' : 'bg-primary hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]'}`}
            >
              {isSubmitting ? 'Memproses...' : 'Bayar Sekarang'}
            </button>
          </form>
          <Link 
            to="/cart"
            className="text-gray-500 hover:text-primary font-medium flex items-center gap-2 mt-6 px-2 w-max transition-colors"
          >
            <span>←</span> Kembali ke Keranjang
          </Link>
        </div>

        {/* Ringkasan Belanja */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-primary-border sticky top-24">
            <h2 className="text-xl font-bold text-dark mb-6 border-b border-gray-100 pb-4">Ringkasan Pesanan</h2>
            
            <div className="flex flex-col gap-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
              {items.map(item => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden border border-gray-100 relative">
                    <img src={item.image || '/images/placeholder.avif'} alt={item.name} className="w-full h-full object-cover" />
                    <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {item.qty}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark text-sm leading-tight">{item.name}</h4>
                    <div className="text-primary font-bold text-sm mt-1">Rp {formatPrice(item.price * item.qty)}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-3 border-t border-gray-100 pt-6">
              <div className="flex justify-between text-gray-500 text-sm">
                <span>Subtotal</span>
                <span className="font-medium text-dark">Rp {formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-gray-500 text-sm">
                <span>Ongkos Kirim</span>
                <span className="font-medium text-green-500">Rp 0 (Gratis)</span>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-100">
              <span className="text-lg font-bold text-dark">Total Akhir</span>
              <span className="text-2xl font-bold text-primary">Rp {formatPrice(totalPrice)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}