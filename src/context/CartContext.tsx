import { createContext, useContext, useState, type ReactNode, useEffect } from "react";
import type { Product } from "../data/mockProducts";

export interface CartItem {
    product: Product;
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product, quantity?: number) => void;
    updateQuantity: (productId: string | number, newQuantity: number) => void;
    removeFromCart: (productId: string | number) => void;
    totalItemsCount: number; 
    clearCart: () => void;  
}

const STORAGE_KEY = "@ecommerce:cart_v1";

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>( () => {
        try {
            const savedCart = localStorage.getItem(STORAGE_KEY);
            return savedCart ? JSON.parse(savedCart) : [];
        }catch(error) {
            console.error("Erro ao carregar o carinho do localStorage:", error);
            return [];
        }
    });

    // Salva no localStorage sempre que o estado 'cart' for alterado
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
        } catch (error) {
            console.error("Erro ao salvar o carrinho no localStorage:", error);
        }
    }, [cart]);

    // Adiciona produto ou incrementando a quantidade  se já existir no carrinho
    const addToCart = (product: Product, quantityToAdd: number = 1) => {
        setCart((prevCart) => {
            const existingItemIndex = prevCart.findIndex((item) => item.product.id === product.id);
            if (existingItemIndex !== -1) {
                const updatedCart = [...prevCart];
                updatedCart[existingItemIndex].quantity += quantityToAdd;
                return updatedCart;
            } else {
                return [...prevCart, { product, quantity: quantityToAdd }];
            }
        });
    };

    // Atualiza a quantidade de um produto no carrinho, removendo-o se a quantidade for zero
    const updateQuantity = (productId: string | number, newQuantity: number) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.product.id === productId ? { ...item, quantity: newQuantity } : item
            ).filter((item) => item.quantity > 0)
        );
    };

    // Remove um produto do carrinho
    const removeFromCart = (productId: string | number) => {
        setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
    };

    // Função utilitária para esvaziar o carrinho ao concluir uma compra
    const clearCart = () => {
        setCart([]);
    };

    const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart,totalItemsCount, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart deve ser usado dentro de um CartProvider");
    }
    return context;
};