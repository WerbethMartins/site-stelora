import './App.css'

// Router
import { Routes, Route } from 'react-router-dom';


// Pages
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Checkout from './pages/Checkout';
import ShoppingBag from './pages/Shopping_bag';
import ProductForm from './components/ProductForm';
import Login from './pages/Login_page';
import Register_page from './pages/Register_page';
import ForgetPassword_page from './pages/Forget-password_page';

// Context
import { CartProvider } from './context/CartContext';
import { MessageProvider } from './hooks/useMessage';


function App() {
  return (
      <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
        <main style={{ flex: 1, width: '100%' }}>
          <MessageProvider>
            <CartProvider>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/checkout/:id" element={<Checkout />} />
                <Route path="/cart" element={<ShoppingBag />} />
                <Route path="/shopping-bag/:id" element={<ShoppingBag />} />
                <Route path="/admin/product-form" element={<ProductForm />} />
                <Route path="/login" element={<Login />} />
                <Route path='/register' element={<Register_page />} />
                <Route path='/forget-password' element={<ForgetPassword_page />} />
              </Routes>
            </CartProvider>
          </MessageProvider>
        </main>
      </div>
  );
}

export default App;
