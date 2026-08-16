import "./App.css";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { Navigate, Route, Routes } from "react-router-dom";

import ProductForm from "./components/ProductForm";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { MessageProvider } from "./hooks/useMessage";
import Catalog from "./pages/Catalog";
import Checkout from "./pages/Checkout";
import ForgetPasswordPage from "./pages/ForgetPassword_page";
import Home from "./pages/Home";
import Login from "./pages/Login_page";
import RegisterPage from "./pages/Register_page";
import ShoppingBag from "./pages/Shopping_bag";

const googleClientId = "119000959574-ecjit86tbv5vb7ft54msq91au7p4rs6v.apps.googleusercontent.com";

function AppRoutes() {
    const { user, isAdmin, isLoading } = useAuth();

    if (isLoading) {
        return <div>Carregando...</div>;
    }

    if (!user) {
        return (
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forget-password" element={<ForgetPasswordPage />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        );
    }

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/checkout/:id" element={<Checkout />} />
            <Route path="/cart" element={<ShoppingBag />} />
            <Route
                path="/admin/product-form"
                element={isAdmin ? <ProductForm /> : <Navigate to="/" replace />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

function App() {
    return (
        <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
            <main style={{ flex: 1, width: "100%" }}>
                <GoogleOAuthProvider clientId={googleClientId}>
                    <MessageProvider>
                        <AuthProvider>
                            <CartProvider>
                                <AppRoutes />
                            </CartProvider>
                        </AuthProvider>
                    </MessageProvider>
                </GoogleOAuthProvider>
            </main>
        </div>
    );
}

export default App;
