import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import GuestRoute from './components/GuestRoute'
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import SaltwaterPage from './pages/SaltwaterPage'
import FreshwaterPage from './pages/FreshwaterPage'
import RarefishPage from './pages/RarefishPage'
import AuctionsPage from './pages/AuctionsPage'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'

const AUTH_ROUTES = ['/login', '/signup']

function AppLayout() {
  const location = useLocation()
  const isAuthPage = AUTH_ROUTES.includes(location.pathname)

  return (
    <>
      {!isAuthPage && <Navbar />}
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
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      </Routes>
      {!isAuthPage && <Footer />}
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