import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import SaltwaterPage from './pages/SaltwaterPage'
import RarefishPage from './pages/RarefishPage'
import AuctionsPage from './pages/AuctionsPage'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/saltwater" element={<SaltwaterPage />} />
        <Route path="/rarefish" element={<RarefishPage />} />
        <Route path="/auctions" element={<AuctionsPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App