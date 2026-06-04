import { useState, useEffect } from 'react'
import { getProducts, getCategories, createProduct, updateProduct, deleteProduct, uploadImage } from '../../lib/api'

export default function AdminStock() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [error, setError] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)


  // Modal controls
  const [showModal, setShowModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState(null)

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    price: '',
    description: '',
    image_url: '',
    badge: '',
    category_id: '',
    stock: '',
    is_active: true
  })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      setLoading(true)
      setError(null)
      const productsData = await getProducts({ limit: 100 })
      const categoriesData = await getCategories()
      
      setProducts(productsData.products || [])
      setCategories(categoriesData || [])
    } catch (err) {
      console.error(err)
      setError(err.message || 'Gagal memuat data dari server')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenAddModal = () => {
    setIsEdit(false)
    setSelectedProductId(null)
    setFormData({
      name: '',
      species: '',
      price: '',
      description: '',
      image_url: '',
      badge: '',
      category_id: categories[0]?.id || '',
      stock: '10',
      is_active: true
    })
    setSelectedFile(null)
    setUseUrl(false)
    setShowModal(true)
  }

  const handleOpenEditModal = (product) => {
    setIsEdit(true)
    setSelectedProductId(product.id)
    setFormData({
      name: product.name || '',
      species: product.species || '',
      price: product.price || '',
      description: product.description || '',
      image_url: product.image_url || '',
      badge: product.badge || '',
      category_id: product.category_id || '',
      stock: product.stock || '0',
      is_active: product.is_active ?? true
    })
    // If the image is a data URI, keep useUrl as false. Otherwise, use true.
    const isBase64 = (product.image_url || '').startsWith('data:')
    setUseUrl(!isBase64 && !!product.image_url)
    setSelectedFile(null)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  const [useUrl, setUseUrl] = useState(false)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setSelectedFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        image_url: reader.result // Temporary Base64 for Preview only
      }))
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccessMsg(null)

    // Validation
    if (!formData.name || !formData.species || !formData.price || !formData.description || (!formData.image_url && !selectedFile)) {
      setError('Harap isi semua kolom wajib!')
      return
    }

    try {
      let finalImageUrl = formData.image_url

      // If user uploaded a physical file, upload to S3 first
      if (!useUrl && selectedFile) {
        const uploadRes = await uploadImage(selectedFile)
        finalImageUrl = uploadRes.image_url
      }

      const payload = {
        name: formData.name,
        species: formData.species,
        price: parseInt(formData.price, 10),
        description: formData.description,
        image_url: finalImageUrl,
        badge: formData.badge || null,
        category_id: formData.category_id || null,
        stock: parseInt(formData.stock, 10) || 0,
        is_active: formData.is_active
      }

      if (isEdit) {
        await updateProduct(selectedProductId, payload)
        setSuccessMsg('Produk berhasil diperbarui!')
      } else {
        await createProduct(payload)
        setSuccessMsg('Produk baru berhasil ditambahkan!')
      }
      setShowModal(false)
      fetchData()
      setTimeout(() => setSuccessMsg(null), 3000)
    } catch (err) {
      setError(err.message || 'Gagal menyimpan produk')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) return

    setError(null)
    setSuccessMsg(null)
    try {
      await deleteProduct(id)
      setSuccessMsg('Produk berhasil dihapus!')
      fetchData()
      setTimeout(() => setSuccessMsg(null), 3000)
    } catch (err) {
      setError(err.message || 'Gagal menghapus produk')
    }
  }

  // Filter products by search
  const filteredProducts = products.filter(product => {
    const query = search.toLowerCase()
    return (
      (product.name || '').toLowerCase().includes(query) ||
      (product.species || '').toLowerCase().includes(query) ||
      (product.categories?.name || '').toLowerCase().includes(query)
    )
  })

  return (
    <div className="max-w-6xl mx-auto">
      {/* Messages */}
      {successMsg && (
        <div className="mb-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2">
          <span>✓</span> {successMsg}
        </div>
      )}
      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm font-semibold">
          {error}
        </div>
      )}      

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-extrabold text-white">Stok Ikan</h1>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Cari jenis ikan..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-300 placeholder-slate-600 w-64 focus:outline-none focus:border-teal-500/40 transition-colors"
            />
          </div>
          <button 
            onClick={handleOpenAddModal}
            className="bg-teal-500 text-slate-950 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-teal-400 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tambahkan Stok Ikan
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-slate-800 border-t-teal-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-900/60 border-b border-slate-800/60 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
            <div className="col-span-4 text-left pl-14">Jenis Ikan</div>
            <div className="col-span-2">Kategori</div>
            <div className="col-span-2">Harga</div>
            <div className="col-span-2">Ketersediaan</div>
            <div className="col-span-2">Aksi</div>
          </div>

          <div className="divide-y divide-slate-800/60">
            {filteredProducts.length === 0 ? (
              <div className="p-8 text-center text-slate-500">Tidak ada data ikan ditemukan</div>
            ) : (
              filteredProducts.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-4 px-6 py-5 items-center text-sm">
                  
                  <div className="col-span-4 flex items-center gap-4">
                    <img 
                      src={item.image_url || '/images/discus.png'} 
                      alt={item.name} 
                      onError={(e) => { e.target.src = '/images/discus.png' }}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-800" 
                    />
                    <div>
                      <h4 className="font-bold text-teal-400 mb-0.5">{item.name}</h4>
                      <p className="text-[11px] text-slate-500 font-medium">Spesies: {item.species}</p>
                      {item.badge && (
                        <span className="inline-block mt-1 px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="col-span-2 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-500/10 text-teal-400 border border-teal-500/20">
                      {item.categories?.name || 'Tidak ada'}
                    </span>
                  </div>

                  <div className="col-span-2 text-center font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">
                    Rp {Number(item.price).toLocaleString('id-ID')}
                  </div>

                  <div className="col-span-2 text-center">
                    <p className={`font-bold text-sm ${item.stock === 0 ? 'text-red-400' : item.stock <= 5 ? 'text-amber-400' : 'text-white'}`}>{item.stock} unit</p>
                    <p className={`text-[10px] mt-0.5 font-bold ${item.is_active ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {item.is_active ? 'Aktif' : 'Non-aktif'}
                    </p>
                  </div>

                  <div className="col-span-2 flex items-center justify-center gap-3">
                    <button 
                      onClick={() => handleOpenEditModal(item)}
                      className="text-teal-400 hover:text-teal-300 transition-colors cursor-pointer"
                      title="Edit Ikan"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                      title="Hapus Ikan"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Modern Modal Dialog for Add / Edit Product */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl shadow-black/50">
            <div className="px-6 py-5 bg-slate-800/60 border-b border-slate-700/60 flex items-center justify-between">
              <h3 className="font-bold text-lg text-white">
                {isEdit ? 'Ubah Informasi Ikan' : 'Tambah Ikan Baru'}
              </h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nama Produk *</label>
                  <input 
                    type="text" 
                    name="name" 
                    required
                    value={formData.name} 
                    onChange={handleInputChange}
                    placeholder="Contoh: Cobalt Blue Discus"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-500/40 transition-colors placeholder-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Spesies (Nama Ilmiah) *</label>
                  <input 
                    type="text" 
                    name="species" 
                    required
                    value={formData.species} 
                    onChange={handleInputChange}
                    placeholder="Contoh: Symphysodon"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-500/40 transition-colors placeholder-slate-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Harga (Rupiah) *</label>
                  <input 
                    type="number" 
                    name="price" 
                    required
                    min="1"
                    value={formData.price} 
                    onChange={handleInputChange}
                    placeholder="150000"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-500/40 transition-colors placeholder-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Stok Awal *</label>
                  <input 
                    type="number" 
                    name="stock" 
                    required
                    min="0"
                    value={formData.stock} 
                    onChange={handleInputChange}
                    placeholder="10"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-500/40 transition-colors placeholder-slate-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Kategori *</label>
                  <select 
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-500/40 transition-colors"
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Badge (Opsional)</label>
                  <input 
                    type="text" 
                    name="badge" 
                    value={formData.badge} 
                    onChange={handleInputChange}
                    placeholder="Contoh: Hot / Rare / New"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-500/40 transition-colors placeholder-slate-600"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase">Gambar Produk *</label>
                  <button 
                    type="button"
                    onClick={() => setUseUrl(!useUrl)}
                    className="text-xs text-teal-400 font-semibold hover:underline"
                  >
                    {useUrl ? 'Unggah File Gambar' : 'Gunakan URL Gambar'}
                  </button>
                </div>
                
                {useUrl ? (
                  <input 
                    type="text" 
                    name="image_url" 
                    required
                    value={formData.image_url} 
                    onChange={handleInputChange}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-500/40 transition-colors placeholder-slate-600"
                  />
                ) : (
                  <div className="space-y-3">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-teal-500/10 file:text-teal-400 hover:file:bg-teal-500/20 cursor-pointer"
                    />
                  </div>
                )}

                {formData.image_url && (
                  <div className="mt-3 relative w-32 h-32 rounded-2xl overflow-hidden border border-slate-700 bg-slate-800">
                    <img 
                      src={formData.image_url} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, image_url: '' }))
                        setSelectedFile(null)
                      }}

                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      &times;
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Deskripsi Produk *</label>
                <textarea 
                  name="description" 
                  required
                  rows="3"
                  value={formData.description} 
                  onChange={handleInputChange}
                  placeholder="Jelaskan karakteristik atau keindahan spesimen ikan ini..."
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-500/40 transition-colors placeholder-slate-600"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox" 
                  id="is_active" 
                  name="is_active"
                  checked={formData.is_active} 
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded accent-teal-500"
                />
                <label htmlFor="is_active" className="text-sm font-semibold text-slate-300 select-none cursor-pointer">
                  Tampilkan produk ini di halaman toko (Status Aktif)
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-700/60">
                <button 
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-slate-700 text-slate-400 rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-teal-500 text-slate-950 rounded-xl text-sm font-bold hover:bg-teal-400 transition-colors cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

