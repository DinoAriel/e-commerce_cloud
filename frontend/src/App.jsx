import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import GuestRoute from './components/GuestRoute'
import AdminRoute from './components/AdminRoute'
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import SaltwaterPage from './pages/SaltwaterPage'
import FreshwaterPage from './pages/FreshwaterPage'
import RarefishPage from './pages/RarefishPage'
import AuctionsPage from './pages/AuctionsPage'
import ProfilePage from './pages/ProfilePage'
import OrdersPage from './pages/OrdersPage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import FloatingChat from './components/FloatingChat'

// Admin Pages and Layout
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminStock from './pages/admin/AdminStock'
import AdminAuctions from './pages/admin/AdminAuctions'
import AdminOrders from './pages/admin/AdminOrders'
import AdminMessages from './pages/admin/AdminMessages'

import MyAuctions from './pages/MyAuctions'

const AUTH_ROUTES = ['/login', '/signup']

function AppLayout() {
  const location = useLocation()
  const isAuthPage = AUTH_ROUTES.includes(location.pathname)
  const isAdminPage = location.pathname.startsWith('/admin')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  const showHeaderFooter = !isAuthPage && !isAdminPage

  return (
    <>
      {showHeaderFooter && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/freshwater" element={<FreshwaterPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/saltwater" element={<SaltwaterPage />} />
        <Route path="/rarefish" element={<RarefishPage />} />
        <Route path="/auctions" element={<AuctionsPage />} />
        <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/signup" element={<GuestRoute><SignUpPage /></GuestRoute>} />
        <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
        <Route path="/my-auctions" element={<ProtectedRoute><MyAuctions /></ProtectedRoute>} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="stock" element={<AdminStock />} />
          <Route path="auctions" element={<AdminAuctions />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="messages" element={<AdminMessages />} />
        </Route>
      </Routes>
      <FloatingChat />
      {showHeaderFooter && <Footer />}
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}

export default App