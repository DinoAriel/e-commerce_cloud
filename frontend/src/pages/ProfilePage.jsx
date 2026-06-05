import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { getProfile, updateProfile, getUserAddresses, createAddress, updateAddress, deleteAddress } from '../lib/api'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('profil')
  const [loading, setLoading] = useState(true)
  
  // Profile State
  const [profile, setProfile] = useState(null)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [profileForm, setProfileForm] = useState({
    username: '',
    full_name: '',
    phone: '',
    gender: '',
    birth_date: ''
  })
  
  const [toastMessage, setToastMessage] = useState(null)
  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Address State
  const [addresses, setAddresses] = useState([])
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [isSavingAddress, setIsSavingAddress] = useState(false)
  const [addressForm, setAddressForm] = useState({ id: null, recipient_name: '', phone_number: '', full_address: '', is_primary: false })

  useEffect(() => {
    if (!user) { setLoading(false); return }
    loadData()
  }, [user])

  const loadData = async () => {
    setLoading(true)
    try {
      const p = await getProfile(user.id)
      setProfile(p)
      setProfileForm({
        username: p.username || '',
        full_name: p.full_name || '',
        phone: p.phone || '',
        gender: p.gender || '',
        birth_date: p.birth_date ? p.birth_date.split('T')[0] : ''
      })

      const adds = await getUserAddresses(user.id)
      setAddresses(Array.isArray(adds) ? adds : [])
    } catch (err) {
      console.error("Gagal load data:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setIsSavingProfile(true)
    try {
      const payload = {
        username: profileForm.username || null,
        full_name: profileForm.full_name || null,
        phone: profileForm.phone || null,
        gender: profileForm.gender || null,
        birth_date: profileForm.birth_date || null
      }
      await updateProfile(user.id, payload)
      showToast('Profil berhasil diperbarui')
      setIsEditingProfile(false)
      loadData()
    } catch (err) {
      showToast('Gagal simpan profil: ' + err.message)
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handleSaveAddress = async (e) => {
    e.preventDefault()
    setIsSavingAddress(true)
    try {
      if (addressForm.id) {
        await updateAddress(addressForm.id, addressForm)
      } else {
        await createAddress(addressForm)
      }
      setShowAddressModal(false)
      showToast('Alamat berhasil disimpan')
      loadData()
    } catch (err) {
      showToast('Gagal menyimpan alamat: ' + err.message)
    } finally {
      setIsSavingAddress(false)
    }
  }

  const handleDeleteAddress = async (id) => {
    if (!confirm('Yakin ingin menghapus alamat ini?')) return
    try {
      await deleteAddress(id)
      loadData()
    } catch (err) {
      alert('Gagal menghapus alamat')
    }
  }

  const handleSetPrimary = async (id) => {
    try {
      await updateAddress(id, { is_primary: true })
      loadData()
    } catch (err) {
      alert('Gagal mengubah alamat utama')
    }
  }

  const openAddAddress = () => {
    setAddressForm({ id: null, recipient_name: '', phone_number: '', full_address: '', is_primary: false })
    setShowAddressModal(true)
  }

  const openEditAddress = (addr) => {
    setAddressForm({ ...addr })
    setShowAddressModal(true)
  }

  const cancelEditProfile = () => {
    setProfileForm({
      username: profile?.username || '',
      full_name: profile?.full_name || '',
      phone: profile?.phone || '',
      gender: profile?.gender || '',
      birth_date: profile?.birth_date ? profile.birth_date.split('T')[0] : ''
    })
    setIsEditingProfile(false)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-950"><div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div></div>

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-teal-500 text-slate-950 px-6 py-3 rounded-full shadow-lg shadow-teal-500/20 font-bold text-sm animate-fade-in-down flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          {toastMessage}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="flex items-center gap-3 mb-8 px-2 md:px-0">
            <div className="w-12 h-12 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center font-bold text-lg">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-white truncate">{profile?.username || user?.email?.split('@')[0]}</p>
            </div>
          </div>
          
          <nav className="space-y-1">
            <div className="px-3 py-2 text-sm font-bold text-white flex items-center gap-2 bg-slate-900/50 rounded-lg">
              <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </div>
            <div className="pl-10 space-y-2 mb-4 py-2">
              <button onClick={() => setActiveTab('profil')} className={`block text-sm transition-colors ${activeTab === 'profil' ? 'text-teal-400 font-medium' : 'text-slate-400 hover:text-teal-400'}`}>Data Diri</button>
              <button onClick={() => setActiveTab('alamat')} className={`block text-sm transition-colors ${activeTab === 'alamat' ? 'text-teal-400 font-medium' : 'text-slate-400 hover:text-teal-400'}`}>Alamat</button>
            </div>
            
            <button onClick={() => navigate('/orders')} className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-400 hover:text-teal-400 hover:bg-slate-900/50 rounded-lg transition-colors">
              <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Pesanan Saya
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 bg-slate-900/40 rounded-2xl p-6 md:p-8 border border-slate-800/80 shadow-xl">
          
          {activeTab === 'profil' && (
            <div>
              <div className="border-b border-slate-800 pb-4 mb-6 flex justify-between items-end">
                <div>
                  <h1 className="text-xl font-bold text-white">Profil Saya</h1>
                  <p className="text-sm text-slate-400 mt-1">Kelola informasi profil Anda untuk mengontrol, melindungi dan mengamankan akun</p>
                </div>
                {!isEditingProfile && (
                  <button onClick={() => setIsEditingProfile(true)} className="px-4 py-2 bg-teal-500/10 text-teal-400 border border-teal-500/30 rounded-lg text-sm font-semibold hover:bg-teal-500 hover:text-slate-950 transition-colors">
                    Ubah Data
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveProfile} className="max-w-2xl">
                <div className="space-y-6">
                  {/* Username */}
                  <div className="flex flex-col md:flex-row md:items-center">
                    <label className="w-32 shrink-0 md:text-right pr-6 text-sm text-slate-400 mb-1 md:mb-0">Username</label>
                    {isEditingProfile ? (
                      <input type="text" value={profileForm.username} onChange={e => setProfileForm({...profileForm, username: e.target.value})} className="flex-1 max-w-sm px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm text-slate-100 placeholder-slate-600 transition-colors" />
                    ) : (
                      <p className="flex-1 max-w-sm text-sm font-medium text-slate-200">{profileForm.username || '-'}</p>
                    )}
                  </div>
                  {/* Nama */}
                  <div className="flex flex-col md:flex-row md:items-center">
                    <label className="w-32 shrink-0 md:text-right pr-6 text-sm text-slate-400 mb-1 md:mb-0">Nama</label>
                    {isEditingProfile ? (
                      <input type="text" value={profileForm.full_name} onChange={e => setProfileForm({...profileForm, full_name: e.target.value})} className="flex-1 max-w-sm px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm text-slate-100 placeholder-slate-600 transition-colors" />
                    ) : (
                      <p className="flex-1 max-w-sm text-sm font-medium text-slate-200">{profileForm.full_name || '-'}</p>
                    )}
                  </div>
                  {/* Email (Readonly) */}
                  <div className="flex flex-col md:flex-row md:items-center">
                    <label className="w-32 shrink-0 md:text-right pr-6 text-sm text-slate-400 mb-1 md:mb-0">Email</label>
                    <div className="flex-1 max-w-sm text-sm font-medium text-slate-400">
                      {user?.email}
                    </div>
                  </div>
                  {/* Phone */}
                  <div className="flex flex-col md:flex-row md:items-center">
                    <label className="w-32 shrink-0 md:text-right pr-6 text-sm text-slate-400 mb-1 md:mb-0">Nomor Telepon</label>
                    {isEditingProfile ? (
                      <input type="tel" value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})} className="flex-1 max-w-sm px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm text-slate-100 placeholder-slate-600 transition-colors" />
                    ) : (
                      <p className="flex-1 max-w-sm text-sm font-medium text-slate-200">{profileForm.phone || '-'}</p>
                    )}
                  </div>
                  {/* Gender */}
                  <div className="flex flex-col md:flex-row md:items-center">
                    <label className="w-32 shrink-0 md:text-right pr-6 text-sm text-slate-400 mb-1 md:mb-0">Jenis Kelamin</label>
                    {isEditingProfile ? (
                      <div className="flex items-center gap-4 text-sm text-slate-300">
                        <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="gender" value="Laki-laki" checked={profileForm.gender === 'Laki-laki'} onChange={e => setProfileForm({...profileForm, gender: e.target.value})} className="text-teal-500 focus:ring-teal-500 bg-slate-950 border-slate-800" /> Laki-laki</label>
                        <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="gender" value="Perempuan" checked={profileForm.gender === 'Perempuan'} onChange={e => setProfileForm({...profileForm, gender: e.target.value})} className="text-teal-500 focus:ring-teal-500 bg-slate-950 border-slate-800" /> Perempuan</label>
                        <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="gender" value="Lainnya" checked={profileForm.gender === 'Lainnya'} onChange={e => setProfileForm({...profileForm, gender: e.target.value})} className="text-teal-500 focus:ring-teal-500 bg-slate-950 border-slate-800" /> Lainnya</label>
                      </div>
                    ) : (
                      <p className="flex-1 max-w-sm text-sm font-medium text-slate-200">{profileForm.gender || '-'}</p>
                    )}
                  </div>
                  {/* Birth Date */}
                  <div className="flex flex-col md:flex-row md:items-center">
                    <label className="w-32 shrink-0 md:text-right pr-6 text-sm text-slate-400 mb-1 md:mb-0">Tanggal Lahir</label>
                    {isEditingProfile ? (
                      <input type="date" value={profileForm.birth_date} onChange={e => setProfileForm({...profileForm, birth_date: e.target.value})} className="max-w-[200px] px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm text-slate-100 transition-colors [color-scheme:dark]" />
                    ) : (
                      <p className="flex-1 max-w-sm text-sm font-medium text-slate-200">{profileForm.birth_date ? new Date(profileForm.birth_date).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'}) : '-'}</p>
                    )}
                  </div>

                  {isEditingProfile && (
                    <div className="flex items-center pt-4">
                      <div className="w-32 shrink-0 hidden md:block"></div>
                      <div className="flex gap-3">
                        <button type="button" onClick={cancelEditProfile} className="px-6 py-2 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium">Batal</button>
                        <button type="submit" disabled={isSavingProfile} className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-8 py-2 rounded-lg transition-colors text-sm disabled:opacity-50 shadow-md">
                          {isSavingProfile ? 'Menyimpan...' : 'Simpan'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </div>
          )}

          {activeTab === 'alamat' && (
            <div>
              <div className="border-b border-slate-800 pb-4 mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <h1 className="text-xl font-bold text-white">Alamat Saya</h1>
                <button onClick={openAddAddress} className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl transition-all text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                  Tambah Alamat Baru
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="text-center py-16 bg-slate-950/50 rounded-2xl border border-slate-800 border-dashed">
                  <p className="text-slate-500 font-medium">Belum ada alamat tersimpan.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {addresses.map(addr => (
                    <div key={addr.id} className="bg-slate-950/50 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:justify-between gap-4 transition-colors hover:border-slate-700">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-bold text-white">{addr.recipient_name}</span>
                          <span className="text-slate-600">|</span>
                          <span className="text-slate-400 text-sm">{addr.phone_number}</span>
                        </div>
                        <p className="text-sm text-slate-400 max-w-xl leading-relaxed">{addr.full_address}</p>
                        {addr.is_primary && <span className="inline-block mt-3 px-2 py-0.5 border border-teal-500 text-teal-400 bg-teal-500/10 text-[10px] font-bold tracking-wider uppercase rounded">Utama</span>}
                      </div>
                      <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-2 mt-2 md:mt-0 pt-3 md:pt-0 border-t border-slate-800 md:border-none">
                        <div className="flex gap-4">
                          <button onClick={() => openEditAddress(addr)} className="text-teal-400 hover:text-teal-300 font-medium text-sm transition-colors">Ubah</button>
                          {!addr.is_primary && (
                            <button onClick={() => handleDeleteAddress(addr.id)} className="text-red-400 hover:text-red-300 font-medium text-sm transition-colors">Hapus</button>
                          )}
                        </div>
                        {!addr.is_primary && (
                          <button onClick={() => handleSetPrimary(addr.id)} className="px-3 py-1.5 border border-slate-700 rounded-lg text-slate-300 text-xs font-medium hover:bg-slate-800 transition-colors mt-2">
                            Jadikan Utama
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <h2 className="text-lg font-bold text-white">{addressForm.id ? 'Ubah Alamat' : 'Alamat Baru'}</h2>
              <button onClick={() => setShowAddressModal(false)} className="text-slate-500 hover:text-slate-300 transition-colors text-2xl">&times;</button>
            </div>
            <form onSubmit={handleSaveAddress} className="p-6">
              <div className="space-y-5">
                <div className="flex flex-col md:flex-row gap-5">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Nama Lengkap</label>
                    <input type="text" required value={addressForm.recipient_name} onChange={e => setAddressForm({...addressForm, recipient_name: e.target.value})} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm text-white placeholder-slate-600 transition-colors" placeholder="Budi Santoso" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Nomor Telepon</label>
                    <input type="text" required value={addressForm.phone_number} onChange={e => setAddressForm({...addressForm, phone_number: e.target.value})} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm text-white placeholder-slate-600 transition-colors" placeholder="08123456789" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Alamat Lengkap</label>
                  <textarea required rows="3" value={addressForm.full_address} onChange={e => setAddressForm({...addressForm, full_address: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm text-white placeholder-slate-600 resize-none transition-colors" placeholder="Nama Jalan, Gedung, No. Rumah..."></textarea>
                </div>
                <label className="flex items-center gap-3 text-sm text-slate-300 cursor-pointer w-max mt-2">
                  <input type="checkbox" checked={addressForm.is_primary} onChange={e => setAddressForm({...addressForm, is_primary: e.target.checked})} className="rounded bg-slate-950 border-slate-700 text-teal-500 focus:ring-teal-500 focus:ring-offset-slate-900 w-4 h-4 transition-colors" />
                  <span className="font-medium">Jadikan sebagai alamat utama</span>
                </label>
              </div>
              <div className="mt-8 flex justify-end gap-3 pt-5 border-t border-slate-800/50">
                <button type="button" onClick={() => setShowAddressModal(false)} className="px-5 py-2.5 border border-slate-700 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-800 transition-colors">Batal</button>
                <button type="submit" disabled={isSavingAddress} className="px-6 py-2.5 bg-teal-500 text-slate-950 rounded-xl text-sm font-bold hover:bg-teal-400 transition-colors disabled:opacity-50 shadow-lg shadow-teal-500/20">
                  {isSavingAddress ? 'Menyimpan...' : 'Simpan Alamat'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
